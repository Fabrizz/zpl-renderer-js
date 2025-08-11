// ESM o TypeScript
import { initWasm } from "./wasm-wrapper";
const api = await initWasm();
console.log(api.add(1, 2));