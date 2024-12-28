import envPaths from "env-paths";
import packageJSON from "../../package.json";

export const paths = envPaths(packageJSON.name);
