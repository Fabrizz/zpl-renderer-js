import { Info, Link, Package } from 'lucide-react';
import logomini from '../assets/logomini.png';
import fb from '../assets/fblogo.png';
import { Button } from './ui/button';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function Header() {
  return (
    <header className="flex h-12 items-center justify-between gap-2 overflow-hidden relative border-b border-white/10 bg-neutral-900/80 text-white">
      <span className='absolute h-9 w-16 -top-4 -left-2 bg-pink-400 z-0 blur-[30px]'></span>
      <div className='flex items-center gap-3 z-10 px-3'>
        <img src={logomini} alt="Xa Viewer Logo" className='h-7' />
        <h1 className="text-sm font-extrabold lg:text-xl
           text-transparent bg-clip-text
           bg-linear-to-br from-[#ef35ef] to-[#FFDB14]">
          XA Viewer
        </h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={'outline'} className={'rounded-md px-1.5! h-6 flex items-center gap-2 text-white/70 font-normal'}>
              <Info className='inline size-3' />
              <span className='text-xs mb-px'>What is this?</span>
            </Button>
          </DialogTrigger>
          <DialogContent className='rounded-2xl'>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 mb-3">
                <Info className='inline size-5' />
                <span>What is this?</span>
              </DialogTitle>
              <DialogDescription className="mb-1 flex flex-col w-full gap-2">
                <div className='flex flex-col gap-2 bg-[#1e1e1e] px-3 py-3 rounded-md'>
                  <div className='flex items-center gap-2'>
                    <img src={logomini} alt="Xa Viewer Logo" className='h-7' />
                    <h1 className="text-xl font-extrabold
                    text-transparent bg-clip-text
                    bg-linear-to-br from-[#ef35ef] to-[#FFDB14]">
                      XA Viewer
                    </h1>
                  </div>
                  <span className='text-sm text-white'>
                    XA Viewer is a web application that allows you to view and edit ZPL (Zebra Programming Language) code.
                  </span>
                </div>
                <div>
                  <a href='https://github.com/Fabrizz/zpl-renderer-js/' className='flex flex-col gap-2 bg-[#1e1e1e] px-3 py-3 rounded-t-md'>
                    <div className='flex items-center gap-2'>
                      <h1 className="text-xl font-extrabold text-white flex gap-2 items-center w-full">
                        <span>Zpl-Renderer-JS</span>
                        <span className='flex items-center gap-1 bg-red-500/20 text-xs px-2 rounded-md text-red-300'>
                          <Package className='inline size-4 -ml-0.5' />
                          <span className='text-sm mb-0.5'>npm</span>
                        </span>
                        <Link className='inline size-4 ml-auto mr-1' />
                      </h1>
                    </div>
                    <span className='text-sm text-white'>
                      Zpl-Renderer-JS is a JavaScript library that allows you to render ZPL code in the browser. It is used by XA Viewer to render ZPL code in real-time.
                    </span>
                    <span className='text-sm text-white'>An alternative to Labelary, Labelzoom or others that use an external API to render.</span>
                  </a>
                  <span
                    className='w-full text-sm text-amber-200 bg-amber-500/10 py-2 px-3 rounded-b-md flex items-center gap-1'>
                    <span className='flex-1'>Zpl-Renderer-JS is a wrapper of{" "}
                      <a href='https://github.com/ingridhq/zebrash' className='border-b font-semibold border-amber-300/60'>Go Zebrash by IngridHQ</a>
                    </span>
                  </span>
                </div>

                <a href='https://github.com/Fabrizz/' className='flex flex-col gap-2 bg-[#1e1e1e] px-3 py-3 rounded-md'>
                  <h1 className="text-xl font-extrabold text-white flex gap-2.5 items-center w-full">
                    <img src={fb} alt="" className='size-7' />
                    <span className='text-xl font-extrabold text-white flex gap-0 items-center -mt-1'>
                      <span className='font-normal'>github.com/</span>
                      <span>fabrizz</span>
                    </span>
                    <Link className='inline size-4 ml-auto mr-1' />
                  </h1>
                </a>
                <span className='mt-3'>Some features are not yet implemented, if you miss something please open an issue or a PR on the GitHub repository.</span>
                <span className='mt-0.5'>Editor recommendations where generated using the Zebra ZPL docs. Some recommendations may be wrong.</span>
                <span className='mt-0.5'>This project is not affiliated with Zebra Technologies.</span>
                <span className='mt-0.5'>Made with 💜 by Fabrizio.</span>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className='flex flex-row'>
        <a href='https://fabriziob.com' className='flex flex-row items-center gap-2 pl-2.5 pr-3 z-10 border-l border-border hover:bg-white/10 transition-all h-12'>
          <img src={fb} alt="" className='size-7' />
        </a>

        <div className='flex itmes-center gap-2 z-10 border-l border-border hover:bg-white/10 transition-all'>
          <a href='https://github.com/Fabrizz/zpl-renderer-js'
            className='flex items-center gap-2 pr-1 md:pr-4 pl-3 text-white h-12 justify-center'>
            <svg className='size-5 lg:size-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>github</title><path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" fill="currentColor" /></svg>
            <span className='flex flex-col'>
              <span className='text-xs font-bold hidden lg:flex flex-row items-center gap-1'>
                <span>zpl-renderer-js</span>
                <span className='flex items-center gap-1 bg-red-500/20 text-xs px-1.5 rounded-md text-red-300 flex-nowrap'>
                  <Package className='inline size-3.5 -ml-0.5' />
                  <span className='text-xs mb-0.5'>npm</span>
                </span>
              </span>
              <span className='hidden lg:inline text-xs -mt-px'>In-browser ZPL to PNG library</span>
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}