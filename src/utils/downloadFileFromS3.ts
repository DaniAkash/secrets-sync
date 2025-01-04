import { AwsClient } from "aws4fetch";
import { constructBaseUrl } from "./constructBaseUrl";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { createWriteStream } from "node:fs";
import { Readable } from "node:stream";
import { error } from "./messages";

interface S3Config {
	accessKeyId: string;
	secretAccessKey: string;
	bucketName: string;
	endpoint: string;
	accountId?: string;
}

export const downloadFileFromS3 = async (
	fileName: string,
	{ accessKeyId, secretAccessKey, bucketName, endpoint, accountId }: S3Config,
) => {
	try {
		const encryptedFilePath = join(tmpdir(), basename(fileName));

		const r2 = new AwsClient({
			accessKeyId,
			secretAccessKey,
		});

		const baseUrl = constructBaseUrl({
			s3BucketName: bucketName,
			s3Endpoint: endpoint,
			s3AccountId: accountId,
		});

		const url = new URL(baseUrl);

		url.pathname = `/${fileName}`;

		const response = await r2.fetch(url, { method: "GET" });

		if (!response.ok) {
			throw new Error(
				`Failed to download file: ${response.status} ${response.statusText}`,
			);
		}

		if (!response.body) {
			throw new Error("Failed to download file: No response body");
		}

		const fileStream = createWriteStream(encryptedFilePath);

		const nodeStream = Readable.fromWeb(response.body);

		nodeStream.pipe(fileStream);

		await new Promise((resolve, reject) => {
			fileStream.on("finish", resolve);
			fileStream.on("error", reject);
		});

		return encryptedFilePath;
	} catch (e) {
		error(e);
		throw new Error("Failed to download file");
	}
};
