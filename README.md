> ZPL-Renderer-JS is a wrapper of [Zebrash by IngridHQ](https://github.com/ingridhq/zebrash)

<img alt="Fabrizz Logo" src="./.github/logo.png" width="80px"/>

# ZPL-Renderer-JS
Render ZPL to PNG directly in the browser (or node) without the use of third party services like Labelary or labelzoom!

## Instalation
```bash
npm i zpl-renderer-js
```

## Usage
The NPM package includes .umd, .esm, and .cjs it also includes the raw WASM if you want to directly use it or load it in a different way.

> [!IMPORTANT]  
> The output of this library is **+9MB** as it bundles the WASM and the necessary handlers for it to work. Its higly recommended that you defer/cache the lib.

```ts
import { ready } from "zpl-renderer-js"

const { api } = await ready;
const zplImage = await api.zplToBase64Async("^XA^FO50,50^ADN,36,20^FDHello^FS^XZ");

console.log("Base64 PNG", zplImage)
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

  ///////////// [OLD API] /////////////
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
