import { join } from "node:path";
import { paths } from "./paths";

const configFileName = "meta.json";
export const configPath = join(paths.config, configFileName);
