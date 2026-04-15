/// <reference lib="webworker" />
import { ready, type ZplApi, ZEBRASH_VERSION } from "zpl-renderer-js";

let initPromise: Promise<void> | null = null;
let api: ZplApi | null = null;

console.log(`ZPL Renderer Worker | ZebraSH ${ZEBRASH_VERSION}`);

function ensureInit() {
  if (!initPromise) {
    initPromise = (async () => {
      const resolved = await ready;
      api = resolved.api || resolved;
    })();
  }
  return initPromise;
}

type InMsg = {
  id: number;
  zpl: string;
  wmm: number;
  hmm: number;
  dpmm: number;
};

type OutMsg =
  | { id: number; ok: true; b64: string[] }
  | { id: number; ok: false; error: string };

self.onmessage = async (ev: MessageEvent<InMsg>) => {
  const { id, zpl, wmm, hmm, dpmm } = ev.data;
  try {
    await ensureInit();
    const b64 = await api?.zplToBase64MultipleAsync(zpl, wmm, hmm, dpmm);
    (self as DedicatedWorkerGlobalScope).postMessage({ id, ok: true, b64 } as OutMsg);
  } catch (e: unknown) {
    (self as DedicatedWorkerGlobalScope).postMessage({
      id,
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    } as OutMsg);
  }
};