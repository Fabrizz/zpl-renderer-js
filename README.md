> ZPL-Renderer-JS is a wrapper of [Zebrash by IngridHQ](https://github.com/ingridhq/zebrash)

<img alt="Fabrizz Logo" src="./.github/bar-zpl.png" height="120px"/>

# ZPL-Renderer-JS
Convert Zebra ZPL labels to PNG directly in the browser (or node) without the use of third party services like Labelary or labelzoom!

### Online playground
XA Viewer has ZPL completitions/recommendations and lets you export ZPL in various image types:<br/>[<img alt="Fabrizz Logo" src="./.github/bar-xaviewer.png" height="120px"/>](https://xaviewer.fabriz.co/)

## Instalation
```bash
npm i zpl-renderer-js
```

## Usage
The NPM package includes `.umd`, `.esm`, and `.cjs` builds. You can also find the raw `WASM` if you want to load it as a separate resource.
> In case of using the raw `WASM` you will need to load `src/wasm_exec.js` and create a wrapper for the functions.

> [!WARNING]  
> The output of this library (per build) is **~8MB** as the wasm is inlined inside so no resource has to be loaded separately. It is higly recommended that you use a bundler and lazy load the library (or the component that uses the lib.) <br/> In case of using the `.umd` build defer the load of the resource.

> [!NOTE]
> Loading the library in a web worker is also recommended and more so if you are planning on doing multiple renderings in a short time span. <br/> For now this is not included as a function directly in the library, you need to create and load the web worker. An example can be found in `examples/1-zpl-web-worker.ts` and a consumer component in `examples/1-zpl-ww-consumer.tsx`

```ts
import { ready } from "zpl-renderer-js"

const { api } = await ready;
const zplImage = await api.zplToBase64Async("^XA^FO50,50^ADN,36,20^FDHello^FS^XZ");

console.log("Base64 PNG: ", zplImage)
```

```ts
  /**
   * Asynchronously render a ZPL label into a PNG image (Base64-encoded string).
   *
   * @param zpl - The raw ZPL code to render.
   * @param widthMm - Label width in millimeters. Defaults to 101.6 mm (~4 inches).
   * @param heightMm - Label height in millimeters. Defaults to 203.2 mm (~8 inches).
   * @param dpmm - Dots per millimeter (print resolution). Defaults to 8 (~203 DPI).
   * @returns A Promise that resolves to a Base64-encoded PNG image string representing the rendered label.
   * @throws Will throw an error if the ZPL is invalid or rendering fails.
   * @example
   * ```typescript
   * import { ready } from "zpl-renderer-js"
   * const { api } = await ready;
   * const zplImage = await api.zplToBase64Async("^XA^FO50,50^ADN,36,20^FDHello^FS^XZ");
   * console.log(zplImage); // Base64-encoded PNG string
   * ```
   */
  zplToBase64Async: (
    zpl: string,
    widthMm?: number,
    heightMm?: number,
    dpmm?: number
  ) => Promise<string>;

  ///////////// [OLD API, use the async variant] /////////////
  /**
   * Render a ZPL label into a PNG image (Base64-encoded string).
   *
   * @param zpl - The raw ZPL code to render.
   * @param widthMm - Label width in millimeters. Defaults to 101.6 mm (~4 inches).
   * @param heightMm - Label height in millimeters. Defaults to 203.2 mm (~8 inches).
   * @param dpmm - Dots per millimeter (print resolution). Defaults to 8 (~203 DPI).
   * @returns A Base64-encoded PNG image string representing the rendered label.
   * @deprecated Use `zplToBase64Async` instead.
   */
  Render: (
    zpl: string,
    widthMm?: number,
    heightMm?: number,
    dpmm?: number
  ) => string;
```

