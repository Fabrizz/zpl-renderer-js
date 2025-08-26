import { useEffect, useRef, useState } from "react";

export default function ZPL({ zpl }: { zpl: string }) {

  // create the worker once (Vite way)
  const workerRef = useRef<Worker | null>(null);
  const [b64, setB64] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const reqIdRef = useRef(0);

  // spin up / tear down the worker
  useEffect(() => {
    const worker = new Worker(
      new URL("./1-zpl-web-worker.ts", import.meta.url),
      { type: "module" }
    );
    workerRef.current = worker;

    const onMessage = (ev: MessageEvent<{ id: number; ok: boolean; b64?: string; error?: string }>) => {
      const { id, ok, b64, error } = ev.data;
      if (id !== reqIdRef.current) return;
      if (ok && typeof b64 === "string") {
        setError(null);
        setB64(b64);
        if (!loaded) setLoaded(true);
      } else {
        setError(error || "Render failed");
        setB64("");
      }
    };

    worker.addEventListener("message", onMessage);
    return () => {
      worker.removeEventListener("message", onMessage);
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  // send work to the worker whenever inputs change
  useEffect(() => {
    const w = workerRef.current;
    if (!w) return;
    const id = ++reqIdRef.current;
    w.postMessage({ id, zpl, wmm: 101.6, hmm: 203.2, dpmm: 8 });
  }, [zpl]);

  if (!loaded) {
    return (
      <div>Loading</div>
    );
  }

  return (
    <div>
      {error ? (
        <span>ERROR | Internal: {error}</span>
      ) : (
        <img
          src={b64 ? `data:image/png;base64,${b64}` : undefined}
          alt="ZPL Preview"
        />
      )}
    </div>
  )
}