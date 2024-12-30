import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { safeParse } from "valibot";
import { type AWSConfigSchema, configSchema } from "../init/configSchema";
import { configPath } from "./configPath";

export const readConfig = async (): Promise<AWSConfigSchema> => {
	if (existsSync(configPath)) {
		const content = await readFile(configPath, "utf-8");
		const parsed = JSON.parse(content);
		const result = safeParse(configSchema, parsed);
		if (result.success) return result.output;
	}
	throw new Error(
		"Invalid config file, reinitialize your configuration by running init command...",
	);
};
