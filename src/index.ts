#! /usr/bin/env node
import { program } from "commander";
import packageJSON from "../package.json";
import { init } from "./init/init";

program
	.name(packageJSON.name)
	.description(packageJSON.description)
	.version(packageJSON.version);

/**
 * Initialize the program on a new machine
 */
program
	.command("init")
	.description(
		`Initialize ${packageJSON.name} on a new machine with S3 credentials and encryption password.`,
	)
	.action(async () => {
		await init();
	});

program.parse();

// import { join } from "node:path";
// import { getSignedUrl } from "./utils/getSignedUrl";
// import { uploadFileToS3 } from "./utils/uploadFileToS3";
// import { env } from "./utils/env";

// const fileName = ".env.enc";

// const signedUrl = await getSignedUrl(fileName, {
// 	accessKeyId: env.S3_ACCESS_KEY_ID,
// 	secretAccessKey: env.S3_SECRET_ACCESS_KEY,
// 	bucketName: env.S3_BUCKET_NAME,
// 	endpoint: env.S3_ENDPOINT,
// 	accountId: env.S3_ACCOUNT_ID,
// });

// const filePath = join(process.cwd(), fileName);

// try {
// 	await uploadFileToS3(signedUrl, filePath);
// } catch (error) {
// 	// biome-ignore lint/suspicious/noConsole: <explanation>
// 	console.error("failed", error);
// }
