import { useEffect, useState } from "react";
import { loadZebraPrint } from "@/lib/loadZebraPrint";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { AlertCircle, Download, Printer } from "lucide-react";
import { Button } from "./ui/button";

export default function SendToPrinter() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadZebraPrint().then(() => setReady(true)).catch(console.error);
  }, []);

 return(
   <Dialog>
     <DialogTrigger asChild>
        <Button variant='outline' className={'rounded-md px-2.5! h-7 flex items-center gap-2 ' + (ready ? "" : "animate-pulse")} disabled={!ready}>
          {ready ? <Printer className='inline size-3.5' /> : <Download className='inline size-3.5 animate-pulse' />}
          <span className='container hidden @sm:inline'>Send to printer</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className='inline size-5' />
            <span>Print</span>
            <span className="font-normal text-sm text-orange-300 bg-orange-600/15 px-1.5 py-0.5 rounded-sm">Zebra Browser Print 3.1.250</span>
          </DialogTitle>
          <DialogDescription className="mb-5 flex flex-col gap-2">
            <span>This option is available only if you have the Zebra Browser Print installed and running on your computer.</span>
           <span className="font-bold text-orange-300">debug: sdk: {ready ? "loaded" : "not loaded"}</span>
          </DialogDescription>
         <DialogFooter className="flex flex-col items-center gap-2 text-orange-300">
            <AlertCircle className="inline size-4"/>
            <span>This feature is not implemented yet!</span>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
 );
}