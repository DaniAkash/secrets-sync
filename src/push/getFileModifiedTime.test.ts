import { describe, expect, it } from "vitest";
import { env } from "../utils/env";
import { getFileModifiedTime } from "./getFileModifiedTime";

describe("getFileModifiedTime", () => {
	it("should return modified time if the file exists", async () => {
		const isAvailable = await getFileModifiedTime({
			s3AccessKeyId: env.S3_ACCESS_KEY_ID,
			s3SecretAccessKey: env.S3_SECRET_ACCESS_KEY,
			s3BucketName: env.S3_BUCKET_NAME,
			s3Endpoint: env.S3_ENDPOINT,
			s3AccountId: env.S3_ACCOUNT_ID,
			fileName: ".env.enc",
		});
		expect(isAvailable).toBeTypeOf("object");
	});

	it("should return false if the file does not exist", async () => {
		const isAvailable = await getFileModifiedTime({
			s3AccessKeyId: env.S3_ACCESS_KEY_ID,
			s3SecretAccessKey: env.S3_SECRET_ACCESS_KEY,
			s3BucketName: env.S3_BUCKET_NAME,
			s3Endpoint: env.S3_ENDPOINT,
			s3AccountId: env.S3_ACCOUNT_ID,
			fileName: "non-existent-file",
		});
		expect(isAvailable).toBe(false);
	});
});
