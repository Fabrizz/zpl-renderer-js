import { test, expect } from "vitest";

import { webcrypto } from "node:crypto";
import { performance } from "node:perf_hooks";
import { TextEncoder, TextDecoder } from "node:util";

(globalThis as any).crypto ??= webcrypto;
(globalThis as any).performance ??= performance;
(globalThis as any).TextEncoder ??= TextEncoder;
(globalThis as any).TextDecoder ??= TextDecoder;

import { ready } from "../"

test("returns an error when zpl is malformed", async () => {
  const { api } = await ready;
  try {
    const b64: any = await api.zplToBase64Async("^LRN^MNY^MFN,N^LH10,12Im a malformed ZPL");
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain("No labels parsed");
  }
});