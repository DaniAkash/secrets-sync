import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { encrypt } from "../utils/encrypt";
import { getSignedUrl } from "../utils/getSignedUrl";
import { success } from "../utils/messages";
import { readConfig } from "../utils/readConfig";
import { uploadFileToS3 } from "../utils/uploadFileToS3";

type UploadFileArgs = {
	filePath: string;
	uploadFileName: string;
};

export const uploadFile = async ({
	filePath,
	uploadFileName,
}: UploadFileArgs) => {
	const config = await readConfig();

	const encryptedFilePath = join(tmpdir(), basename(filePath));

	await encrypt(filePath, encryptedFilePath, config.encryptionKey);

	const signedUrl = await getSignedUrl(uploadFileName, {
		accessKeyId: config.s3AccessKeyId,
		secretAccessKey: config.s3SecretAccessKey,
		bucketName: config.s3BucketName,
		endpoint: config.s3Endpoint,
		accountId: config.s3AccountId,
	});

	await uploadFileToS3(signedUrl, encryptedFilePath);

	success(`File uploaded successfully: ${uploadFileName}`);
};
