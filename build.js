/* eslint-disable */
const { build } = require("esbuild");
const fs = require("fs");
const path = require("path");

function formatBytes(bytes) {
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(2)} ${units[i]}`;
}

async function runBuild(options) {
  const result = await build(options);
  const outputs = Object.entries(result.metafile.outputs);
  let totalBytes = 0;
  outputs.forEach(([file, meta]) => {
    console.log(`*** ${file} - ${formatBytes(meta.bytes)}`);
    totalBytes += meta.bytes;
  });
  return totalBytes;
}

function emitWasmFile() {
  const srcPath = path.join(__dirname, "zebrash", "main.wasm");
  const destPath = path.join(__dirname, "dist", "zebrash.wasm");
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.copyFileSync(srcPath, destPath);
  console.log("Emitted", destPath);
}

function readZebrashVersionFromGoMod() {
  const goModPath = path.join(__dirname, "zebrash", "go.mod");

  if (!fs.existsSync(goModPath)) {
    throw new Error(`zebrash/go.mod not found at: ${goModPath}`);
  }

  const txt = fs.readFileSync(goModPath, "utf8");
  const re = /(?:^|\s)github\.com\/ingridhq\/zebrash\s+v(\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?)\b/m;
  const m = txt.match(re);

  if (!m) {
    const preview = txt.split("\n").slice(0, 80).join("\n");
    throw new Error(
      [
        `Could not find "github.com/ingridhq/zebrash vX.Y.Z" in ${goModPath}.`,
        `Expected a line like: require github.com/ingridhq/zebrash v1.33.0`,
        `--- go.mod preview (first ~80 lines) ---`,
        preview,
      ].join("\n")
    );
  }

  console.log(`Detected zebrash version: v${m[1]}\n`);
  return `v${m[1]}`;
}

function copyWasmExecTypes() {
  const srcPath = path.join(__dirname, "src", "wasm_exec.d.ts");
  const destPath = path.join(__dirname, "dist", "wasm_exec.d.ts");

  if (fs.existsSync(srcPath)) {
    // Ensure dist directory exists
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied wasm_exec.d.ts to dist/`);
  } else {
    console.warn(`Warning: ${srcPath} not found. Skipping type copy.`);
  }
}

/////////////////////////////////////////////////////////////////////// Build
const zebrashVersion = readZebrashVersionFromGoMod();

const licenseBanner = `/*!
 * zpl-renderer-js - 2025 Fabrizio <3
 * Released under the MIT License
 * 
 * > Zebrash (GO) by IngridHQ - MIT License
 * > https://github.com/ingridhq/zebrash
 */
`;

const shared = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  sourcemap: true,
  minify: true,
  target: ["es2018"],
  loader: { ".wasm": "base64" },
  external: [],
  metafile: true,
  banner: { js: licenseBanner },
  legalComments: "eof",
  define: {
    __ZEBRASH_VERSION__: JSON.stringify(zebrashVersion),
  },
};

async function main() {
  let bt = 0;
  try {
    const results = await Promise.all([
      runBuild({
        ...shared,
        format: "cjs",
        outfile: "dist/index.cjs.js",
        platform: "node",
      }),
      runBuild({
        ...shared,
        format: "esm",
        outfile: "dist/index.esm.js",
        platform: "neutral",
      }),
      runBuild({
        ...shared,
        entryPoints: ["src/index.external.ts"],
        format: "cjs",
        outfile: "dist/index.external.cjs.js",
        platform: "node",
      }),
      runBuild({
        ...shared,
        entryPoints: ["src/index.external.ts"],
        format: "esm",
        outfile: "dist/index.external.esm.js",
        platform: "neutral",
      }),
    ]);
    bt = results.reduce((a, b) => a + b, 0);
    console.log(`Total size: ${formatBytes(bt)}\n`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

(async () => {
  try {
    await main();
    copyWasmExecTypes();
    emitWasmFile();
    console.log("Build complete. \n\n");
  } catch (e) {
    console.log("Build failed.");
    console.error(e);
    console.error("\n\n");
    process.exit(1);
  }
})();