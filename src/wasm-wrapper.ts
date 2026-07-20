
import wasmB64 from "../zebrash/main.wasm";
import { runGoWasm, type RunOptions } from "./wasm-runtime";

function decodeBase64Universal(b64: string): Uint8Array {
  if (typeof atob === "function") {
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  return Uint8Array.from(Buffer.from(b64, "base64"));
}

export type InitOptions = RunOptions;

export async function initGoWasm<TApi = Record<string, unknown>>(
  opts: InitOptions = {}
) {
  const bytes = decodeBase64Universal(wasmB64);
  return runGoWasm<TApi>({ bytes }, opts);
}
