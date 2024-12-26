import { AwsClient } from "aws4fetch";
import { env } from "./env";

export const getSignedUrl = async (fileName: string) => {
	const r2 = new AwsClient({
		accessKeyId: env.S3_ACCESS_KEY_ID,
		secretAccessKey: env.S3_SECRET_ACCESS_KEY,
	});
	const bucketName = env.S3_BUCKET_NAME;
	const accountId = env.S3_ACCOUNT_ID;

	const url = new URL(
		`https://${bucketName}.${accountId}.r2.cloudflarestorage.com`,
	);

	url.pathname = `/${fileName}`;

	url.searchParams.set("X-Amz-Expires", "3600");

	const signed = await r2.sign(
		new Request(url, {
			method: "PUT",
		}),
		{
			aws: { signQuery: true },
		},
	);

	const response = new Response(signed.url, { status: 200 });

	const signedUrl = await response.text();

	return signedUrl;
};
