import { $ } from "bun";
import { isGitRepo } from "./isGitRepo";
import { parse, basename, join, dirname, relative } from "node:path";

export const getDefaultFileName = async (filePath: string) => {
	const isGit = await isGitRepo(filePath);
	if (isGit) {
		const gitRoot = (
			await $`git rev-parse --show-toplevel`.cwd(dirname(filePath)).text()
		).trim();
		const parsed = parse(gitRoot);
		return join(parsed.base, relative(gitRoot, filePath));
	}
	const parsed = parse(filePath);
	const firstParent = basename(parsed.dir);
	return join(firstParent, parsed.base);
};
