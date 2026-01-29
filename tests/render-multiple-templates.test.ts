import { test, expect } from "vitest";

import { webcrypto } from "node:crypto";
import { performance } from "node:perf_hooks";
import { TextEncoder, TextDecoder } from "node:util";
import fs from "node:fs";

(globalThis as any).crypto ??= webcrypto;
(globalThis as any).performance ??= performance;
(globalThis as any).TextEncoder ??= TextEncoder;
(globalThis as any).TextDecoder ??= TextDecoder;

import { ready } from "zpl-renderer-js"
import { join } from "node:path";

const MULTI_LABEL = `
^XA
^DFE:SAMPLE.ZPL^FS
^FO20,30^GB750,1100,4^FS
^FO20,30^GB750,200,4^FS
^FO20,30^GB750,400,4^FS
^FO20,30^GB750,700,4^FS
^FO20,226^GB325,204,4^FS
^FO30,40^ADN,36,20^FDShip to: ^FS
^FO30,260^ADN,18,10^FDPart number #^FS
^FO360,260^ADN,18,10^FDDescription: ^FS
^FO30,750^ADN,36,20^FDFrom: ^FS
^FO150,125^ADN,36,20^FN1^FS
^FO60,330^ADN,36,20^FN2^FS
^FO480,330^ADN,36,20^FN3^FS
^FO70,480^BY4^B3N,,200^FN4^FS
^FO150,800^ADN,36,20^FN5^FS
^XZ

^XA
^XFE:SAMPLE.ZPL
^FN1^FDAcme Printing^FS
^FN2^FD14042^FS
^FN3^FDScrew^FS
^FN4^FD12345678^FS
^FN5^FDMacks Fabricating^FS
^XZ

^XA
^XFE:SAMPLE.ZPL
^FN1^FDDummy Printing^FS
^FN2^FD111111^FS
^FN3^FDHammer^FS
^FN4^FD87654321^FS
^FN5^FDMacks Processing^FS
^XZ
`;

test("Renders multiple ZPL labels", async () => {
  const { api } = await ready;
  const b64Array = await api.zplToBase64MultipleAsync(MULTI_LABEL);
  expect(Array.isArray(b64Array)).toBe(true);
  expect(b64Array.length).toBe(2);
  
  for (const img of b64Array) {
    expect(typeof img).toBe("string");
    expect(img.length).toBeGreaterThan(100);

    const path = join(__dirname, "/output", `upssp-multiple-${b64Array.indexOf(img)}.test.png`);
    fs.writeFileSync(path, Buffer.from(img, "base64"));
    expect(fs.existsSync(path)).toBe(true);
  }
});