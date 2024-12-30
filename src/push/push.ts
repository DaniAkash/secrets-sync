import { stat } from "node:fs/promises";
import { join } from "node:path";
import { cwd } from "node:process";
import { getFileModifiedTime } from "./getFileModifiedTime";
import { readConfig } from "../utils/readConfig";
import { confirm } from "@inquirer/prompts";

interface PushArgs {
	fileName: string;
	overwrite: boolean;
	path: string;
}

export const push = async ({ fileName, overwrite, path }: PushArgs) => {
	const filePath = join(cwd(), fileName);
	let fileStat;
	try {
		fileStat = await stat(filePath);
	} catch {
		throw new Error("File does not exist");
	}
	if (!fileStat.isFile()) {
		throw new Error("The provided path is not a file.");
	}
	const fileModifiedTime = fileStat.mtime;
	const config = await readConfig();
	const remoteFileModifiedTime = await getFileModifiedTime({
		fileName: fileName,
		s3AccessKeyId: config.s3AccessKeyId,
		s3SecretAccessKey: config.s3SecretAccessKey,
		s3BucketName: config.s3BucketName,
		s3Endpoint: config.s3Endpoint,
		s3AccountId: config.s3AccountId,
	});
	if (remoteFileModifiedTime === false) {
		// upload file
		return;
	}
	let confirmation = false;
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
		// upload file
	}
};
