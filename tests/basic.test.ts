import { test, expect } from "vitest";

import { webcrypto } from "node:crypto";
import { performance } from "node:perf_hooks";
import { TextEncoder, TextDecoder } from "node:util";
import fs from "node:fs";

(globalThis as any).crypto ??= webcrypto;
(globalThis as any).performance ??= performance;
(globalThis as any).TextEncoder ??= TextEncoder;
(globalThis as any).TextDecoder ??= TextDecoder;

import { ready } from "../"
import { join } from "node:path";

test("renders ZPL to base64 PNG", async () => {
  const { api } = await ready;
  const b64 = api.Render("^XA^FO50,50^ADN,36,20^FDHello^FS^XZ");
  expect(typeof b64).toBe("string");
  expect(b64.length).toBeGreaterThan(100);

  const path = join(__dirname, "/output", "basic.test.png");
  fs.writeFileSync(path, Buffer.from(b64, "base64"));
  expect(fs.existsSync(path)).toBe(true);
});
