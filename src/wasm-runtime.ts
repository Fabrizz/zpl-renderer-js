
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

export type WasmSource =
  | { bytes: ArrayBuffer | Uint8Array }
  | { module: WebAssembly.Module }
  | { url: string | URL };

export type RunOptions = {
  argv?: string[];
  env?: Record<string, string>;
  namespace?: string;
  imports?: WebAssembly.Imports;
};

async function instantiate(
  source: WasmSource,
  importObject: WebAssembly.Imports
): Promise<WebAssembly.Instance | WebAssembly.WebAssemblyInstantiatedSource> {
  if ("module" in source) {
    return WebAssembly.instantiate(source.module, importObject);
  }
  if ("url" in source) {
    try {
      return await WebAssembly.instantiateStreaming(fetch(source.url), importObject);
    } catch {
      const res = await fetch(source.url);
      const bytes = await res.arrayBuffer();
      return WebAssembly.instantiate(bytes, importObject);
    }
  }
  return WebAssembly.instantiate(source.bytes, importObject);
}

export async function runGoWasm<TApi = Record<string, unknown>>(
  source: WasmSource,
  opts: RunOptions = {}
) {
  if (typeof globalThis.Go !== "function") {
    throw new Error("Go runtime not found — load your bundled wasm_exec.js first");
  }

  const go = new globalThis.Go();
  if (opts.argv) go.argv = opts.argv;
  if (opts.env) go.env = { ...go.env, ...opts.env };

  const importObject: WebAssembly.Imports = { ...go.importObject };
  if (opts.imports) {
    for (const ns of Object.keys(opts.imports)) {
      (importObject as any)[ns] = { ...(importObject as any)[ns], ...(opts.imports as any)[ns] };
    }
  }

  const res = await instantiate(source, importObject);
  const instance = isInstantiatedSource(res) ? res.instance : res;

  const done = go.run(instance);
  const api = opts.namespace
    ? ((globalThis as any)[opts.namespace] as TApi | undefined)
    : undefined;

  return { instance, api, done };
}
