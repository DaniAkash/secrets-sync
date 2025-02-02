import { AwsClient } from "aws4fetch";
import packageJSON from "../../package.json";
import { constructBaseUrl } from "../utils/constructBaseUrl";
import { error, success } from "../utils/messages";
import type { AWSConfigSchema } from "./configSchema";

export const validateConfig = async (
	config: AWSConfigSchema,
): Promise<boolean> => {
	const aws = new AwsClient({
		accessKeyId: config.s3AccessKeyId,
		secretAccessKey: config.s3SecretAccessKey,
	});
	const baseUrl = constructBaseUrl({
		s3BucketName: config.s3BucketName,
		s3Endpoint: config.s3Endpoint,
		s3AccountId: config.s3AccountId,
	});
	const url = new URL(baseUrl);
	try {
		const response = await aws.fetch(url, { method: "HEAD" });
		if (response.ok) {
			success("configuration validated successfully");
			return true;
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
