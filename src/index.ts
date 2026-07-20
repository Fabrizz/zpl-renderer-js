
import "./wasm_exec.js";
import { initGoWasm } from "./wasm-wrapper";
import type { ZplApi, RenderOptions } from "./api-types";

export const ZEBRASH_VERSION = __ZEBRASH_VERSION__ || "";

export type { ZplApi, RenderOptions };

export const ready: Promise<{ api: ZplApi }> = (async () => {
  const { api } = await initGoWasm<ZplApi>({ namespace: "zpl" });
  if (!api) throw new Error("Zpl API not found on globalThis.zpl");
  return { api };
})();

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
  dpmm?: number,
  options?: RenderOptions
): Promise<string> {
  const api = await getApi();
  return api.zplToBase64Async(zpl, widthMm, heightMm, dpmm, options);
}

export async function zplToBase64MultipleAsync(
  zpl: string,
  widthMm?: number,
  heightMm?: number,
  dpmm?: number,
  options?: RenderOptions
): Promise<string[]> {
  const api = await getApi();
  return api.zplToBase64MultipleAsync(zpl, widthMm, heightMm, dpmm, options);
}