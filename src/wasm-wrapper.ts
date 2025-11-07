// src/wasm-wrapper.ts
import wasmB64 from "../zebrash/main.wasm";

declare global {
  var Go: new () => {
    argv: string[];
    env: Record<string, string>;
    importObject: WebAssembly.Imports;
    run: (inst: WebAssembly.Instance) => Promise<void>;
  };
}

function isInstantiatedSource(
  r: WebAssembly.Instance | WebAssembly.WebAssemblyInstantiatedSource
): r is WebAssembly.WebAssemblyInstantiatedSource {
  return (r as any).instance !== undefined;
}

function decodeBase64Universal(b64: string): Uint8Array {
  if (typeof atob === "function") {
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  return Uint8Array.from(Buffer.from(b64, "base64"));
}

type InitOptions<TApi> = {
  argv?: string[];
  env?: Record<string, string>;
  /** e.g. "zpl" if your Go sets globalThis.zpl = {...} */
  namespace?: string;
  imports?: WebAssembly.Imports;
};

export async function initGoWasm<TApi = Record<string, unknown>>(
  opts: InitOptions<TApi> = {}
) {
  if (typeof globalThis.Go !== "function") {
    throw new Error("Go runtime not found — load your bundled wasm_exec.js first");
  }

  const go = new globalThis.Go();
  if (opts.argv) go.argv = opts.argv;
  if (opts.env) go.env = { ...go.env, ...opts.env };

  // Merge in any extra imports
  const importObject: WebAssembly.Imports = { ...go.importObject };
  if (opts.imports) {
    for (const ns of Object.keys(opts.imports)) {
      (importObject as any)[ns] = { ...(importObject as any)[ns], ...(opts.imports as any)[ns] };
    }
  }

  const bytes = decodeBase64Universal(wasmB64);
  const res = await WebAssembly.instantiate(bytes, importObject as WebAssembly.Imports);
  const instance = isInstantiatedSource(res) ? res.instance : res;

  const done = go.run(instance);
  const api = opts.namespace
    ? ((globalThis as any)[opts.namespace] as TApi | undefined)
    : undefined;

  return { instance, api, done };
}
