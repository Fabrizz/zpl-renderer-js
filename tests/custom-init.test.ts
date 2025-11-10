import { test, expect } from "vitest";

import { webcrypto } from "node:crypto";
import { performance } from "node:perf_hooks";
import { TextEncoder, TextDecoder } from "node:util";
import fs from "node:fs";

(globalThis as any).crypto ??= webcrypto;
(globalThis as any).performance ??= performance;
(globalThis as any).TextEncoder ??= TextEncoder;
(globalThis as any).TextDecoder ??= TextDecoder;

import { initZpl } from "zpl-renderer-js";
import { join } from "node:path";
import { ZPL } from "./data";

// TODO: Add more tests for various ZPL inputs and edge cases
// TODO: Actually verify the output images against known-good snapshots
test("Renders UPS-S ZPL using initZpl", async () => {
  const { api } = await initZpl();
  const b64 = await api.zplToBase64Async(ZPL);
  expect(typeof b64).toBe("string");
  expect(b64.length).toBeGreaterThan(100);

  const path = join(__dirname, "/output", "upssp.test.png");
  fs.writeFileSync(path, Buffer.from(b64, "base64"));
  expect(fs.existsSync(path)).toBe(true);
});