import { execSync } from "node:child_process";
import { basename, dirname, join, parse, relative } from "node:path";
import { isGitRepo } from "./isGitRepo";

export const getDefaultFileName = async (filePath: string) => {
	const isGit = await isGitRepo(filePath);
	if (isGit) {
		const gitRoot = execSync("git rev-parse --show-toplevel", {
			cwd: dirname(filePath),
			encoding: "utf-8",
		}).trim();
		const parsed = parse(gitRoot);
		return join(parsed.base, relative(gitRoot, filePath));
	}
	const parsed = parse(filePath);
	const firstParent = basename(parsed.dir);
	return join(firstParent, parsed.base);
};
