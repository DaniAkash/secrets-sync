import { stat } from "node:fs/promises";
import { join } from "node:path";
import { cwd } from "node:process";
import { confirm, input } from "@inquirer/prompts";
import { alert } from "../utils/messages";
import type { Stats } from "node:fs";
import { getDefaultFileName } from "../utils/getDefaultFileName";
import { getFileModifiedTime } from "../push/getFileModifiedTime";
import { readConfig } from "../utils/readConfig";
import chalk from "chalk";
import { downloadFileFromS3 } from "../utils/downloadFileFromS3";
import { decrypt } from "../utils/decrypt";

interface PullArgs {
	fileName: string;
	overwrite: boolean;
	path?: string;
}

export const pull = async ({ fileName, overwrite, path }: PullArgs) => {
	const filePath = !path ? join(cwd(), fileName) : join(cwd(), path, fileName);
	let doesFileAlreadyExist: boolean;
	let fileStat: Stats | undefined;
	try {
		fileStat = await stat(filePath);
		doesFileAlreadyExist = fileStat.isFile();
	} catch {
		fileStat = undefined;
		doesFileAlreadyExist = false;
	}
	const fileModifiedTime = fileStat?.mtime;
	let remoteFileName = fileName.includes("/")
		? fileName
		: await getDefaultFileName(filePath);
	const config = await readConfig();
	let remoteFileModifiedTime = await getFileModifiedTime({
		fileName: remoteFileName,
		s3AccessKeyId: config.s3AccessKeyId,
		s3SecretAccessKey: config.s3SecretAccessKey,
		s3BucketName: config.s3BucketName,
		s3Endpoint: config.s3Endpoint,
		s3AccountId: config.s3AccountId,
	});
	while (true) {
		if (!remoteFileModifiedTime) {
			remoteFileName = await input({
				message: `The file: ${chalk.yellow(remoteFileName)} does not exist in the S3 bucket. Please provide the correct file name:`,
			});
			remoteFileModifiedTime = await getFileModifiedTime({
				fileName: remoteFileName,
				s3AccessKeyId: config.s3AccessKeyId,
				s3SecretAccessKey: config.s3SecretAccessKey,
				s3BucketName: config.s3BucketName,
				s3Endpoint: config.s3Endpoint,
				s3AccountId: config.s3AccountId,
			});
			continue;
		}
		break;
	}

	if (doesFileAlreadyExist) {
		if (!overwrite && fileModifiedTime) {
			const message =
				remoteFileModifiedTime > fileModifiedTime
					? "The file already exists in the provided path. Do you want to overwrite it?"
					: "The remote file has been modified more recently than the local file. Do you still want to overwrite the local file?";
			const confirmation = await confirm({
				message,
			});
			if (!confirmation) {
				alert("Pull operation cancelled.");
				return;
			}
		}
	}

	const encryptedFilePath = await downloadFileFromS3(remoteFileName, {
		accessKeyId: config.s3AccessKeyId,
		secretAccessKey: config.s3SecretAccessKey,
		bucketName: config.s3BucketName,
		endpoint: config.s3Endpoint,
		accountId: config.s3AccountId,
	});

	await decrypt(encryptedFilePath, filePath, config.encryptionKey);
};
