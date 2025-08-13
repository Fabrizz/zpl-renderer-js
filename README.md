> ZPL-Renderer-JS is a WASM port of Zebrash

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
const zplImage = api.Render("^XA^FO50,50^ADN,36,20^FDHello^FS^XZ");

console.log("Base64 PNG", zplImage)
```

```ts
  /**
   * Render a ZPL label into a PNG image (Base64-encoded string).
   *
   * @param zpl - The raw ZPL code to render.
   * @param widthMm - Label width in millimeters. Defaults to 101.6 mm (~4 inches).
   * @param heightMm - Label height in millimeters. Defaults to 203.2 mm (~8 inches).
   * @param dpmm - Dots per millimeter (print resolution). Defaults to 8 (~203 DPI).
   * @returns A Base64-encoded PNG image string representing the rendered label.
   */
  Render: (
    zpl: string,
    widthMm?: number,
    heightMm?: number,
    dpmm?: number
  ) => string;
```

### Zebrash by IngridHQ
You can find the original Zebrash GO lib here: https://github.com/ingridhq/zebrash.
