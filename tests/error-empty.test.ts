import { test, expect } from "vitest";

import { webcrypto } from "node:crypto";
import { performance } from "node:perf_hooks";
import { TextEncoder, TextDecoder } from "node:util";

(globalThis as any).crypto ??= webcrypto;
(globalThis as any).performance ??= performance;
(globalThis as any).TextEncoder ??= TextEncoder;
(globalThis as any).TextDecoder ??= TextDecoder;

import { ready } from "zpl-renderer-js"

test("returns an error when empty zpl argument", async () => {
  const { api } = await ready;
  try {
    // @ts-expect-error Missing required argument
    const b64: any = await api.zplToBase64Async();
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toContain("Missing argument: zpl");
  }
});