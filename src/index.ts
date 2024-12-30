#! /usr/bin/env node
import { program } from "commander";
import packageJSON from "../package.json";
import { init } from "./init/init";
import { push } from "./push/push";
import { error } from "./utils/messages";

program
	.name(packageJSON.name)
	.description(packageJSON.description)
	.version(packageJSON.version);

/**
 * Initialize the program on a new machine
 */
program
	.command("init")
	.description(
		`Initialize ${packageJSON.name} on a new machine with S3 credentials and encryption password.`,
	)
	.action(() => {
		init().catch(error);
	});

/**
 * Push a secret / config file to S3
 */
program
	.command("push")
	.argument("<file-name>", "Name of the file to push to S3.")
	.option("-o, --overwrite", "Overwrite the file if it already exists.", false)
	.option("-p, --path <path>", "Path to the file to push to S3.")
	.description("Push a secret / config file to S3.")
	.action((fileName, options) => {
		push({
			fileName,
			overwrite: options.overwrite,
			path: options.path,
		}).catch(error);
	});

program.parse();
