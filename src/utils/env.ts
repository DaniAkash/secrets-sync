import { ValiError, object, parse, string } from "valibot";

const EnvSchema = object({
	S3_ACCESS_KEY_ID: string(),
	S3_SECRET_ACCESS_KEY: string(),
	S3_ACCOUNT_ID: string(),
	S3_BUCKET_NAME: string(),
	S3_ENDPOINT: string(),
});

try {
	parse(EnvSchema, process.env);
} catch (error) {
	if (error instanceof ValiError) {
		let message = "Missing required values in .env:\n";
		for (const issue of error.issues) {
			message += `${issue.path?.map((e: { key: string }) => e.key)?.join(",")}\n`;
		}
		const e = new Error(message);
		e.stack = "";
		throw e;
	}
	// biome-ignore lint/suspicious/noConsole: allowed to display error information
	console.error(error);
	throw error;
}

export const env = parse(EnvSchema, process.env);
