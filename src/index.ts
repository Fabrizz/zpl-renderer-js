import "./wasm_exec.js";
import { initGoWasm } from "./wasm-wrapper";

export type ZplApi = {
  /**
   * Render a ZPL label into a PNG image (Base64-encoded string).
   *
   * @param zpl - The raw ZPL code to render.
   * @param widthMm - Label width in millimeters. Defaults to 101.6 mm (~4 inches).
   * @param heightMm - Label height in millimeters. Defaults to 203.2 mm (~8 inches).
   * @param dpmm - Dots per millimeter (print resolution). Defaults to 8 (~203 DPI).
   * @returns A Base64-encoded PNG image string representing the rendered label.
   * @deprecated Use `zplToBase64Async` instead.
   */
  Render: (
    zpl: string,
    widthMm?: number,
    heightMm?: number,
    dpmm?: number
  ) => string;

  /**
   * Asynchronously render a ZPL label into a PNG image (Base64-encoded string).
   *
   * @param zpl - The raw ZPL code to render.
   * @param widthMm - Label width in millimeters. Defaults to 101.6 mm (~4 inches).
   * @param heightMm - Label height in millimeters. Defaults to 203.2 mm (~8 inches).
   * @param dpmm - Dots per millimeter (print resolution). Defaults to 8 (~203 DPI).
   * @returns A Promise that resolves to a Base64-encoded PNG image string representing the rendered label.
   * @throws Will throw an error if the ZPL is invalid or rendering fails.
   * @example
   * ```typescript
   * import { ready } from "zpl-renderer-js"
   * const { api } = await ready;
   * const zplImage = await api.zplToBase64Async("^XA^FO50,50^ADN,36,20^FDHello^FS^XZ");
   * console.log(zplImage);
   * ```
   */
  zplToBase64Async: (
    zpl: string,
    widthMm?: number,
    heightMm?: number,
    dpmm?: number
  ) => Promise<string>;
};

let boot: Promise<{ api: ZplApi }> | null = null;
let isReadyInstantInit = true;

// Initialize using the namespace the Go code sets: globalThis.zpl
export function initZpl(opts: { wasmUrl?: string } = {}) {

  // For now keep two modes and remove in the future
  if (isReadyInstantInit && Object.keys(opts).length > 0) {
    //console.debug("Custom initZpl, restarting zpl instance");
    boot = null;
    isReadyInstantInit = false;
  }

  if (!boot) {
    boot = (async () => {
      const { api } = await initGoWasm<ZplApi>({ namespace: "zpl", ...opts });
      if (!api) throw new Error("Zpl API not found on globalThis.zpl");
      return { api };
    })();
  }
  
  return boot;
}

/* 
 * Backward compatibility, triggers on import
 * Problems when not tree-shakeen away, as initZpl will always be called twice
 * Ignoring new inits with different options.
 * 
 * Should I break this and force users to switch
 * or should I let users do initZpl reloading with custom opts?
 * 
 * @deprecated Use initZpl() instead. This will be removed in future versions.
 */
export const ready: Promise<{ api: ZplApi }> = initZpl();

export async function getApi(): Promise<ZplApi> {
  return (await ready).api;
}

export async function Render(
  zpl: string,
  widthMm?: number,
  heightMm?: number,
  dpmm?: number
): Promise<string> {
  const api = await getApi();
  return api.Render(zpl, widthMm, heightMm, dpmm);
}

export async function zplToBase64Async(
  zpl: string,
  widthMm?: number,
  heightMm?: number,
  dpmm?: number
): Promise<string> {
  const api = await getApi();
  return api.zplToBase64Async(zpl, widthMm, heightMm, dpmm);
}