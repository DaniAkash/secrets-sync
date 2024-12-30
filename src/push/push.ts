import type { Stats } from "node:fs";
import { stat } from "node:fs/promises";
import { join } from "node:path";
import { cwd } from "node:process";
import { confirm, input } from "@inquirer/prompts";
import chalk from "chalk";
import { getDefaultFileName } from "../utils/getDefaultFileName";
import { alert, success } from "../utils/messages";
import { readConfig } from "../utils/readConfig";
import { getFileModifiedTime } from "./getFileModifiedTime";
import { uploadFile } from "./uploadFile";

interface PushArgs {
	fileName: string;
	overwrite: boolean;
	path?: string;
}

export const push = async ({ fileName, overwrite, path }: PushArgs) => {
	const filePath = join(cwd(), fileName);
	let fileStat: Stats;
	try {
		fileStat = await stat(filePath);
	} catch {
		throw new Error("File does not exist");
	}
	if (!fileStat.isFile()) {
		throw new Error("The provided path is not a file.");
	}
	const fileModifiedTime = fileStat.mtime;

	const defaultUploadFileName = await getDefaultFileName(filePath);
	let uploadFileName =
		path ??
		(await input({
			message: `(Leave empty to use the default file name)\nFile name on the S3 bucket ${chalk.green(`(${defaultUploadFileName})`)}:`,
		}));
	if (!uploadFileName) {
		uploadFileName = defaultUploadFileName;
		success(`Using the default file name: ${defaultUploadFileName}`);
	}
	const config = await readConfig();
	const remoteFileModifiedTime = await getFileModifiedTime({
		fileName: uploadFileName,
		s3AccessKeyId: config.s3AccessKeyId,
		s3SecretAccessKey: config.s3SecretAccessKey,
		s3BucketName: config.s3BucketName,
		s3Endpoint: config.s3Endpoint,
		s3AccountId: config.s3AccountId,
	});

	/**
	 * User has already provided the overwrite flag - no need to ask for confirmation
	 */
	let confirmation = overwrite;
	if (confirmation) {
		return await uploadFile({ filePath, uploadFileName });
	}

	/**
	 * Remote file doesn't exist - can upload without confirmation
	 */
	if (remoteFileModifiedTime === false) {
		return await uploadFile({ filePath, uploadFileName });
	}

	/**
	 * Remote file exists - ask for confirmation
	 */
	if (remoteFileModifiedTime > fileModifiedTime) {
		confirmation = await confirm({
			message:
				"A newer version of the file exists on the server. Do you want to overwrite it?",
		});
	} else if (remoteFileModifiedTime < fileModifiedTime) {
		confirmation = await confirm({
			message:
				"A version of the file already exists on the server. Do you want to overwrite it?",
		});
	}
	if (confirmation) {
		return await uploadFile({ filePath, uploadFileName });
	}
	alert("File upload cancelled.");
};
