import { AwsClient } from "aws4fetch";

interface S3Config {
	accessKeyId: string;
	secretAccessKey: string;
	bucketName: string;
	endpoint: string;
	accountId?: string;
}

export const getSignedUrl = async (
	fileName: string,
	{ accessKeyId, secretAccessKey, bucketName, endpoint, accountId }: S3Config,
) => {
	const r2 = new AwsClient({
		accessKeyId,
		secretAccessKey,
	});

	const baseUrl = accountId
		? `https://${bucketName}.${accountId}.${endpoint}`
		: `https://${bucketName}.${endpoint}`;

	const url = new URL(baseUrl);

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
