import chalk from "chalk";

const log = console.log;

const alert = (...args: unknown[]) => log(chalk.yellow(...args));

const error = (...args: unknown[]) => log(chalk.red(...args));

const success = (...args: unknown[]) => log(chalk.green(...args));

export { alert, error, success };
