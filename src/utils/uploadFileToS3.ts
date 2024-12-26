import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import fetch, { type RequestInit } from "node-fetch";

export const uploadFileToS3 = async (
	signedUrl: string,
	filePath: string,
): Promise<void> => {
	const fileStats = await stat(filePath);
	const fileSize = fileStats.size;

	const fileStream = createReadStream(filePath);

	const options: RequestInit = {
		method: "PUT",
		body: fileStream,
		headers: {
			"Content-Type": "application/octet-stream",
			"Content-Length": fileSize.toString(),
		},
	};

	const response = await fetch(signedUrl, options);

	if (response.ok) {
		return;
	}

	throw new Error(`File upload failed with status: ${response.status}`, {
		cause: await response.text(),
	});
};
