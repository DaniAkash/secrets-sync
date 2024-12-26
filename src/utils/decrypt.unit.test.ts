import { readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { decrypt } from "./decrypt";
import { encrypt } from "./encrypt";

describe("decrypt unit tests", () => {
	it("should decrypt the provided file", async () => {
		const prefix = Math.random();
		const fileContent = "foo=bar";
		const path = join(tmpdir(), `${prefix}-test.txt`);
		writeFileSync(path, fileContent);
		const outputPath = join(tmpdir(), `${prefix}-test.enc`);
		const password = "password";
		await encrypt(path, outputPath, password);
		const decryptedFilePath = join(tmpdir(), `${prefix}-test.dec`);
		await decrypt(outputPath, decryptedFilePath, password);
		const decryptedContent = readFileSync(decryptedFilePath, "utf8");
		expect(decryptedContent).toBe(fileContent);
	});

	it("should throw an error if the file is too small", async () => {
		const prefix = Math.random();
		const fileContent = "foo=bar";
		const path = join(tmpdir(), `${prefix}-test.txt`);
		writeFileSync(path, fileContent);
		try {
			await decrypt(path, join(tmpdir(), `${prefix}-test.dec`), "password");
		} catch (error) {
			expect(error).toBeTruthy();
			expect(error.message).toBe(
				"File is too small to contain salt, tag, and encrypted data.",
			);
		}
	});
});
