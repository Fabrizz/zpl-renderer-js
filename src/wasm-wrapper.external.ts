
import { runGoWasm, type RunOptions, type WasmSource } from "./wasm-runtime";

export type ExternalInitOptions = RunOptions & {
  /** URL (or CDN link) to fetch the Zebrash WASM binary from. */
  wasmUrl?: string | URL;
  /** Already-fetched WASM bytes (e.g. read from disk in Node, or via a bundler's raw loader). */
  wasmBytes?: ArrayBuffer | Uint8Array;
  /** An already-compiled WebAssembly.Module, e.g. shared across worker instances. */
  wasmModule?: WebAssembly.Module;
};

function resolveSource(opts: ExternalInitOptions): WasmSource {
  if (opts.wasmModule) return { module: opts.wasmModule };
  if (opts.wasmBytes) return { bytes: opts.wasmBytes };
  if (opts.wasmUrl) return { url: opts.wasmUrl };
  throw new Error(
    'zpl-renderer-js/external requires a WASM source — pass one of "wasmUrl", "wasmBytes", or "wasmModule" to init(), e.g.\n' +
      '  init({ wasmUrl: "https://cdn.jsdelivr.net/npm/zpl-renderer-js@<version>/dist/zebrash.wasm" })'
  );
}

export async function initGoWasmExternal<TApi = Record<string, unknown>>(
  opts: ExternalInitOptions
) {
  const source = resolveSource(opts);
  return runGoWasm<TApi>(source, opts);
}
