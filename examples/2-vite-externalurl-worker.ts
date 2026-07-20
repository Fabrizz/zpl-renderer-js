/// <reference lib="webworker" />
import { init, zplToBase64MultipleAsync, ZEBRASH_VERSION, ZPL_RENDERER_VERSION } from "zpl-renderer-js/external";
import wasmUrl from "zpl-renderer-js/wasm?url";

console.log(`ZPL Renderer Worker | Zebrash ${ZEBRASH_VERSION} | Library ${ZPL_RENDERER_VERSION}`);

// init() is memoized internally — safe to call once at module load, the
// rendering call below awaits the same in-flight/resolved promise.
init({ wasmUrl });

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
    const b64 = await zplToBase64MultipleAsync(zpl, wmm, hmm, dpmm);
    (self as DedicatedWorkerGlobalScope).postMessage({ id, ok: true, b64 } as OutMsg);
  } catch (e: unknown) {
    (self as DedicatedWorkerGlobalScope).postMessage({
      id,
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    } as OutMsg);
  }
};
