import { randomBytes, createCipheriv } from "node:crypto";
import { getKeyAndIV } from "./getKeyAndIV";
import { createReadStream, createWriteStream } from "node:fs";
import { env } from "./env";

export const encrypt = async (
	path: string,
	outputPath: string,
	password: string,
) => {
	return new Promise<void>((resolve) => {
		const salt = randomBytes(Number(env.SALT_LENGTH));

		const { key, iv } = getKeyAndIV(password, salt);

		const cipher = createCipheriv("aes-256-gcm", key, iv);

		const input = createReadStream(path);
		const output = createWriteStream(outputPath);
		output.write(salt);
		input.pipe(cipher).pipe(output);
		output.on("finish", () => {
			const authTag = cipher.getAuthTag();
			const tagOutput = createWriteStream(outputPath, { flags: "a" });
			tagOutput.write(authTag, () => {
				console.log(`File encrypted successfully: ${outputPath}`);
				resolve();
			});
		});
	});
};
