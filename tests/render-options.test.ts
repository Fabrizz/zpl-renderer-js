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

import { ready } from "zpl-renderer-js";
import { ZPL } from "./data";

test("grayscaleOutput produces different pixel data than the default monochrome output", async () => {
  const { api } = await ready;
  const mono = await api.zplToBase64Async(ZPL);
  const gray = await api.zplToBase64Async(ZPL, undefined, undefined, undefined, {
    grayscaleOutput: true,
  });

  expect(typeof gray).toBe("string");
  expect(gray.length).toBeGreaterThan(100);
  expect(gray).not.toBe(mono);

  const path = join(__dirname, "/output", "grayscale.test.png");
  fs.writeFileSync(path, Buffer.from(gray, "base64"));
  expect(fs.existsSync(path)).toBe(true);
});

test("enableInvertedLabels renders without error when the ZPL doesn't request inversion", async () => {
  const { api } = await ready;
  const b64 = await api.zplToBase64Async(ZPL, undefined, undefined, undefined, {
    enableInvertedLabels: true,
  });
  expect(typeof b64).toBe("string");
  expect(b64.length).toBeGreaterThan(100);
});
