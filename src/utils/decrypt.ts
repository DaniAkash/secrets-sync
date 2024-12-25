import { createReadStream, createWriteStream, promises as fs } from "node:fs";
import { getKeyAndIV } from "./getKeyAndIV";
import { createDecipheriv } from "node:crypto";
import { env } from "./env";

const TAG_LENGTH = 16;

export const decrypt = async (
	path: string,
	outputPath: string,
	password: string,
) => {
	const inputHandle = await fs.open(path, "r");

	const { size } = await inputHandle.stat();

	if (size <= Number(env.SALT_LENGTH) + TAG_LENGTH) {
		throw new Error(
			"File is too small to contain salt, tag, and encrypted data.",
		);
	}

	const salt = Buffer.alloc(Number(env.SALT_LENGTH));
	const tag = Buffer.alloc(TAG_LENGTH);

	await inputHandle.read(salt, 0, Number(env.SALT_LENGTH), 0);
	await inputHandle.read(tag, 0, TAG_LENGTH, size - TAG_LENGTH);

	await inputHandle.close();

	const input = createReadStream(path, {
		start: Number(env.SALT_LENGTH),
		end: size - TAG_LENGTH - 1,
	});

	const { key, iv } = getKeyAndIV(password, salt);

	const decipher = createDecipheriv("aes-256-gcm", key, iv);

	decipher.setAuthTag(tag);

	const output = createWriteStream(outputPath);
	input.pipe(decipher).pipe(output);
	output.on("finish", () => {
		console.log(`File decrypted successfully: ${outputPath}`);
	});
};
