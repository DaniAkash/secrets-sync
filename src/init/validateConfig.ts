import { AwsClient } from "aws4fetch";
import type { InferInput } from "valibot";
import packageJSON from "../../package.json";
import { error, success } from "../utils/messages";
import type { configSchema } from "./configSchema";

export const validateConfig = async (
	config: InferInput<typeof configSchema>,
): Promise<boolean> => {
	const aws = new AwsClient({
		accessKeyId: config.s3AccessKeyId,
		secretAccessKey: config.s3SecretAccessKey,
	});
	const baseUrl = config.s3AccountId
		? `https://${config.s3BucketName}.${config.s3AccountId}.${config.s3Endpoint}`
		: `https://${config.s3BucketName}.${config.s3Endpoint}`;
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
