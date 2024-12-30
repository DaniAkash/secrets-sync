import { execSync } from "node:child_process";
import { dirname } from "node:path";

export const isGitRepo = async (filePath: string): Promise<boolean> => {
	const directory = dirname(filePath);
	try {
		const gitOutput = execSync("git rev-parse --is-inside-work-tree", {
			cwd: directory,
			encoding: "utf-8",
		}).trim();
		return Boolean(gitOutput);
	} catch {
		return false;
	}
};
