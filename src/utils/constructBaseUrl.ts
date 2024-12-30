interface BaseURLOptions {
	s3BucketName: string;
	s3Endpoint: string;
	s3AccountId?: string;
}

export const constructBaseUrl = ({
	s3BucketName,
	s3Endpoint,
	s3AccountId,
}: BaseURLOptions) => {
	return s3AccountId
		? `https://${s3BucketName}.${s3AccountId}.${s3Endpoint}`
		: `https://${s3BucketName}.${s3Endpoint}`;
};
