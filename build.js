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

async function emitWasmFile() {
  const result = await build({
    entryPoints: ["zebrash/main.wasm"],
    bundle: false,
    write: false,
    loader: { ".wasm": "file" },
    outdir: "dist",
    assetNames: "zebrash",
    logLevel: "silent",
  });

  // Find the generated .wasm in memory and write it
  const wasmFile = result.outputFiles.find(f => f.path.endsWith(".wasm"));
  if (!wasmFile) throw new Error("No wasm output found");
  fs.mkdirSync(path.dirname(wasmFile.path), { recursive: true });
  fs.writeFileSync(wasmFile.path, wasmFile.contents);
  console.log("Emitted", wasmFile.path);
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
        format: "iife",
        outfile: "dist/index.umd.js",
        globalName: "zpljs",
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
    // await emitWasmFile();
    console.log("Build complete. \n\n");
  } catch (e) {
    console.log("Build failed.");
    console.error(e);
    console.error("\n\n");
    process.exit(1);
  }
})();