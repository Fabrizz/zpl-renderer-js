import { cpSync, rmSync, existsSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const from = resolve(__dirname, "../node_modules/monaco-editor/min/vs");
const to = resolve(__dirname, "../public/monaco/vs");

if (existsSync(to)) rmSync(to, { recursive: true, force: true });
cpSync(from, to, { recursive: true });
console.log("Copied Monaco to public/monaco/vs");