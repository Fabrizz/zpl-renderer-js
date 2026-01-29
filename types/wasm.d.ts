declare module "*.wasm" {
  /** Base64 loader */
  const wasmB64: string;
  export default wasmB64;
}

/** Current Zebrash version */
declare const __ZEBRASH_VERSION__: string;