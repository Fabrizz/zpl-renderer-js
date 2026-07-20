> ZPL-Renderer-JS is a wrapper of [Zebrash by IngridHQ](https://github.com/ingridhq/zebrash)

# ZPL-Renderer-JS
Convert Zebra ZPL labels to PNG directly in the browser (or node) without the use of third party services like Labelary or labelzoom!, supports multiple labels with templates!

[<img alt="Fabriz Logo" src="./.github/bar-zpl.png" height="110px"/>](https://www.npmjs.com/package/zpl-renderer-js)
[<img alt="Fabriz Logo" src="./.github/bar-xaviewer.png" height="110px"/>](https://xaviewer.fabriziob.com/)


## Web Editor
You can use the full in-browser ZPL viewer+editor here: https://xaviewer.fabriziob.com/
> Source code for XaViewer will be put public soon!


## Instalation
```bash
npm i zpl-renderer-js
```

## Usage
The NPM package includes `.esm` and `.cjs` builds, in two flavors: the default `zpl-renderer-js` inlines the WASM directly in the JS bundle (simplest, but large), and `zpl-renderer-js/external` loads the WASM as a separate file you control (recommended).

> [!NOTE]
> Loading the library in a web worker is also recommended and more so if you are planning on doing multiple renderings in a short time span. <br/> For now, you need to use a WebWorker manually. An example WebWorker can be found in `examples/1-zpl-web-worker.ts` and a consumer react component in `examples/1-zpl-ww-consumer.tsx`

> [!TIP]
> Need a plain `<script>`/UMD build (no ES modules, global `zpljs` variable, AMD loaders)? That was removed starting in `4.0.0`. Install the last version that shipped it instead: `npm i zpl-renderer-js@3` (or pin `zpl-renderer-js@3.4.0`) and see [that version's README](https://github.com/Fabrizz/zpl-renderer-js/blob/v3.4.0/README.md) for usage.

### Recommended: external WASM
`zpl-renderer-js/external` keeps the WASM out of your JS bundle entirely — it ships as a real `dist/zebrash.wasm` file inside the npm package, so jsDelivr/unpkg serve it at a stable, cacheable, streamable CDN URL for free, and bundlers can resolve it as a plain asset. You tell it explicitly where to load the WASM from via `init()`, once, before using anything else.

```ts
import { init, zplToBase64Async } from "zpl-renderer-js/external";

// Pin this to the exact version you installed, so the WASM always matches
// the wasm_exec.js runtime bundled in this JS.
await init({
  wasmUrl: "https://cdn.jsdelivr.net/npm/zpl-renderer-js@4.0.0/dist/zebrash.wasm",
  // or: "https://unpkg.com/zpl-renderer-js@4.0.0/dist/zebrash.wasm"
});

const label = await zplToBase64Async("^XA^FO50,50^ADN,36,20^FDHello^FS^XZ");
```

**With Vite** (or another bundler that supports the `?url` suffix), you can self-host the WASM file that's already inside the package instead of pointing at a CDN:
```ts
import { init, zplToBase64Async } from "zpl-renderer-js/external";
import wasmUrl from "zpl-renderer-js/wasm?url";

await init({ wasmUrl });
const label = await zplToBase64Async("^XA^FO50,50^ADN,36,20^FDHello^FS^XZ");
```

**In Node**, read the bytes from disk instead of fetching over the network:
```ts
import { init, zplToBase64Async } from "zpl-renderer-js/external";
import { readFile } from "node:fs/promises";

const wasmBytes = await readFile(require.resolve("zpl-renderer-js/wasm"));
await init({ wasmBytes });

const label = await zplToBase64Async("^XA^FO50,50^ADN,36,20^FDHello^FS^XZ");
```
`init()` also accepts `wasmModule` (an already-compiled `WebAssembly.Module`, e.g. shared across workers). Calling any render function before `init()` resolves throws a clear error telling you to call it first.

### Inlined WASM (simpler, larger bundle)
The default `zpl-renderer-js` import is a drop-in, zero-config option — no second file to host — at the cost of bundle size.

> [!WARNING]
> The output of this build is **~8MB** as the wasm is inlined inside so no resource has to be loaded separately. If bundle size or streaming/caching the WASM matters to you, use `zpl-renderer-js/external` above instead. Otherwise, it is highly recommended that you use a bundler and lazy load the library (or the component that uses it).

#### Rendering a single label (Original)
```ts
import { ready } from "zpl-renderer-js"
import fs from "node:fs";

const { api } = await ready;
const label = await api.zplToBase64Async("^XA^FO50,50^ADN,36,20^FDHello^FS^XZ");

fs.writeFileSync("zpl.png", Buffer.from(label, "base64"));
```

#### Rendering multiple labels
```ts
import { ready } from "zpl-renderer-js"
import fs from "node:fs";

const { api } = await ready;
const labels = await api.zplToBase64MultipleAsync("...");

for (const label in labels) {
  fs.writeFileSync(`zpl-${labels.indexOf(label)}.png`, Buffer.from(label, "base64"));
}
```

### ZplApi
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
   */
  zplToBase64Async: (
    zpl: string,
    widthMm?: number,
    heightMm?: number,
    dpmm?: number
  ) => Promise<string>;

  /**
   * Asynchronously render multiple ZPL labels into PNG images (Base64-encoded strings).
   * 
   * @param zpl - The raw ZPL code containing multiple labels to render.
   * @param widthMm - Label width in millimeters. Defaults to 101.6 mm (~4 inches).
   * @param heightMm - Label height in millimeters. Defaults to 203.2 mm (~8 inches).
   * @param dpmm - Dots per millimeter (print resolution). Defaults to 8 (~203 DPI).
   * @returns A Promise that resolves to an array of Base64-encoded PNG image strings representing the rendered labels.
   * @throws Will throw an error if the ZPL is invalid or rendering fails.
   */

  zplToBase64MultipleAsync: (
    zpl: string,
    widthMm?: number,
    heightMm?: number,
    dpmm?: number
  ) => Promise<string[]>;
```
<br/>

<img alt="Fabriz logo" src="./.github/logo.png" width="92"><br/>

#

[<img alt="Fabriz logo" src="./.github/fabriz.png" width="92" align="right">](https://fabriziob.com)
<p align="left">Made with 💛 by Fabrizio</p>