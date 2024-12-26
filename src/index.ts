import { join } from "node:path";
import { getSignedUrl } from "./utils/getSignedUrl";
import { uploadFileToS3 } from "./utils/uploadFileToS3";

const fileName = ".env.enc";

const signedUrl = await getSignedUrl(fileName);

const filePath = join(process.cwd(), fileName);

try {
	await uploadFileToS3(signedUrl, filePath);
} catch (error) {
	// biome-ignore lint/suspicious/noConsole: <explanation>
	console.error("failed", error);
}
