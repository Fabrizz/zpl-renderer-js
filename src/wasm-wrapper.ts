// src/wasm-wrapper.ts
import wasmB64 from "../zebrash/main.wasm";

function decode(b64: string): Uint8Array {
  if (typeof atob === "function") {
    return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  }
  // @ts-ignore – Buffer only in Node
  return Uint8Array.from(Buffer.from(b64, "base64"));
}

/**
 * Module/export
 * @param imports ImportObject optional
 */
export async function initWasm(imports: WebAssembly.Imports = {}) {
  // wasmB64 será SIEMPRE string porque usamos loader "base64"
  const bytes = decode(wasmB64 as string);
  const { exports } = await WebAssembly.instantiate(bytes, imports);
  return exports as Record<string, unknown>;
}

export default initWasm;