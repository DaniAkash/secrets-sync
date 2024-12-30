import { mkdir, writeFile } from "node:fs/promises";
import { confirm, input, password } from "@inquirer/prompts";
import { type DiversityType, passwordStrength } from "check-password-strength";
import { configPath } from "../utils/configPath";
import { alert, success } from "../utils/messages";
import { paths } from "../utils/paths";
import { readConfig } from "../utils/readConfig";
import type { AWSConfigSchema } from "./configSchema";
import { validateConfig } from "./validateConfig";

export const init = async () => {
	const confirmation = await getConfirmation();
	if (!confirmation) return;
	const newConfig = await getConfig();
	const isValid = await validateConfig(newConfig);
	if (isValid) {
		await mkdir(paths.config, { recursive: true });
		await writeFile(configPath, JSON.stringify(newConfig, null, 2));
		success("Configuration saved successfully.", configPath);
	}
};

const getConfirmation = async (): Promise<boolean> => {
	try {
		await readConfig();
		const confirmation = await confirm({
			message: "Configuration already exists. Do you want to reinitialize?",
		});
		if (!confirmation) {
			alert("Configuration already exists. Exiting...");
			return false;
		}
		alert("Reinitializing configuration, old config will be overwritten.");
	} catch {
		throw new Error("Invalid config file, reinitializing...");
	}
	return true;
};

const getConfig = async (): Promise<AWSConfigSchema> => {
	const encryptionKey = await password({
		message: "Enter an encryption key:",
		validate: (value) => {
			const result = passwordStrength(value);
			if (result.id >= 2) return true;
			const mandatory: DiversityType[] = [
				"lowercase",
				"uppercase",
				"symbol",
				"number",
			];
			const missing = mandatory.filter(
				(type) => !result.contains.includes(type),
			);
			if (result.length < 8)
				return `Password must be at least 8 characters long and contain atleast ${mandatory.join(", ")}.`;
			if (missing.length) {
				return `Password must contain at least one ${missing.join(", ")}.`;
			}
			return `Password is too weak. Must contain one ${mandatory.join(", ")} and be at least 8 characters long.`;
		},
		mask: "*",
	});
	await password({
		message: "Repeat the encryption key:",
		validate: (value) => value === encryptionKey || "Passwords do not match.",
		mask: "*",
	});
	const s3AccessKeyId = await password({
		message: "Enter your S3 access key ID:",
		mask: "*",
		validate: (value) =>
			value.length > 0 || "S3 access key ID cannot be empty.",
	});
	const s3SecretAccessKey = await password({
		message: "Enter your S3 secret access key:",
		mask: "*",
		validate: (value) =>
			value.length > 0 || "S3 secret access key cannot be empty.",
	});
	const s3BucketName = await input({
		message: "Enter your S3 bucket name:",
		validate: (value) => value.length > 0 || "S3 bucket name cannot be empty.",
	});
	const s3Endpoint = await input({
		message:
			"Enter your S3 endpoint: (only hostname, e.g. s3.us-east-1.amazonaws.com)",
		validate: (value) => value.length > 0 || "S3 endpoint cannot be empty.",
	});
	const s3AccountId = await input({
		message: "Enter your S3 account ID (optional depends on providers):",
	});
	return {
		encryptionKey,
		s3AccessKeyId,
		s3SecretAccessKey,
		s3BucketName,
		s3Endpoint,
		s3AccountId,
	};
};
