import { test, expect } from "vitest";

import { webcrypto } from "node:crypto";
import { performance } from "node:perf_hooks";
import { TextEncoder, TextDecoder } from "node:util";

(globalThis as any).crypto ??= webcrypto;
(globalThis as any).performance ??= performance;
(globalThis as any).TextEncoder ??= TextEncoder;
(globalThis as any).TextDecoder ??= TextDecoder;

import { ZEBRASH_VERSION } from "zpl-renderer-js"

test("Read Zebrash version", async () => {
  console.log(`Using zebrash version: ${ZEBRASH_VERSION}`);

  expect(typeof ZEBRASH_VERSION).toBe("string");
  expect(ZEBRASH_VERSION.length).toBeGreaterThan(0);
});