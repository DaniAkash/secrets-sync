import { object, optional, string } from "valibot";

export const configSchema = object({
	encryptionKey: string(),
	s3AccessKeyId: string(),
	s3SecretAccessKey: string(),
	s3AccountId: optional(string()),
	s3BucketName: string(),
	s3Endpoint: string(),
});
