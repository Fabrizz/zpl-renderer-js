import { build } from "esbuild";

const shared = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  sourcemap: true,
  minify: true,
  target: ["es2018"],
  loader: { ".wasm": "base64" },
  external: [],
};

await Promise.all([
  build({ ...shared, format: "cjs", outfile: "dist/index.cjs.js", platform: "node" }),
  build({ ...shared, format: "esm", outfile: "dist/index.esm.js", platform: "neutral" }),
  build({
    ...shared,
    format: "iife",
    outfile: "dist/index.umd.js",
    globalName: "zpljs",
  })
]).catch(() => process.exit(1));