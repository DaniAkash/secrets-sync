import { describe, expect, it } from "vitest";
import { env } from "../utils/env";
import { validateConfig } from "./validateConfig";

describe("validateConfig tests", () => {
	it("should validate the config", async () => {
		const validationResult = await validateConfig({
			encryptionKey: "foo/bar",
			s3AccessKeyId: env.S3_ACCESS_KEY_ID,
			s3SecretAccessKey: env.S3_SECRET_ACCESS_KEY,
			s3BucketName: env.S3_BUCKET_NAME,
			s3Endpoint: env.S3_ENDPOINT,
			s3AccountId: env.S3_ACCOUNT_ID,
		});
		expect(validationResult).toBe(true);
	});

	it("fails with invalid config", async () => {
		const validationResult = await validateConfig({
			encryptionKey: "foo/bar",
			s3AccessKeyId: env.S3_ACCESS_KEY_ID,
			s3SecretAccessKey: env.S3_SECRET_ACCESS_KEY,
			s3BucketName: env.S3_BUCKET_NAME,
			s3Endpoint: "invalid",
		});
		expect(validationResult).toBe(false);
	});
});
