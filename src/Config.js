import FS from "fs";
import Path from "path";
import { fileURLToPath } from "url";

const __dirname = Path.join(Path.dirname(fileURLToPath(import.meta.url)), "..");

const file = JSON.parse(FS.readFileSync(Path.join(__dirname, "config.json")).toString("utf8"));

export {
    file as Config,
    __dirname
};