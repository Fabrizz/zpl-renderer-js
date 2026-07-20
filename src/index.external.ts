
import "./wasm_exec.js";
import { initGoWasmExternal, type ExternalInitOptions } from "./wasm-wrapper.external";
import type { ZplApi, RenderOptions } from "./api-types";

export const ZEBRASH_VERSION = __ZEBRASH_VERSION__ || "";

export type { ZplApi, RenderOptions, ExternalInitOptions };

let apiPromise: Promise<ZplApi> | null = null;

/**
 * Initialize the Zebrash WASM module from an explicit source. Must be called
 * once before any other export in this module is used.
 *
 * @example
 * ```typescript
 * import { init, zplToBase64Async } from "zpl-renderer-js/external";
 *
 * await init({ wasmUrl: "https://cdn.jsdelivr.net/npm/zpl-renderer-js@<version>/dist/zebrash.wasm" });
 * const label = await zplToBase64Async("^XA^FO50,50^ADN,36,20^FDHello^FS^XZ");
 * ```
 */
export function init(options: ExternalInitOptions): Promise<ZplApi> {
  if (!apiPromise) {
    apiPromise = (async () => {
      const { api } = await initGoWasmExternal<ZplApi>({ namespace: "zpl", ...options });
      if (!api) throw new Error("Zpl API not found on globalThis.zpl");
      return api;
    })();
  }
  return apiPromise;
}

function requireApi(): Promise<ZplApi> {
  if (!apiPromise) {
    throw new Error(
      'zpl-renderer-js/external requires init() before use, e.g.\n' +
        '  import { init } from "zpl-renderer-js/external";\n' +
        '  await init({ wasmUrl: "https://cdn.jsdelivr.net/npm/zpl-renderer-js@<version>/dist/zebrash.wasm" });'
    );
  }
  return apiPromise;
}

export async function getApi(): Promise<ZplApi> {
  return requireApi();
}

export async function Render(
  zpl: string,
  widthMm?: number,
  heightMm?: number,
  dpmm?: number
): Promise<string> {
  const api = await requireApi();
  return api.Render(zpl, widthMm, heightMm, dpmm);
}

export async function zplToBase64Async(
  zpl: string,
  widthMm?: number,
  heightMm?: number,
  dpmm?: number,
  options?: RenderOptions
): Promise<string> {
  const api = await requireApi();
  return api.zplToBase64Async(zpl, widthMm, heightMm, dpmm, options);
}

export async function zplToBase64MultipleAsync(
  zpl: string,
  widthMm?: number,
  heightMm?: number,
  dpmm?: number,
  options?: RenderOptions
): Promise<string[]> {
  const api = await requireApi();
  return api.zplToBase64MultipleAsync(zpl, widthMm, heightMm, dpmm, options);
}
