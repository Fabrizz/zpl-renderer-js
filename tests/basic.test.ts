import { test, expect } from "vitest";

import { webcrypto } from "node:crypto";
import { performance } from "node:perf_hooks";
import { TextEncoder, TextDecoder } from "node:util";

(globalThis as any).crypto ??= webcrypto;
(globalThis as any).performance ??= performance;
(globalThis as any).TextEncoder ??= TextEncoder;
(globalThis as any).TextDecoder ??= TextDecoder;

import { ready } from "../"

test("renders ZPL to base64 PNG", async () => {
  const { api } = await ready;
  const b64 = api.Render("^XA^FO50,50^ADN,36,20^FDHello^FS^XZ");
  console.log(b64)
  expect(typeof b64).toBe("string");
  expect(b64.length).toBeGreaterThan(100);
});
