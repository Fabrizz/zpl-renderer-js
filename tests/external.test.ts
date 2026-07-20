import { test, expect } from "vitest";

import { webcrypto } from "node:crypto";
import { performance } from "node:perf_hooks";
import { TextEncoder, TextDecoder } from "node:util";
import fs from "node:fs";
import { join } from "node:path";

(globalThis as any).crypto ??= webcrypto;
(globalThis as any).performance ??= performance;
(globalThis as any).TextEncoder ??= TextEncoder;
(globalThis as any).TextDecoder ??= TextDecoder;

import { init, zplToBase64Async } from "zpl-renderer-js/external";
import { ZPL } from "./data";

test("[external] renders zpl from wasmBytes", async () => {
  const wasmBytes = fs.readFileSync(join(__dirname, "..", "dist", "zebrash.wasm"));
  await init({ wasmBytes });

  const b64 = await zplToBase64Async(ZPL);
  expect(typeof b64).toBe("string");
  expect(b64.length).toBeGreaterThan(100);

  const path = join(__dirname, "/output", "external.test.png");
  fs.writeFileSync(path, Buffer.from(b64, "base64"));
  expect(fs.existsSync(path)).toBe(true);
});
