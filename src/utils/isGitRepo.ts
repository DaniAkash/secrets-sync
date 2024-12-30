import { $ } from "bun";
import { dirname } from "node:path";

export const isGitRepo = async (filePath: string) => {
	const directory = dirname(filePath);
	return await $`git rev-parse --is-inside-work-tree`.cwd(directory).text();
};
