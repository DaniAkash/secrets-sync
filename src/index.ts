import { S3Client, ListObjectsCommand } from "@aws-sdk/client-s3";
import { env } from "./utils/env";

const s3Client = new S3Client({
    region: env.S3_REGION,
    credentials: {
        accessKeyId: env.S3_ACCESS_KEY_ID,
        secretAccessKey: env.S3_SECRET_ACCESS_KEY
    },
    endpoint: env.S3_ENDPOINT,
});

const command = new ListObjectsCommand({
    Bucket: 'secrets-sync'
});

try {
    const response = await s3Client.send(command);
    console.log(response);
} catch (error) {
    console.error(error);
}