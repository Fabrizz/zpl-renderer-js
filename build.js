// build.cjs
/* eslint-disable */
const { build } = require("esbuild");
const fs = require("fs");
const path = require("path");

const licenseBanner = `/*!
 * zpl-image-js - 2025 Fabrizio <3
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
};

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
  outputs.forEach(([file, meta]) => {
    console.log(`*** ${file} - ${formatBytes(meta.bytes)}`);
  });
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

async function main() {
  try {
    await Promise.all([
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
    console.log("JS Build completed.\n");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

(async () => {
  try {
    await main();
    await emitWasmFile();
    console.log("✅ Build complete. (base64 + raw WASM).\n\n");
  } catch (e) {
    console.log("❌ Build failed.");
    console.error(e);
    console.error("\n\n");
    process.exit(1);
  }
})();