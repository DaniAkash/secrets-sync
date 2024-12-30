import { AwsClient } from "aws4fetch";
import packageJSON from "../../package.json";
import type { AWSConfigSchema } from "../init/configSchema";
import { constructBaseUrl } from "../utils/constructBaseUrl";
import { error } from "../utils/messages";

type GetFileModifiedTimeOptions = Omit<AWSConfigSchema, "encryptionKey"> & {
	fileName: string;
};

export const getFileModifiedTime = async (
	config: GetFileModifiedTimeOptions,
): Promise<Date | false> => {
	const aws = new AwsClient({
		accessKeyId: config.s3AccessKeyId,
		secretAccessKey: config.s3SecretAccessKey,
	});
	const baseUrl = constructBaseUrl({
		s3BucketName: config.s3BucketName,
		s3Endpoint: config.s3Endpoint,
		s3AccountId: config.s3AccountId,
	});
	const url = new URL(`${baseUrl}/${config.fileName}`);
	try {
		const response = await aws.fetch(url, { method: "HEAD" });
		if (response.ok) {
			const lastModifiedTime = response.headers.get("last-modified");
			if (lastModifiedTime) return new Date(lastModifiedTime);
		}
		error(
			`Failed to access bucket "${config.s3BucketName}":\n`,
			response.status,
			response.statusText,
			`\nCheck your configuration or file an issue on GitHub - ${packageJSON.bugs.url}`,
		);
	} catch (e) {
		error("Error validating bucket:", e);
		error(
			`\nCheck your configuration or file an issue on GitHub - ${packageJSON.bugs.url}`,
		);
	}
	return false;
};
