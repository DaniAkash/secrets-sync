import { readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { encrypt } from "./encrypt";

describe("encrypt unit tests", () => {
	test("encrypts the provided file", async () => {
		const prefix = Math.random();
		const fileContent = "foo=bar";
		const path = join(tmpdir(), `${prefix}-test.txt`);
		const outputPath = join(tmpdir(), `${prefix}-test.enc`);
		const password = "password";
		writeFileSync(path, fileContent);
		await encrypt(path, outputPath, password);
		const encryptedContent = readFileSync(outputPath, "utf8");
		expect(encryptedContent).toBeTruthy();
		expect(encryptedContent).not.includes(fileContent);
	});

	test("invalid file path", async () => {
		const prefix = Math.random();
		const path = join(tmpdir(), `${prefix}-non-existent-file.txt`);
		const outputPath = join(tmpdir(), `${prefix}-test.enc`);
		const password = "password";
		try {
			await encrypt(path, outputPath, password);
		} catch (error) {
			expect(error).toBeTruthy();
			expect(error.message).toBe(
				`ENOENT: no such file or directory, open '${path}'`,
			);
		}
	});
});
