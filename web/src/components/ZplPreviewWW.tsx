import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useDebounced } from "@/lib/utils";
import { Loader2, Siren, Image } from "lucide-react";
import { Button } from './ui/button';

const DownloadAsPdf = lazy(() => import('./DownloadAsPdf'));

type ZplRendererProps = {
  zpl: string;
  /** milliseconds */
  debounce?: number;
  debounceConfig?: number;
  /** width in millimeters */
  wmm?: number;
  /** height in millimeters */
  hmm?: number;
  /** dots per millimeter */
  dpmm?: number;
  /* optional className for the img */
  className?: string;
  /** rotation in degrees */
  rotation?: number | undefined;
  /** callback to receive the base64 PNG string when rendered */
  setimageArray: (b64: string[] | Error) => void;
  /** Download PNG */
  dwPng: (s: string) => void;
};

export default function ZplPreviewWW({
  zpl,
  wmm = 101.6,
  hmm = 203.2,
  dpmm = 8,
  debounce = 300,
  debounceConfig,
  className,
  /* rotation, */
  setimageArray,
  dwPng
}: ZplRendererProps) {
  const debounceConfigMs = debounceConfig ?? debounce;
  const debouncedZpl = useDebounced(zpl, debounce);
  const wmmD = useDebounced(wmm, debounceConfigMs);
  const hmmD = useDebounced(hmm, debounceConfigMs);
  const dpmmD = useDebounced(dpmm, debounceConfigMs);

  // create the worker once
  const workerRef = useRef<Worker | null>(null);
  const [b64, setB64] = useState<string[]>([""]);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [lastUsableB64, setLastUsableB64] = useState<string[]>([""]);
  const reqIdRef = useRef(0);

  // spin up / tear down the worker
  useEffect(() => {
    const worker = new Worker(
      new URL("./rww.ts", import.meta.url),
      { type: "module" }
    );
    workerRef.current = worker;

    const onMessage = (ev: MessageEvent<{ id: number; ok: boolean; b64?: string[]; error?: string }>) => {
      const { id, ok, b64, error } = ev.data;
      if (id !== reqIdRef.current) return;
      if (ok && Array.isArray(b64)) {
        setError(null);
        setB64(b64);
        setimageArray(b64);
        setLastUsableB64(b64);
        if (!loaded) setLoaded(true);
      } else {
        console.warn("ZPL render error", error);
        setError(error || "Render failed");
        setB64([""]);
        setimageArray(new Error(error || "Render failed"));
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
    w.postMessage({ id, zpl: debouncedZpl, wmm: wmmD, hmm: hmmD, dpmm: dpmmD });
  }, [debouncedZpl, wmmD, hmmD, dpmmD]);

  if (!loaded) {
    return (
      <div className='flex-1 h-full flex flex-col items-center px-2 gap-3 justify-center text-white animate-pulse'>
        <Loader2 className='inline size-8 animate-spin' />
        <span className='text-white/50'>Waiting initial render</span>
        <span className='text-white/50 text-xs -mt-2'>Downloading Web Worker</span>
      </div>
    );
  }

  return (
    <div className={"scale-[1] transition-all duration-300 flex flex-col gap-2 pb-18" + (error ? "scale-[0.90]!" : "")}>
      {error ? (
        <span className="relative">
          {
            lastUsableB64.length === 0 || lastUsableB64[0] === ""
              ? null
              : lastUsableB64.map((b64, idx) => (
                <img
                  key={idx}
                  src={b64 ? `data:image/png;base64,${b64}` : undefined}
                  alt="ZPL Preview"
                  className={className + " opacity-30 pointer-events-none "}
                />
              ))
          }
          <span className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <span className="w-full bg-linear-to-br from-red-900 to-rose-950 text-red-50 py-6 px-5 flex flex-col rounded-3xl justify-center gap-0 mx-2">
              <Siren className="size-10 mb-2 mx-auto" />
              <span className="text-xl font-bold text-center">Error rendering your code</span>
              <span className="text-sm mt-4 opacity-90 text-balance bg-white/10 py-2 px-3 rounded-md -mb-1">{error}</span> 
            </span>
          </span>
        </span>
      ) : (
        b64.map((item, idx) => (
          <span className="relative group flex flex-col" key={idx}>
            <span className={"flex justify-between items-center h-10 transition-all duration-300 overflow-hidden w-full" + (b64.length > 1 ? " " : " h-0! w-0!")}>
              <span className="h-7 min-w-7 bg-white/20 text-white px-2 rounded-md flex items-center justify-center font-semibold">{idx+1}</span>
              <span className="flex gap-1">
                <Button onClick={() => dwPng(item)} variant='outline' className='rounded-md px-2.5! h-7 flex items-center gap-1'>
                  <Image className='inline size-3.5 -ml-0.5' />
                  <span>PNG</span>
                </Button>
                <Suspense fallback={
                  <Button variant='outline' className='rounded-md px-2.5! h-7 flex items-center gap-1'>
                    <Loader2 className='inline size-3.5 -ml-0.5 animate-spin' />
                    <span>PDF</span>
                  </Button>
                }>
                  <DownloadAsPdf base64Png={[item]} />
                </Suspense>
              </span>
            </span>
            <img
              key={idx}
              src={item ? `data:image/png;base64,${item}` : undefined}
              alt="ZPL Preview"
              className={className}
            />
          </span>
        ))
      )}
    </div>
  )
}