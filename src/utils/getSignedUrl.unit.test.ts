import { describe, expect, it } from "vitest";
import { getSignedUrl } from "./getSignedUrl";
import { env } from "./env";

describe("getSignedUrl unit tests", () => {
	it("returns a signed url", async () => {
		const fileName = Math.random().toString();
		const signedUrl = await getSignedUrl(fileName, {
			accessKeyId: env.S3_ACCESS_KEY_ID,
			secretAccessKey: env.S3_SECRET_ACCESS_KEY,
			bucketName: env.S3_BUCKET_NAME,
			endpoint: env.S3_ENDPOINT,
			accountId: env.S3_ACCOUNT_ID,
		});
		expect(() => new URL(signedUrl)).not.toThrowError();
	});
});
