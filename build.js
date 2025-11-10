/* eslint-disable */
const { build } = require("esbuild");
const fs = require("fs");
const path = require("path");

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

async function copyTstoExternal() {
  const src = path.join("dist", "index.d.ts");
  const dstDir = path.join("dist", "external");
  const dst = path.join(dstDir, "index.d.ts");

  if (!fs.existsSync(src)) {
    throw new Error(`Types not found: ${src}. External build failed.`);
  }

  fs.mkdirSync(dstDir, { recursive: true });
  fs.copyFileSync(src, dst);
  console.log(`Types copied for "external" build --> ${dst}`);
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
    await runBuild({
      ...shared,
      loader: { ".wasm": "file" },
      format: "esm",
      outdir: "dist/external",
      platform: "browser",
      assetNames: "[name]-[hash]",
      entryPoints: ["src/index.ts"],
    });

    await copyTstoExternal();
    /* 
     * await emitWasmFile();
     *
     * I will stop including it in the package as the go 
     * wasm_exec is needed and at that point grabbing it from
     * the package does not make sense.
     * 
     * If you need the wasm, you can either:
     * - Build it directly from go in the zebrash/ folder
     * - Get it from the github artifacts. // TODO
     * - Use the one inside /external build.
     */

    console.log("JS Build completed.\n");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

(async () => {
  try {
    await main();
    console.log("✅ Build complete.\n\n");
  } catch (e) {
    console.log("❌ Build failed.");
    console.error(e);
    console.error("\n\n");
    process.exit(1);
  }
})();