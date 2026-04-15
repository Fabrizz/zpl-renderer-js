import { useState, Suspense, lazy, useRef, useEffect } from 'react'
import { BookMarked, CodeXml, Grip, Image, Loader2, Proportions, RotateCwSquare, RulerDimensionLine, SquareArrowOutUpRight } from 'lucide-react';
import { demoZpl } from '../zplLanguage';
import { Button } from './ui/button';
import { clamp, downloadBase64Png, downloadTxtFile } from '../lib/utils';
import { Label } from './ui/label';
import Header from './Header';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { toast } from 'sonner';

const ZplWorkbench = lazy(() => import('./ZplWorkbench'));
const ZplPreviewWW = lazy(() => import('./ZplPreviewWW'));
const SendToPrinter = lazy(() => import('./SendToPrinter'));
const DownloadAsPdf = lazy(() => import('./DownloadAsPdf'));
const Help = lazy(() => import('./Help'));

/* widthMm := 101.6 | heightMm := 203.2 | dpmm := 8 */

const DEFAULT_WMM = 101.6;
const DEFAULT_HMM = 203.2;
const DEFAULT_DPMM = 8;
const DEFAULT_ROTATION = 0;
const DEFAULT_PRINT_DENSITY = 8;
const DEFAULT_LABEL_UNIT = "i";
const DEFAULT_LABEL_WIDTH = 4;
const DEFAULT_LABEL_HEIGHT = 8;

function App() {
  const [zpl, setZpl] = useState(demoZpl);
  const [cmd, setCmd] = useState<string | null>(null);
  const [imageArray, setimageArray] = useState<string[] | Error>(['']);

  const [printDensity, setPrintDensity] = useState<number>(DEFAULT_PRINT_DENSITY);
  const [labelUnit, setLabelUnit] = useState<string>(DEFAULT_LABEL_UNIT);
  const [labelWidth, setLabelWidth] = useState<number>(DEFAULT_LABEL_WIDTH);
  const [labelHeight, setLabelHeight] = useState<number>(DEFAULT_LABEL_HEIGHT);
  const [rotation, setRotation] = useState<number>(DEFAULT_ROTATION);

  const [wmm, setWmm] = useState<number | undefined>(DEFAULT_WMM);
  const [hmm, setHmm] = useState<number | undefined>(DEFAULT_HMM);
  const [dpmm, setDpmm] = useState<number | undefined>(DEFAULT_DPMM);

  function setWidth(w: number, unit: string) {
    if (w < 1) w = 1;
    if (unit === "i" && w > 80) w = 80;
    setLabelWidth(w);
    if (unit === "i") {
      // inches to mm
      w = w * 25.4;
    } else if (unit === "c") {
      // cm to mm
      w = w * 10;
    }
    setWmm(w);
  }
  function setHeight(h: number, unit: string) {
    if (h < 1) h = 1;
    if (unit === "i" && h > 80) h = 80;
    setLabelHeight(h);
    if (unit === "i") {
      // inches to mm
      h = h * 25.4;
    } else if (unit === "c") {
      // cm to mm
      h = h * 10;
    }
    setHmm(h);
  }
  function setDensity(d: number) {
    setPrintDensity(d);
    setDpmm(d);
  }
  function setRotationInternal(r: number) {
    if (r < 0) r = 0;
    setRotation(0);
    toast.info("Label rotation is not yet implemented.", { duration: 4000 });
  }

  // TODO WHEN INCH/CM/MM CHANGES RERUN SET-HEIGHT/WIDHT


  function dwZpl() {
    if (!zpl) {
      toast.error("Could not download your file.", { description: "Empty file" });
      return;
    };
    if (imageArray instanceof Error) {
      toast.error("Could not download your file.", {
        description: "There was an error with the ZPL code.",
      });
      return;
    }
    downloadTxtFile(zpl);
    toast.success("Generated label.zpl", { description: "Download should start shortly." });
  }

  function dwPng(s?: string) {
    if (imageArray instanceof Error) {
      toast.error("Could not download your file.", {
        description: "There was an error with the ZPL code.",
      });
      return;
    }

    if (s) {
      // Descarga una sola etiqueta
      downloadBase64Png(s, `label.png`);
      toast.success(`Generated label.png`, {
        description: "Download should start shortly.",
      });

    } else {
      // imageArray es string[]
      if (!Array.isArray(imageArray) || imageArray.length === 0) {
        toast.error("Could not download your file.", {
          description: "No rendered PNGs were produced.",
        });
        return;
      }

      // Descarga todas las etiquetas como archivos individuales
      imageArray.forEach((b64, i) => {
        const name = `label-${String(i + 1).padStart(3, "0")}.png`;
        downloadBase64Png(b64, name);
      });

      toast.success(`Generated ${imageArray.length} PNGs`, {
        description: "You may need to allow multiple downloads in browser.",
      });
    }
  }

  const [leftPct, setLeftPct] = useState<number>(() => {
    const saved = localStorage.getItem("split-left-pct");
    return saved ? Number(saved) : 50;
  });
  const gridRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  useEffect(() => {
    localStorage.setItem("split-left-pct", String(leftPct));
  }, [leftPct]);

  // Update the CSS variable on the grid
  const gridStyle = { ["--left" as string]: `${leftPct}%` };

  function onPointerDown(e: React.PointerEvent) {
    if (!gridRef.current) return;
    draggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    document.body.style.cursor = "col-resize";
    document.body.classList.add("select-none");
  }

  const LEFT_MIN_PX = 420;   // Monaco min width you want
  const RIGHT_MIN_PX = 320;  // keep some space for preview

  function onPointerMove(e: React.PointerEvent) {
    if (!draggingRef.current || !gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;

    // translate pixel mins to % for this viewport
    const minPct = (LEFT_MIN_PX / rect.width) * 100;
    const maxPct = 100 - (RIGHT_MIN_PX / rect.width) * 100;

    setLeftPct(clamp(pct, minPct, maxPct));
  }

  function onPointerUp(e: React.PointerEvent) {
    draggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    document.body.style.cursor = "";
    document.body.classList.remove("select-none");
  }

  function zplCurrentCommand(cmd: string | null) {
    setCmd(cmd);
  }

  return (
    <main className='dark md:fixed inset-0 flex flex-col md:grid grid-rows-[auto_1fr] w-full overflow-hidden bg-neutral-950'>
      <Header />

      <div
        ref={gridRef}
        style={gridStyle}
        className="
          grid h-full w-full overflow-hidden
          grid-cols-1
          md:[grid-template-columns:minmax(380px,var(--left,50%))_3px_minmax(320px,1fr)]
        "
        // Handle drag events at grid level so pointer capture works everywhere
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <div className="min-w-0 min-h-0 overflow-hidden bg-[#1e1e1e]">
          <div className='flex flex-col md:h-full'>
            
              <Suspense fallback={
                <div className='flex relative overflow-hidden items-center justify-center gap-2 w-full max-w-full flex-wrap z-20 h-9.5 px-1.5 border-b border-white/10 bg-neutral-900/80'>
                  <div className='h-7 flex-1 flex items-center px-2 justify-center rounded-md bg-white/10 text-white border animate-pulse'>
                    <Loader2 className='inline size-4 animate-spin' />
                  </div>
                </div>
              }>
                <Help cmd={cmd} />
              </Suspense>

            <div className='flex-1 p-0 m-0 relative md:h-0'>
              <Suspense fallback={
                <div className='flex-1 h-72 md:h-full flex flex-col items-center px-2 gap-3 justify-center text-white animate-pulse'>
                  <Loader2 className='inline size-8 animate-spin' />
                  <span className='text-white/50'>Loading editor</span>
                </div>
              }>
                <ZplWorkbench set={setZpl} initial={demoZpl} onCurrentCommand={zplCurrentCommand}/>
              </Suspense>
            </div>
            <div className='@container text-xs w-full bg-[#1e1e1e] text-white flex gap-1 justify-between border-t border-border'>
              <a href='https://www.zebra.com/content/dam/support-dam/en/documentation/unrestricted/guide/software/zplii-pm-vol2-en.pdf' className='border-r border-border flex gap-1 items-center px-1'>
                <BookMarked size={12} />
                <span className='hidden @md:inline'>Zebra ZPL documentation</span>
                <span className='inline @md:hidden'>Docs</span>
              </a>
              <span className='flex items-center'>
                <span className='border-l border-border flex gap-1 items-center px-1'>
                  <span>
                    {labelWidth}<span className='opacity-60'>w</span>{" "}x{" "}{labelHeight}<span className='opacity-60'>h</span>{" "}<span className='opacity-60'>({labelUnit === "i" ? "in" : (labelUnit === "c" ? "cm" : "mm")})</span>{" "}-{" "}{printDensity}<span className='opacity-60'>dpmm</span>{" "}-{" "}{rotation}°
                  </span>
                  <Proportions size={12} />
                </span>
                <a href='https://github.com/Fabrizz/zpl-renderer-js' className='border-l border-border flex gap-1 items-center px-1'>
                  <span className='hidden @md:inline'>Report an error</span>
                  <span className='inline @md:hidden'>Report error</span>
                  <SquareArrowOutUpRight size={12} />
                </a>
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-label="Resize panes"
          role="separator"
          aria-orientation="vertical"
          aria-valuemin={15}
          aria-valuemax={85}
          aria-valuenow={leftPct}
          onDoubleClick={() => setLeftPct(50)}
          onPointerDown={onPointerDown}
          className="
            hidden md:block
            h-full w-0.75 cursor-col-resize
            bg-transparent border-r-4 border-dotted active:border-r
            border-gray-500 hover:border-cyan-600 active:border-solid active:border-cyan-400
          "
        />

        <div className='min-w-0 min-h-0 overflow-hidden bg-neutral-950 relative group pb-10'>
          <span className='absolute -top-4 -right-4 bg-yellow-400 h-26 w-26 blur-3xl shadow-xl'></span>
          <span className='absolute -bottom-4 -left-4 bg-pink-400 h-26 w-26 blur-3xl shadow-xl'></span>

          <div className='@container flex items-center justify-between center gap-2 w-full max-w-full flex-wrap z-20 h-9.5 px-1.5 border-b border-white/10 bg-neutral-900/80'>
            <div className='flex items-center gap-1 text-white/80'>
              <Button onClick={() => dwZpl()} variant='outline' className='rounded-md px-2.5! h-7 flex items-center gap-1'>
                <CodeXml className='inline size-3.5 -ml-0.5' />
                <span>ZPL</span>
              </Button>
              <Button onClick={() => dwPng()} variant='outline' className='rounded-md px-2.5! h-7 flex items-center gap-1'>
                <Image className='inline size-3.5 -ml-0.5' />
                <span>PNG</span>
              </Button>
              <Suspense fallback={
                <Button variant='outline' className='rounded-md px-2.5! h-7 flex items-center gap-1'>
                  <Loader2 className='inline size-3.5 -ml-0.5 animate-spin' />
                  <span>PDF</span>
                </Button>
              }>
                <DownloadAsPdf base64Png={imageArray}/>
              </Suspense>
            </div>
            <div className='z-20 text-white/80 flex items-center gap-1'>
              <Suspense fallback={
                <Button variant='outline' className='rounded-md px-2.5! h-7 flex items-center gap-2 animate-pulse'>
                  <Loader2 className='inline size-3.5 animate-spin' />
                  <span className='container hidden @sm:inline'>Send to printer</span>
                </Button>
              }>
                <SendToPrinter />
              </Suspense>
            </div>
          </div>

          <div className='absolute z-20 bottom-0 left-4 w-[calc(100%-32px)] @container max-w-2xl'>
            <div className='h-full w-full rounded-t-2xl border-t border-l border-r border-white/10 shadow-xl bg-neutral-950/80 backdrop-blur-lg px-3 pb-4 pt-3.5 @md:pb-3! @md:pt-3!'>

              <div className="grid gap-x-3 gap-y-2 @md:grid-cols-2 group/control">
                <div className="grid gap-3">
                  <Label htmlFor="alignment" className='items-center flex gap-1 -mb-1.25'>
                    <span>
                      <RulerDimensionLine className='inline size-4' />
                      <RotateCwSquare className='inline size-4 @md:hidden' />
                    </span>
                    <span>Label size{" "}<span className='@md:hidden'>& Rotation</span></span>
                  </Label>
                  <div className='flex gap-2 items-center w-full'>
                    <div className='flex-1 flex items-center gap-2'>
                      <div className='relative flex-1'>
                        <Input type="number" placeholder="4" className='h-8!' value={labelWidth} onChange={(e) => { setWidth(Number(e.target.value), labelUnit) }} />
                        <div className="absolute group-hover/control:hidden top-0 right-0 text-xs h-4 w-4 m-1 rounded-full bg-white/10 text-white/80 flex items-center justify-center overflow-hidden ">
                          <RulerDimensionLine className='inline size-2.5' />
                        </div>
                      </div>
                      <div className='relative flex-1'>
                        <Input type="number" placeholder="8" className='h-8!' value={labelHeight} onChange={(e) => { setHeight(Number(e.target.value), labelUnit) }} />
                        <div className="absolute group-hover/control:hidden top-0 right-0 text-xs h-4 w-4 m-1 rounded-full bg-white/10 text-white/80 flex items-center justify-center overflow-hidden ">
                          <RulerDimensionLine className='inline size-2.5 -rotate-90' />
                        </div>
                      </div>
                    </div>
                    <Select onValueChange={(e) => { setLabelUnit(e) }}>
                      <SelectTrigger
                        id="alignment"
                        aria-label="alignment"
                        className='w-15 h-8!'
                        value={labelUnit}
                        disabled
                      >
                        <SelectValue placeholder={"in"} />
                      </SelectTrigger>
                      <SelectContent >
                        <SelectItem value="i" >in</SelectItem>
                        <SelectItem value="m">mm</SelectItem>
                        <SelectItem value="c">cm</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => setRotationInternal((rotation + 90) % 360)}
                      className='h-8! pr-2! pl-2.5! flex justify-start relative w-15 @md:hidden'
                      variant={"outline"}
                    >
                      {/* TODO ADD CONN LATER */}
                      <div
                        className="absolute group-hover/control:hidden top-0 right-0 text-xs h-4 w-4 m-1 rounded-full bg-white/10 text-white/80 flex items-center justify-center overflow-hidden "
                      >
                        <RotateCwSquare className='inline size-2.5' />
                      </div>
                      <span className='font-normal text-sm'>{rotation}°</span>
                    </Button>
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="inch" className='items-center flex gap-1 -mb-1.25'>
                    <Grip className='inline size-4' />
                    <span>Print density</span>
                  </Label>

                  <Select onValueChange={(e) => { setDensity(Number(e)) }}>
                    <SelectTrigger
                      id="inch"
                      aria-label="Type"
                      className='w-full h-8!'
                      value={String(printDensity)}
                    >
                      <SelectValue placeholder={<span>8 dpmm <span className='text-xs'>(203 dpi)</span></span>} />
                    </SelectTrigger>
                    <SelectContent >
                      <SelectItem value="6"><span>6 dpmm <span className='text-xs'>(152 dpi)</span></span></SelectItem>
                      <SelectItem value="8"><span>8 dpmm <span className='text-xs'>(203 dpi)</span></span></SelectItem>
                      <SelectItem value="12"><span>12 dpmm <span className='text-xs'>(300 dpi)</span></span></SelectItem>
                      <SelectItem value="24"><span>24 dpmm <span className='text-xs'>(600 dpi)</span></span></SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

            </div>
          </div>

          <div className="box-border grid h-full w-full place-items-center py-4 px-3 z-10 
            overflow-y-scroll overscroll-contain [scrollbar-gutter:stable_both-edges] nice-scroll">
            <Suspense fallback={
              <div className='flex-1 h-full flex flex-col items-center px-2 gap-3 justify-center text-white animate-pulse'>
                <Loader2 className='inline size-8 animate-spin' />
                <span className='text-white/50'>Loading preview</span>
              </div>
            }>
              <ZplPreviewWW debounce={500} debounceConfig={1000} zpl={zpl} wmm={wmm} hmm={hmm} dpmm={dpmm} rotation={rotation} setimageArray={setimageArray} dwPng={dwPng} className='max-h-full z-10 max-w-full object-contain select-none' />
            </Suspense>
          </div>
        </div>

      </div>
    </main>
  )
}

export default App
