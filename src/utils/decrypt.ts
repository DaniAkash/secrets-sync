import { createDecipheriv } from "node:crypto";
import { promises as fs, createReadStream, createWriteStream } from "node:fs";
import { getKeyAndIV } from "./getKeyAndIV";

const TAG_LENGTH = 16;
const SALT_LENGTH = 16;

export const decrypt = async (
	path: string,
	outputPath: string,
	password: string,
) => {
	const inputHandle = await fs.open(path, "r");

	const { size } = await inputHandle.stat();

	if (size <= Number(SALT_LENGTH) + TAG_LENGTH) {
		throw new Error(
			"File is too small to contain salt, tag, and encrypted data.",
		);
	}

	const salt = Buffer.alloc(Number(SALT_LENGTH));
	const tag = Buffer.alloc(TAG_LENGTH);

	await inputHandle.read(salt, 0, Number(SALT_LENGTH), 0);
	await inputHandle.read(tag, 0, TAG_LENGTH, size - TAG_LENGTH);

	await inputHandle.close();

	return new Promise<void>((resolve, reject) => {
		const input = createReadStream(path, {
			start: Number(SALT_LENGTH),
			end: size - TAG_LENGTH - 1,
		});

		const { key, iv } = getKeyAndIV(password, salt);

		const decipher = createDecipheriv("aes-256-gcm", key, iv);

		decipher.setAuthTag(tag);

		const output = createWriteStream(outputPath);
		input.pipe(decipher).pipe(output);
		output.on("finish", () => {
			// biome-ignore lint/suspicious/noConsole: <explanation>
			console.log(`File decrypted successfully: ${outputPath}`);
			resolve();
		});
		input.on("error", reject);
		decipher.on("error", reject);
		output.on("error", reject);
	});
};
