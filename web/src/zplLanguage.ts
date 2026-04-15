
/* 
 * Completitions were generated ingesting the Zebra ZPL Docs in a LLM.
 * This was done a while ago so re-generating the completitions using
 * newer models / a larger context window would be a good idea.
 * 
 * Custom icons are inyected using CSS mask icons, view index.css
 */


export type Monaco = typeof import("monaco-editor");
export const ZPL_ID = "zpl";

export function registerZplLanguage(monacoInst: Monaco) {
  if (monacoInst.languages.getLanguages().some(l => l.id === ZPL_ID)) return;

  monacoInst.languages.register({ id: ZPL_ID, extensions: [".zpl"], aliases: ["ZPL"] });

  monacoInst.languages.setLanguageConfiguration(ZPL_ID, {
    comments: { lineComment: ";" },
    // brackets: [["^XA", "^XZ"], ["(", ")"], ["[", "]"]], // <- remove ^XA/^XZ
    brackets: [["(", ")"], ["[", "]"]],
    autoClosingPairs: [
      { open: "(", close: ")" },
      { open: "[", close: "]" },
      { open: '"', close: '"' },
    ],
    surroundingPairs: [
      { open: "(", close: ")" },
      { open: "[", close: "]" },
      { open: '"', close: '"' },
    ],
  });

  // Expanded command coverage:
  // Session/layout: ^XA ^XZ ^LH ^PW ^PO ^LL ^MC ^MN ^MF ^LR ^CI ^PR
  // Positioning/fields: ^FO ^FD ^FV ^FS
  // Text: ^A / ^A0 ^CF
  // Barcodes/2D: ^BY ^BC ^BX ^BD
  // Graphics: ^GB ^GF
  // Misc: ^CV ^FH
  const cmd = /(XA|XZ|LH|PW|PO|LL|MC|MN|MF|LR|CI|PR|FO|FD|FV|FS|A0?|CF|BY|BC|BX|BD|GB|GF|CV|FH)/;

  monacoInst.languages.setMonarchTokensProvider(ZPL_ID, {
    defaultToken: '',
    tokenizer: {
      root: [
        // comments
        [/;.*$/, "comment"],

        // field-data openers -> push state until ^FS
        [/\^F[DV]/, { token: "keyword", next: "@fielddata" }],

        // commands (caret or tilde)
        [new RegExp(`\\^${cmd.source}`), "keyword"],
        [/~(DG|DY)/, "keyword"],

        // numbers, commas, other text
        [/-?\d+(\.\d+)?/, "number"],
        [/,/, "delimiter"],
        [/[^\s^~]+/, "identifier"],
      ],

      // Everything until ^FS is considered string-ish payload
      fielddata: [
        // closing ^FS
        [/\^FS/, { token: "keyword", next: "@root" }],
        // escape flag (keep as keyword if you like)
        [/\^FH/, "keyword"],

        // allow embedded commands accidentally typed: highlight but keep state
        [new RegExp(`\\^${cmd.source}`), "keyword"],

        // treat rest as string (including commas, numbers, etc.)
        [/./, "string"],
      ],
    },
  });

  monacoInst.editor.defineTheme("zpl-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword", foreground: "7ad7ff", fontStyle: "bold" },
      { token: "number", foreground: "d19a66" },
      { token: "string", foreground: "98c379" },
      { token: "comment", foreground: "5c6370", fontStyle: "italic" },
      { token: "identifier", foreground: "e6e6e6" },
      { token: "delimiter", foreground: "c4c4c4" },
    ],
    colors: {},
  });
}


const suggestionSnip = 4; // monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet as number;
// const suggestionKind = languages.CompletionItemKind;

export const suggestionData = [
  /* BARCODE DATA ********************************************************************************************************/
  {
    label: "^B0",
    insertText: "^B0${1:a},${2:b},${3:c},${4:d},${5:e},${6:f},${7:g}",
    insertTextRules: suggestionSnip,
    kind: 5, // suggestionKind.Class,
    detail: "Aztec Bar Code Parameters",
    documentation: {
      value: [
        "**Aztec** — `^B0a,b,c,d,e,f,g`",
        "",
        "- **a**: Orientation (`N`,`R`,`I`,`B`)",
        "- **b**: **Magnification** (module size, 1–10 typical)",
        "- **c–g**: Aztec options (ECI/reader init/symbol size & related flags; see Zebra).",
      ].join("\n"),
      isTrusted: true
    },
  },
  {
    label: "^B1",
    insertText: "^B1${1:o},${2:e},${3:h},${4:f},${5:g}",
    insertTextRules: suggestionSnip,
    kind: 5, // suggestionKind.Class,
    detail: "Code 11 Bar Code",
    documentation: {
      value: [
        "**Code 11** — `^B1o,e,h,f,g`",
        "",
        "- **o**: Orientation (`N`,`R`,`I`,`B`)",
        "- **e**: Check digit (varies by symbology) (`Y`/`N`)",
        "- **h**: Bar height (dots)",
        "- **f**: Print interpretation line (`Y`/`N`)",
        "- **g**: Print interpretation line above (`Y`/`N`)",
      ].join("\n"),
      isTrusted: true
    },
  },
  {
    label: "^B2",
    insertText: "^B2${1:o},${2:h},${3:f},${4:g},${5:e}",
    insertTextRules: suggestionSnip,
    kind: 5, // suggestionKind.Class,
    detail: "Interleaved 2 of 5 Bar Code",
    documentation: {
      value: [
        "**Interleaved 2 of 5** — `^B2o,h,f,g,e`",
        "",
        "- **o**: Orientation (`N`,`R`,`I`,`B`)",
        "- **h**: Bar height (dots)",
        "- **f**: Print interpretation line (`Y`/`N`)",
        "- **g**: Print interpretation line above (`Y`/`N`)",
        "- **e**: Check digit (Mod 10) (`Y`/`N`)",
      ].join("\n"),
      isTrusted: true
    },
  },
  {
    label: "^B3",
    insertText: "^B3${1:o},${2:e},${3:h},${4:f},${5:g}",
    insertTextRules: suggestionSnip,
    kind: 5, // suggestionKind.Class,
    detail: "Code 39 Bar Code",
    documentation: {
      value: [
        "**Code 39** — `^B3o,e,h,f,g`",
        "",
        "- **o**: Orientation (`N`,`R`,`I`,`B`)",
        "- **e**: Check digit (Mod 43) (`Y`/`N`)",
        "- **h**: Bar height (dots)",
        "- **f**: Print interpretation line (`Y`/`N`)",
        "- **g**: Print interpretation line above (`Y`/`N`)",
      ].join("\n"),
      isTrusted: true
    },
  },
  {
    label: "^B4",
    insertText: "^B4${1:o},${2:h},${3:f},${4:m}",
    insertTextRules: suggestionSnip,
    kind: 5, // suggestionKind.Class,
    detail: "Code 49 Bar Code",
    documentation: {
      value: [
        "**Code 49** — `^B4o,h,f,m`",
        "",
        "- **o**: Orientation (`N`,`R`,`I`,`B`)",
        "- **h**: Bar height (dots)",
        "- **f**: Print interpretation line (`Y`/`N`)",
        "- **m**: Mode/rows (symbology-specific option)",
      ].join("\n"),
      isTrusted: true
    },
  },
  {
    label: "^B5",
    insertText: "^B5${1:o},${2:h},${3:f},${4:g}",
    insertTextRules: suggestionSnip,
    kind: 5, // suggestionKind.Class,
    detail: "PLANET Code Bar Code",
    documentation: {
      value: [
        "**PLANET** — `^B5o,h,f,g`",
        "",
        "- **o**: Orientation (`N`,`R`,`I`,`B`)",
        "- **h**: Bar height (dots)",
        "- **f**: Print interpretation line (`Y`/`N`)",
        "- **g**: Print interpretation line above (`Y`/`N`)",
      ].join("\n"),
      isTrusted: true
    },
  },
  {
    label: "^B7",
    insertText: "^B7${1:o},${2:h},${3:s},${4:c},${5:r},${6:t}",
    insertTextRules: suggestionSnip,
    kind: 5, // suggestionKind.Class,
    detail: "PDF417 Bar Code",
    documentation: {
      value: [
        "**PDF417** — `^B7o,h,s,c,r,t`",
        "",
        "- **o**: Orientation (`N`,`R`,`I`,`B`)",
        "- **h**: Row height (dots)",
        "- **s**: Security level (error correction level)",
        "- **c**: Columns (1–30 typical)",
        "- **r**: Rows (3–90 typical)",
        "- **t**: Truncate right row indicators/stop pattern (`Y`/`N`)",
      ].join("\n"),
      isTrusted: true
    },
  },
  {
    label: "^B8",
    insertText: "^B8${1:o},${2:h},${3:f},${4:g}",
    insertTextRules: suggestionSnip,
    kind: 5, // suggestionKind.Class,
    detail: "EAN-8 Bar Code",
    documentation: {
      value: [
        "**EAN-8** — `^B8o,h,f,g`",
        "",
        "- **o**: Orientation (`N`,`R`,`I`,`B`)",
        "- **h**: Bar height (dots)",
        "- **f**: Print interpretation line (`Y`/`N`)",
        "- **g**: Print interpretation line above (`Y`/`N`)",
      ].join("\n"),
      isTrusted: true
    },
  },
  {
    label: "^B9",
    insertText: "^B9${1:o},${2:h},${3:f},${4:g},${5:e}",
    insertTextRules: suggestionSnip,
    kind: 5, // suggestionKind.Class,
    detail: "UPC-E Bar Code",
    documentation: {
      value: [
        "**UPC-E** — `^B9o,h,f,g,e`",
        "",
        "- **o**: Orientation (`N`,`R`,`I`,`B`)",
        "- **h**: Bar height (dots)",
        "- **f**: Print interpretation line (`Y`/`N`)",
        "- **g**: Print interpretation line above (`Y`/`N`)",
        "- **e**: Check digit print control (`Y`/`N`)",
      ].join("\n"),
      isTrusted: true
    },
  },
  {
    label: "^BA",
    insertText: "^BA${1:o},${2:h},${3:f},${4:g},${5:e}",
    insertTextRules: suggestionSnip,
    kind: 5, // suggestionKind.Class,
    detail: "Code 93 Bar Code",
    documentation: {
      value: [
        "**Code 93** — `^BAo,h,f,g,e`",
        "",
        "- **o**: Orientation (`N`,`R`,`I`,`B`)",
        "- **h**: Bar height (dots)",
        "- **f**: Print interpretation line (`Y`/`N`)",
        "- **g**: Print interpretation line above (`Y`/`N`)",
        "- **e**: Check digit/extended options (`Y`/`N`)",
      ].join("\n"),
      isTrusted: true
    },
  },
  {
    label: "^BB",
    insertText: "^BB${1:o},${2:h},${3:s},${4:c},${5:r},${6:m}",
    insertTextRules: suggestionSnip,
    kind: 5, // suggestionKind.Class,
    detail: "CODABLOCK Bar Code",
    documentation: {
      value: [
        "**CODABLOCK** — `^BBo,h,s,c,r,m`",
        "",
        "- **o**: Orientation (`N`,`R`,`I`,`B`)",
        "- **h**: Row height (dots)",
        "- **s**: **Check digit** (`Y`/`N`)",
        "- **c**: Columns",
        "- **r**: Rows",
        "- **m**: Mode (symbology-specific)",
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^BC",
    insertText: "^BC${1:o},${2:h},${3:print},${4:chk},${5:mode},${6:ucs}",
    insertTextRules: suggestionSnip,
    kind: 5, // suggestionKind.Class,
    detail: "Code 128 Bar Code (Subsets A, B, and C)",
    documentation: {
      value: [
        "**Code 128** — `^BCo,h,print,chk,mode,ucs`",
        "",
        "- **o**: Orientation (`N`,`R`,`I`,`B`)",
        "- **h**: Bar height (dots)",
        "- **print**: Print interpretation line (`Y`/`N`)",
        "- **chk**: Print check digit in text (`Y`/`N`)",
        "- **mode**: Subset (`A`,`B`,`C`,`D`,`U`)",
        "- **ucs**: UCC/EAN (GS1) check digit printing (`Y`/`N`)",
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^BD",
    insertText: "^BD${1:m},${2:n},${3:t}",
    insertTextRules: suggestionSnip,
    kind: 5, // suggestionKind.Class,
    detail: "UPS MaxiCode Bar Code",
    documentation: {
      value: [
        "**MaxiCode** — `^BDm,n,t`",
        "",
        "- **m**: Mode (2–5 typical, UPS usage)",
        "- **n**: **Position** (structured-append position within a set)",
        "- **t**: **Total** (structured-append total symbols in the set)",
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^BE",
    insertText: "^BE${1:o},${2:h},${3:f},${4:g}",
    insertTextRules: suggestionSnip,
    kind: 5, // suggestionKind.Class,
    detail: "EAN-13 Bar Code",
    documentation: {
      value: [
        "**EAN-13** — `^BEo,h,f,g`",
        "",
        "- **o**: Orientation (`N`,`R`,`I`,`B`)",
        "- **h**: Bar height (dots)",
        "- **f**: Print interpretation line (`Y`/`N`)",
        "- **g**: Print interpretation line above (`Y`/`N`)",
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^BF",
    insertText: "^BF${1:o},${2:h},${3:m}",
    insertTextRules: suggestionSnip,
    kind: 5, // suggestionKind.Class,
    detail: "MicroPDF417 Bar Code",
    documentation: {
      value: [
        "**MicroPDF417** — `^BFo,h,m`",
        "",
        "- **o**: Orientation (`N`,`R`,`I`,`B`)",
        "- **h**: Row height (dots)",
        "- **m**: Mode (row/column pattern selection)",
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^BI",
    insertText: "^BI${1:o},${2:h},${3:f},${4:g}",
    insertTextRules: suggestionSnip,
    kind: 5, // suggestionKind.Class,
    detail: "Industrial 2 of 5 Bar Code",
    documentation: {
      value: [
        "**Industrial 2 of 5** — `^BIo,h,f,g`",
        "",
        "- **o**: Orientation (`N`,`R`,`I`,`B`)",
        "- **h**: Bar height (dots)",
        "- **f**: Print interpretation line (`Y`/`N`)",
        "- **g**: Print interpretation line above (`Y`/`N`)",
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^BJ",
    insertText: "^BJ${1:o},${2:h},${3:f},${4:g}",
    insertTextRules: suggestionSnip,
    kind: 5, // suggestionKind.Class,
    detail: "Standard 2 of 5 Bar Code",
    documentation: {
      value: [
        "**Standard 2 of 5** — `^BJo,h,f,g`",
        "",
        "- **o**: Orientation (`N`,`R`,`I`,`B`)",
        "- **h**: Bar height (dots)",
        "- **f**: Print interpretation line (`Y`/`N`)",
        "- **g**: Print interpretation line above (`Y`/`N`)",
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^BK",
    insertText: "^BK${1:o},${2:e},${3:h},${4:f},${5:g},${6:k},${7:l}",
    insertTextRules: suggestionSnip,
    kind: 5, // suggestionKind.Class,
    detail: "ANSI Codabar Bar Code",
    documentation: {
      value: [
        "**Codabar** — `^BKo,e,h,f,g,k,l`",
        "",
        "- **o**: Orientation (`N`,`R`,`I`,`B`)",
        "- **e**: Check digit (`Y`/`N`)",
        "- **h**: Bar height (dots)",
        "- **f**: Print interpretation line (`Y`/`N`)",
        "- **g**: Print interpretation line above (`Y`/`N`)",
        "- **k,l**: Start/stop set, ratio or special options (device-dependent)",
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^BL",
    insertText: "^BL${1:o},${2:h},${3:g}",
    insertTextRules: suggestionSnip,
    kind: 5, // suggestionKind.Class,
    detail: "LOGMARS Bar Code",
    documentation: {
      value: [
        "**LOGMARS** — `^BLo,h,g`",
        "",
        "- **o**: Orientation (`N`,`R`,`I`,`B`)",
        "- **h**: Bar height (dots)",
        "- **g**: Print interpretation line above (`Y`/`N`)",
        "",
        "_Produces a **mandatory Mod-43 check digit**._",
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^BM",
    insertText: "^BM${1:o},${2:e},${3:h},${4:f},${5:g},${6:e2}",
    insertTextRules: suggestionSnip,
    kind: 5, // suggestionKind.Class,
    detail: "MSI Bar Code",
    documentation: {
      value: [
        "**MSI** — `^BMo,e,h,f,g,e2`",
        "",
        "- **o**: Orientation (`N`,`R`,`I`,`B`)",
        "- **e**: Check digit 1 (`Y`/`N`)",
        "- **h**: Bar height (dots)",
        "- **f**: Print interpretation line (`Y`/`N`)",
        "- **g**: Print interpretation line above (`Y`/`N`)",
        "- **e2**: Check digit 2 / Mod 11 options (`Y`/`N`)",
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^BO",
    insertText: "^BO${1:a},${2:b},${3:c},${4:d},${5:e},${6:f},${7:g}",
    insertTextRules: suggestionSnip,
    kind: 5, // suggestionKind.Class,
    detail: "Aztec Bar Code Parameters",
    documentation: {
      value: [
        "**Aztec** — `^BOa,b,c,d,e,f,g`",
        "",
        "- Parameters are the same as **^B0** (orientation, magnification, Aztec options).",
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^BP",
    insertText: "^BP${1:o},${2:e},${3:h},${4:f},${5:g}",
    insertTextRules: suggestionSnip,
    kind: 5, // suggestionKind.Class,
    detail: "Plessey Bar Code",
    documentation: {
      value: [
        "**Plessey** — `^BPo,e,h,f,g`",
        "",
        "- **o**: Orientation (`N`,`R`,`I`,`B`)",
        "- **e**: Check digit (`Y`/`N`)",
        "- **h**: Bar height (dots)",
        "- **f**: Print interpretation line (`Y`/`N`)",
        "- **g**: Print interpretation line above (`Y`/`N`)",
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^BQ",
    insertText: "^BQ${1:a},${2:b},${3:c},${4:d},${5:e}",
    insertTextRules: suggestionSnip,
    kind: 5, // suggestionKind.Class,
    detail: "QR Code Bar Code",
    documentation: {
      value: [
        "**QR Code** — `^BQa,b,c,d,e`",
        "",
        "- **a**: Orientation (`N`,`R`,`I`,`B`)",
        "- **b**: **Model** (1 or 2; printers commonly support Model 2)",
        "- **c**: **Magnification** (1–10)",
        "- **d**: **Error correction** (`L`,`M`,`Q`,`H`)",
        "- **e**: **Mask** (0–7, or auto if supported)",
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^BR",
    insertText: "^BR${1:a},${2:b},${3:c},${4:d},${5:e},${6:f}",
    insertTextRules: suggestionSnip,
    kind: 5, // suggestionKind.Class,
    detail: "GS1 Databar",
    documentation: {
      value: [
        "**GS1 DataBar** — `^BRa,b,c,d,e,f`",
        "",
        "- **a–f**: Stacked/omnidirectional/expanded options (row/column, separators, etc.)",
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^BS",
    insertText: "^BS${1:o},${2:h},${3:f},${4:g}",
    insertTextRules: suggestionSnip,
    kind: 5, // suggestionKind.Class,
    detail: "UPC/EAN Extensions",
    documentation: {
      value: [
        "**UPC/EAN Extensions** — `^BSo,h,f,g`",
        "",
        "- **o**: Orientation (`N`,`R`,`I`,`B`)",
        "- **h**: Bar height (dots)",
        "- **f**: Print interpretation line (`Y`/`N`)",
        "- **g**: Print interpretation line above (`Y`/`N`)",
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^BT",
    insertText: "^BT${1:o},${2:w1},${3:r1},${4:h1},${5:w2},${6:h2}",
    insertTextRules: suggestionSnip,
    kind: 5, // suggestionKind.Class,
    detail: "TLC39 Bar Code",
    documentation: {
      value: [
        "**TLC39** — `^BTo,w1,r1,h1,w2,h2`",
        "",
        "- **o**: Orientation (`N`,`R`,`I`,`B`)",
        "- **w1,r1,h1**: Linear component width/ratio/height",
        "- **w2,h2**: 2D component module width/height",
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^BU",
    insertText: "^BU${1:o},${2:h},${3:f},${4:g},${5:e}",
    insertTextRules: suggestionSnip,
    kind: 5, // suggestionKind.Class,
    detail: "UPC-A Bar Code",
    documentation: {
      value: [
        "**UPC-A** — `^BUo,h,f,g,e`",
        "",
        "- **o**: Orientation (`N`,`R`,`I`,`B`)",
        "- **h**: Bar height (dots)",
        "- **f**: Print interpretation line (`Y`/`N`)",
        "- **g**: Print interpretation line above (`Y`/`N`)",
        "- **e**: Print check digit (`Y`/`N`)",
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^BX",
    insertText: "^BX${1:o},${2:h},${3:s},${4:c},${5:r},${6:f},${7:g},${8:a}",
    insertTextRules: suggestionSnip,
    kind: 5, // suggestionKind.Class,
    detail: "Data Matrix Bar Code",
    documentation: {
      value: [
        "**Data Matrix** — `^BXo,h,s,c,r,f,g,a`",
        "",
        "- **o**: Orientation (`N`,`R`,`I`,`B`)",
        "- **h**: **Height** (module magnification)",
        "- **s**: **Quality/ECC** (ECC 200)",
        "- **c**: **Columns**",
        "- **r**: **Rows**",
        "- **f**: **Format** (square/rectangular selection)",
        "- **g**: **Escape** / quiet-zone option",
        "- **a**: **Ratio** / advanced flag",
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^BY",
    insertText: "^BY${1:w},${2:r},${3:h}",
    insertTextRules: suggestionSnip,
    kind: 5, // suggestionKind.Class,
    detail: "Bar Code Field Default",
    documentation: {
      value: [
        "**Bar Code Defaults** — `^BYw,r,h`",
        "",
        "- **w**: Module width (narrow bar width in dots)",
        "- **r**: Wide-to-narrow ratio",
        "- **h**: Default bar height (dots)",
        "",
        "_Affects subsequent ^B* fields until changed._"
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^BZ",
    insertText: "^BZ${1:o},${2:h},${3:f},${4:g},${5:t}",
    insertTextRules: suggestionSnip,
    kind: 5, // suggestionKind.Class,
    detail: "POSTAL Bar Code",
    documentation: {
      value: [
        "**POSTNET/Postal** — `^BZo,h,f,g,t`",
        "",
        "- **o**: Orientation (`N`,`R`,`I`,`B`)",
        "- **h**: Bar height (dots)",
        "- **f**: Print interpretation line (`Y`/`N`)",
        "- **g**: Print interpretation line above (`Y`/`N`)",
        "- **t**: Postal-specific option (e.g., delivery point/DPBC handling)",
      ].join("\n"),
      isTrusted: true
    },

  },


  /* FONT TEXT DATA ********************************************************************************************************/
  {
    label: "^A",
    insertText: "^A${1:font},${2:o},${3:h},${4:w}",
    insertTextRules: suggestionSnip,
    kind: 18, // suggestionKind.Text,
    detail: "Use Scalable/Bitmapped Font",
    documentation: {
      value: [
        "**^A** — `^Afont,o,h,w`",
        "",
        "- **font**: Font letter (`A–Z`, `0–9`)",
        "- **o**: Orientation (`N`,`R`,`I`,`B`)",
        "- **h**: Character height (dots)",
        "- **w**: Character width (dots)",
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "^A@",
    insertText: "^A@${1:o},${2:h},${3:w},${4:device}:${5:font}.${6:ext}",
    insertTextRules: suggestionSnip,
    kind: 18, // suggestionKind.Text,
    detail: "Use Font Name to Call Font",
    documentation: {
      value: [
        "**^A@** — `^A@o,h,w,d:f.x`",
        "",
        "- **o**: Orientation (`N`,`R`,`I`,`B`)",
        "- **h**: Height (dots)",
        "- **w**: Width (dots)",
        "- **d:f.x**: Device and font filename (e.g., `R:MYFONT.TTF`)",
      ].join("\\n"),
      isTrusted: true
    },
    
  },
  {
    label: "^CF",
    insertText: "^CF${1:font},${2:h},${3:w}",
    insertTextRules: suggestionSnip,
    kind: 18, // suggestionKind.Text,
    detail: "Change Alphanumeric Default Font",
    documentation: {
      value: [
        "**^CF** — `^CFfont,h,w`",
        "",
        "- **font**: Default font letter",
        "- **h**: Default height",
        "- **w**: Default width",
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "^CI",
    insertText: "^CI${1:codepage}",
    insertTextRules: suggestionSnip,
    kind: 18, // suggestionKind.Text,
    detail: "Change International Font/Encoding",
    documentation: {
      value: [
        "**^CI** — `^CIn`",
        "",
        "- **n**: International character set / code page (0–30, 28=Unicode)",
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "^CW",
    insertText: "^CW${1:designator},${2:device}:${3:font}",
    insertTextRules: suggestionSnip,
    kind: 18, // suggestionKind.Text,
    detail: "Font Identifier",
    documentation: {
      value: [
        "**^CW** — `^CWd,device:font`",
        "",
        "- **d**: Designator (`A–Z`)",
        "- **device:font**: Font location (`R:MYFONT.FNT` etc.)",
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "^FD",
    insertText: "^FD${1:text}^FS",
    insertTextRules: suggestionSnip,
    kind: 18, // suggestionKind.Text,
    detail: "Field Data",
    documentation: {
      value: [
        "**^FD** — `^FDdata`",
        "",
        "- **data**: Text or data for the field",
        "- Ends with **^FS**",
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "^FH",
    insertText: "^FH${1:mode}",
    insertTextRules: suggestionSnip,
    kind: 18, // suggestionKind.Text,
    detail: "Field Hexadecimal Indicator",
    documentation: {
      value: [
        "**^FH** — `^FHx`",
        "",
        "- **x**: Indicator char (default `_`), signals following two chars are hex",
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "^FL",
    insertText: "^FL${1:command}",
    insertTextRules: suggestionSnip,
    kind: 18, // suggestionKind.Text,
    detail: "Font Linking",
    documentation: {
      value: [
        "**^FL** — `^FLd1,d2`",
        "",
        "- **d1**: Base font",
        "- **d2**: Linked font (used for missing chars)",
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "^FN",
    insertText: "^FN${1:number}",
    insertTextRules: suggestionSnip,
    kind: 18, // suggestionKind.Text,
    detail: "Field Number",
    documentation: {
      value: [
        "**^FN** — `^FNn`",
        "",
        "- **n**: Field number (used with variable data downloads)",
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "^FO",
    insertText: "^FO${1:x},${2:y}",
    insertTextRules: suggestionSnip,
    kind: 18, // suggestionKind.Text,
    detail: "Field Origin",
    documentation: {
      value: [
        "**^FO** — `^FOx,y`",
        "",
        "- **x**: X-position (dots from left)",
        "- **y**: Y-position (dots from top)",
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "^FR",
    insertText: "^FR",
    insertTextRules: suggestionSnip,
    kind: 18, // suggestionKind.Text,
    detail: "Field Reverse Print",
    documentation: {
      value: [
        "**^FR** — Reverses printing (white on black)",
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "^FS",
    insertText: "^FS",
    insertTextRules: suggestionSnip,
    kind: 18, // suggestionKind.Text,
    detail: "Field Separator",
    documentation: {
      value: [
        "**^FS** — Field terminator (ends current field definition)",
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "^FT",
    insertText: "^FT${1:x},${2:y},${3:a}",
    insertTextRules: suggestionSnip,
    kind: 18, // suggestionKind.Text,
    detail: "Field Typeset",
    documentation: {
      value: [
        "**^FT** — `^FTx,y,a`",
        "",
        "- **x**: X-position",
        "- **y**: Baseline Y-position",
        "- **a**: Field origin justification (`N`=normal, `R`=right, `C`=center)",
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "^FV",
    insertText: "^FV${1:var}^FS",
    insertTextRules: suggestionSnip,
    kind: 18, // suggestionKind.Text,
    detail: "Field Variable",
    documentation: {
      value: [
        "**^FV** — `^FVvariable`",
        "",
        "- Used with field number (^FN)",
        "- Ends with **^FS**",
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "^FW",
    insertText: "^FW${1:o}",
    insertTextRules: suggestionSnip,
    kind: 18, // suggestionKind.Text,
    detail: "Field Orientation",
    documentation: {
      value: [
        "**^FW** — `^FWo`",
        "",
        "- **o**: Orientation for all following fields (`N`,`R`,`I`,`B`)",
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "^FX",
    insertText: "^FX ${1:comment}",
    insertTextRules: suggestionSnip,
    kind: 18, // suggestionKind.Text,
    detail: "Comment",
    documentation: {
      value: [
        "**^FX** — Comment line",
        "",
        "- Ignored by printer",
        "- Useful for label notes/documentation",
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "^PA",
    insertText: "^PA${1:params}",
    insertTextRules: suggestionSnip,
    kind: 18, // suggestionKind.Text,
    detail: "Advanced Text Properties",
    documentation: {
      value: [
        "**^PA** — Advanced text properties (printer-dependent)",
        "",
        "- Controls spacing, proportional width, etc.",
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "^TB",
    insertText: "^TB${1:o},${2:maxWidth},${3:maxHeight}",
    insertTextRules: suggestionSnip,
    kind: 18, // suggestionKind.Text,
    detail: "Text Blocks",
    documentation: {
      value: [
        "**^TB** — `^TBo,maxWidth,maxHeight`",
        "",
        "- **o**: Orientation (`N`,`R`,`I`,`B`; default follows last ^A/^FW)",
        "- **maxWidth**: Block width (dots)",
        "- **maxHeight**: Block height (dots; text truncates if exceeded)",
      ].join("\\n"),
      isTrusted: true
    },
    
  },



  /* FONT TEXT DATA ********************************************************************************************************/
  {
    label: "^XA",
    insertText: "^XA",
    insertTextRules: suggestionSnip,
    kind: 6, //suggestionKind.Struct,
    detail: "Start Format",
    documentation: {
      value: [
        "**^XA** — Start label format.",
        "",
        "Begins a new label format. Pair with **^XZ** to end."
      ].join("\n"),
      isTrusted: true
    },
  },
  {
    label: "^XB",
    insertText: "^XB",
    insertTextRules: suggestionSnip,
    kind: 6, //suggestionKind.Struct,
    detail: "Suppress Forward Feed / Backfeed",
    documentation: {
      value: [
        "**^XB** — Suppress forward feed (and backfeed).",
        "",
        "Prevents the normal forward feed to tear-off between labels; as a result, the backfeed step is also avoided. No parameters; behavior depends on print mode/firmware."
      ].join("\\n"),
      isTrusted: true
    },
  },
  {
    label: "^XF",
    insertText: "^XF${1:device}:${2:FORMAT}.ZPL^FS",
    insertTextRules: suggestionSnip,
    kind: 6, //suggestionKind.Struct,
    detail: "Recall Format",
    documentation: {
      value: [
        "**^XF** — Recall stored format: `^XFdevice:format.zpl^FS`",
        "",
        "- **device**: Storage device (`R:`, `E:`, `B:` etc.)",
        "- **format**: Filename (e.g., `FORMAT` → `FORMAT.ZPL`)",
        "",
        "Recalls a previously stored format (often with **^FN** placeholders). Use **^FS** to terminate the field."
      ].join("\\n"),
      isTrusted: true
    },
  },
  {
    label: "^XS",
    insertText: "^XS${1:length},${2:threshold}",
    insertTextRules: suggestionSnip,
    kind: 6, //suggestionKind.Struct,
    detail: "Dynamic Media Calibration",
    documentation: {
      value: [
        "**^XS** — `^XSlength,threshold`",
        "",
        "- **length**: Max expected label length for dynamic calibration",
        "- **threshold**: Sensor threshold for label-to-label compensation",
        "",
        "Controls on-printer dynamic media calibration; values are model/firmware dependent."
      ].join("\\n"),
      isTrusted: true
    },
  },
  {
    label: "^XZ",
    insertText: "^XZ",
    insertTextRules: suggestionSnip,
    kind: 6, //suggestionKind.Struct,
    detail: "End Format",
    documentation: {
      value: [
        "**^XZ** — End label format.",
        "",
        "Terminates the current format started with **^XA** and sends it to print."
      ].join("\n"),
      isTrusted: true
    },
  },
  {
    label: "^ZZ",
    insertText: "^ZZ${1:seconds},${2:immediate}",
    insertTextRules: suggestionSnip,
    kind: 6, //suggestionKind.Struct,
    detail: "Printer Sleep",
    documentation: {
      value: [
        "**^ZZ** — `^ZZt,b`",
        "",
        "- **t**: Seconds of idle time before sleep (0 disables)",
        "- **b**: Label status at shutdown (`Y` = sleep even if labels queued, `N` = finish queued labels first)",
        "",
        "Model-dependent support; not all printers implement this command."
      ].join("\\n"),
      isTrusted: true
    },
  },


  /* PRINTER CONTROL & CONFIGURATION ****************************************************************************************/
  {
    label: "^CC",
    insertText: "^CC${1:c}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Change Caret",
    documentation: {
      value: [
        "**^CC** — Change the caret command prefix.",
        "",
        "- **c**: New caret character (default `^`)."
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "~CC",
    insertText: "~CC${1:c}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Change Caret (immediate)",
    documentation: {
      value: [
        "**~CC** — Immediate change of caret prefix.",
        "",
        "- **c**: New caret character."
      ].join("\n"),
      isTrusted: true
    },
    
  },

  {
    label: "^CD",
    insertText: "^CD${1:c}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Change Delimiter",
    documentation: {
      value: [
        "**^CD** — Change parameter delimiter.",
        "",
        "- **c**: New delimiter (default `,`)."
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "~CD",
    insertText: "~CD${1:c}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Change Delimiter (immediate)",
    documentation: {
      value: [
        "**~CD** — Immediate change of parameter delimiter.",
        "",
        "- **c**: New delimiter."
      ].join("\n"),
      isTrusted: true
    },
    
  },

  {
    label: "^CT",
    insertText: "^CT${1:c}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Change Tilde",
    documentation: {
      value: [
        "**^CT** — Set alternate command prefix (tilde).",
        "",
        "- **c**: New tilde character (default `~`)."
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "~CT",
    insertText: "~CT${1:c}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Change Tilde (immediate)",
    documentation: {
      value: [
        "**~CT** — Immediate change of tilde prefix.",
        "",
        "- **c**: New tilde character."
      ].join("\n"),
      isTrusted: true
    },
    
  },

  {
    label: "^CV",
    insertText: "^CV${1:Y}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Code Validation",
    documentation: {
      value: [
        "**^CV** — `^CVa`",
        "",
        "- **a**: Enable code validation (`Y`=on, `N`=off). Validates barcode data (charset, check digit, too long/short, bad params).",
        "",
        "_Verifies **data**, not print/scan image integrity._"
      ].join("\n"),
      isTrusted: true
    },
    
  },

  {
    label: "~JA",
    insertText: "~JA",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Cancel All",
    documentation: {
      value: [
        "**~JA** — Cancel all formats/printing (immediate)."
      ].join("\n"),
      isTrusted: true
    },
    
  },

  {
    label: "^JB",
    insertText: "^JB",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Initialize/Reset Memory",
    documentation: {
      value: [
        "**^JB** — Initialize/clear memory (format-dependent)."
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "~JB",
    insertText: "~JB",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Initialize/Reset Memory (immediate)",
    documentation: {
      value: [
        "**~JB** — Immediate initialize/reset of memory."
      ].join("\n"),
      isTrusted: true
    },
    
  },

  {
    label: "~JC",
    insertText: "~JC",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Set Media Sensor Calibration",
    documentation: {
      value: [
        "**~JC** — Initiate media sensor calibration (immediate)."
      ].join("\n"),
      isTrusted: true
    },
    
  },

  {
    label: "~JD",
    insertText: "~JD",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Enable Diagnostics",
    documentation: {
      value: [
        "**~JD** — Enable diagnostic/test output."
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "~JE",
    insertText: "~JE",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Disable Diagnostics",
    documentation: {
      value: [
        "**~JE** — Disable diagnostic/test output."
      ].join("\n"),
      isTrusted: true
    },
    
  },

  {
    label: "^JM",
    insertText: "^JM${1:A}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Set Dots per Millimeter (Scale)",
    documentation: {
      value: [
        "**^JM** — `^JMn`",
        "",
        "- **A**: Normal DPMM (e.g., 12/8/6) — standard density",
        "- **B**: Halved DPMM (e.g., 6/4/3) — doubles label format size",
        "",
        "_Send before first **^FS**; persists until changed._"
      ].join("\n"),
      isTrusted: true
    },
    
  },

  // Various printer/journal/sensor/test (^J*)
  { label: "^JH", insertText: "^JH", insertTextRules: suggestionSnip, kind: 10, /* suggestionKind.Event, */ detail: "Printer/Journal Command", documentation: { value: "**^JH** — Printer/journal/status command.", isTrusted: true } },
  { label: "^JI", insertText: "^JI", insertTextRules: suggestionSnip, kind: 10, /* suggestionKind.Event, */ detail: "Printer/Journal Command", documentation: { value: "**^JI** — Printer/journal/status command.", isTrusted: true } },
  { label: "^JJ", insertText: "^JJ", insertTextRules: suggestionSnip, kind: 10, /* suggestionKind.Event, */ detail: "Printer/Journal Command", documentation: { value: "**^JJ** — Printer/journal/status command.", isTrusted: true } },
  { label: "~JK", insertText: "~JK", insertTextRules: suggestionSnip, kind: 10, /* suggestionKind.Event, */ detail: "Printer/Journal Command", documentation: { value: "**~JK** — Printer/journal/status command (immediate).", isTrusted: true } },
  { label: "~JL", insertText: "~JL", insertTextRules: suggestionSnip, kind: 10, /* suggestionKind.Event, */ detail: "Printer/Journal Command", documentation: { value: "**~JL** — Printer/journal/status command (immediate).", isTrusted: true } },
  { label: "^JS", insertText: "^JS", insertTextRules: suggestionSnip, kind: 10, /* suggestionKind.Event, */ detail: "Sensor/Test Command", documentation: { value: "**^JS** — Sensor/test command.", isTrusted: true } },
  { label: "~JS", insertText: "~JS", insertTextRules: suggestionSnip, kind: 10, /* suggestionKind.Event, */ detail: "Sensor/Test Command (immediate)", documentation: { value: "**~JS** — Sensor/test command (immediate).", isTrusted: true } },
  { label: "^JT", insertText: "^JT", insertTextRules: suggestionSnip, kind: 10, /* suggestionKind.Event, */ detail: "Test/Journal Command", documentation: { value: "**^JT** — Test/journal command.", isTrusted: true } },
  { label: "^JU", insertText: "^JU", insertTextRules: suggestionSnip, kind: 10, /* suggestionKind.Event, */ detail: "Test/Journal Command", documentation: { value: "**^JU** — Test/journal command.", isTrusted: true } },
  { label: "^JW", insertText: "^JW", insertTextRules: suggestionSnip, kind: 10, /* suggestionKind.Event, */ detail: "Test/Journal Command", documentation: { value: "**^JW** — Test/journal command.", isTrusted: true } },
  { label: "~JX", insertText: "~JX", insertTextRules: suggestionSnip, kind: 10, /* suggestionKind.Event, */ detail: "Test/Journal Command", documentation: { value: "**~JX** — Test/journal command (immediate).", isTrusted: true } },
  { label: "^JZ", insertText: "^JZ", insertTextRules: suggestionSnip, kind: 10, /* suggestionKind.Event, */ detail: "Test/Journal Command", documentation: { value: "**^JZ** — Test/journal command.", isTrusted: true } },

  // KD/KL/KN/KP
  {
    label: "^KD",
    insertText: "^KD${1:value}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Set Date/Time",
    documentation: {
      value: [
        "**^KD** — Set RTC date/time.",
        "",
        "- **value**: Date/time payload (printer-specific format)."
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "^KL",
    insertText: "^KL${1:language}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Set Language",
    documentation: {
      value: [
        "**^KL** — Set language.",
        "",
        "- **language**: Language code (printer-dependent)."
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "^KN",
    insertText: "^KN${1:name}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Set Name",
    documentation: {
      value: [
        "**^KN** — Set device/printer name.",
        "",
        "- **name**: New name."
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "^KP",
    insertText: "^KP${1:password}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Set Password",
    documentation: {
      value: [
        "**^KP** — Set password.",
        "",
        "- **password**: New password string."
      ].join("\n"),
      isTrusted: true
    },
    
  },

  {
    label: "^KV",
    insertText: "^KV${1:params}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Kiosk Values",
    documentation: {
      value: [
        "**^KV** — Kiosk configuration values.",
        "",
        "- **params**: Printer/firmware-dependent options."
      ].join("\n"),
      isTrusted: true
    },
    
  },

  { label: "^MA", insertText: "^MA${1:mode}", insertTextRules: suggestionSnip, kind: 10, /* suggestionKind.Event, */ detail: "Maintenance Alerts", documentation: { value: ["**^MA** — Maintenance alerts.", "", "- **mode**: Enable/disable/configure."].join("\n"), isTrusted: true } },
  { label: "^MI", insertText: "^MI${1:msg}", insertTextRules: suggestionSnip, kind: 10, /* suggestionKind.Event, */ detail: "Info Message", documentation: { value: ["**^MI** — Show/print info message.", "", "- **msg**: Message or code."].join("\n"), isTrusted: true } },

  {
    label: "^MD",
    insertText: "^MD${1:n}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Media Darkness",
    documentation: {
      value: [
        "**^MD** — Set print darkness.",
        "",
        "- **n**: Darkness level (range depends on printer)."
      ].join("\n"),
      isTrusted: true
    },
    
  },

  {
    label: "^MF",
    insertText: "^MF${1:p},${2:h}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Media Feed (Power-Up / Head-Close Action)",
    documentation: {
      value: [
        "**^MF** — `^MFp,h`",
        "",
        "- **p**: Power-up action",
        "- **h**: Head-close action",
        "",
        "_Controls calibration/feed behavior at power-up and after head-close._"
      ].join("\n"),
      isTrusted: true
    },
    
  },

  {
    label: "^ML",
    insertText: "^ML${1:length}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Maximum Label Length",
    documentation: {
      value: [
        "**^ML** — Set maximum label length.",
        "",
        "- **length**: Dots."
      ].join("\n"),
      isTrusted: true
    },
    
  },

  {
    label: "^MM",
    insertText: "^MM${1:mode},${2:opt}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Print Mode",
    documentation: {
      value: [
        "**^MM** — `^MMa,b`",
        "",
        "- **a**: Mode (`T`=Tear-off, `P`=Peel-off, `R`=Rewind, `C`=Cutter …)",
        "- **b**: Option (model-specific)",
        "",
        "_Selects how media is handled after printing._"
      ].join("\n"),
      isTrusted: true
    },
    
  },

  {
    label: "^MN",
    insertText: "^MN${1:mode}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Media Tracking",
    documentation: {
      value: [
        "**^MN** — Media tracking method.",
        "",
        "- **mode**: Web/Mark/Continuous (printer-dependent)."
      ].join("\n"),
      isTrusted: true
    },
    
  },

  {
    label: "^MP",
    insertText: "^MP${1:state}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Mode Protection",
    documentation: {
      value: [
        "**^MP** — Protect/lock printer modes.",
        "",
        "- **state**: Enable/disable/level."
      ].join("\n"),
      isTrusted: true
    },
    
  },

  {
    label: "^MT",
    insertText: "^MT${1:type}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Media Type",
    documentation: {
      value: [
        "**^MT** — Select media type.",
        "",
        "- **type**: Direct/Thermal/etc. (printer-dependent)."
      ].join("\n"),
      isTrusted: true
    },
    
  },

  {
    label: "^MU",
    insertText: "^MU${1:a},${2:b},${3:c}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Units of Measurement",
    documentation: {
      value: [
        "**^MU** — `^MUa,b,c`",
        "",
        "- **a/b/c**: Measurement unit selections (Dots / Inches / Millimeters — printer-dependent).",
        "",
        "_Affects commands with distance/size parameters._"
      ].join("\n"),
      isTrusted: true
    },
    
  },

  {
    label: "^MW",
    insertText: "^MW${1:threshold}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Head Cold Warning",
    documentation: {
      value: [
        "**^MW** — Printhead cold warning threshold.",
        "",
        "- **threshold**: Temperature/level (printer-dependent)."
      ].join("\n"),
      isTrusted: true
    },
    
  },

  // Networking & IP config
  {
    label: "^NC",
    insertText: "^NC${1:a}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Select Primary Network Device",
    documentation: {
      value: [
        "**^NC** — `^NCa`",
        "",
        "- **a**: Network device selection (printer-dependent).",
        "",
        "_Selects the active/primary network interface._"
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "~NC",
    insertText: "~NC${1:nnn}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Network Connect",
    documentation: {
      value: [
        "**~NC** — `~NC###`",
        "",
        "- **###**: Network ID/target (implementation-dependent).",
        "",
        "_Connects the printer to a network target by ID._"
      ].join("\n"),
      isTrusted: true
    },
    
  },
  { label: "^ND", insertText: "^ND${1:params}", insertTextRules: suggestionSnip, kind: 10, /* suggestionKind.Event, */ detail: "Network (DNS/Display)", documentation: { value: ["**^ND** — Network/DNS or display info (model-specific).", "", "- **params**: Printer-dependent."].join("\n"), isTrusted: true } },
  {
    label: "^NI",
    insertText: "^NI${1:id}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Network ID Number",
    documentation: {
      value: [
        "**^NI** — `^NI###`",
        "",
        "- **###**: Printer’s network ID number (not IP).",
        "",
        "_Used with legacy ZNet/RS-485 style networking._"
      ].join("\n"),
      isTrusted: true
    },
    
  },
  { label: "^NS", insertText: "^NS${1:params}", insertTextRules: suggestionSnip, kind: 10, /* suggestionKind.Event, */ detail: "Network Settings", documentation: { value: ["**^NS** — Additional network settings.", "", "- **params**: Printer-dependent."].join("\n"), isTrusted: true } },
  { label: "~NR", insertText: "~NR", insertTextRules: suggestionSnip, kind: 10, /* suggestionKind.Event, */ detail: "Network Reset", documentation: { value: ["**~NR** — Reset network interface (immediate)."].join("\n"), isTrusted: true } },
  { label: "~NT", insertText: "~NT", insertTextRules: suggestionSnip, kind: 10, /* suggestionKind.Event, */ detail: "Network Test", documentation: { value: ["**~NT** — Network test/diagnostic (immediate)."].join("\n"), isTrusted: true } },

  // Slew / present / mirror / pause / quantity / rate
  { label: "^PH", insertText: "^PH", insertTextRules: suggestionSnip, kind: 10, /* suggestionKind.Event, */ detail: "Slew to Home Position", documentation: { value: ["**^PH** — Slew to home position."].join("\n"), isTrusted: true } },
  { label: "~PH", insertText: "~PH", insertTextRules: suggestionSnip, kind: 10, /* suggestionKind.Event, */ detail: "Slew to Home (immediate)", documentation: { value: ["**~PH** — Immediate slew to home position."].join("\n"), isTrusted: true } },

  { label: "~PL", insertText: "~PL${1:dots}", insertTextRules: suggestionSnip, kind: 10, /* suggestionKind.Event, */ detail: "Present Length Addition", documentation: { value: ["**~PL** — Adjust present length.", "", "- **dots**: Additional length in dots."].join("\n"), isTrusted: true } },

  { label: "^PM", insertText: "^PM${1:mode}", insertTextRules: suggestionSnip, kind: 10, /* suggestionKind.Event, */ detail: "Print Mirror Image", documentation: { value: ["**^PM** — Mirror printing.", "", "- **mode**: `Y`/`N` (printer-dependent)."].join("\n"), isTrusted: true } },

  {
    label: "^PN",
    insertText: "^PN${1:n}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Present Now",
    documentation: {
      value: [
        "**^PN** — `^PNn`",
        "",
        "- **n**: Presenter cycle – amount of media to eject (printer/presenter-dependent).",
        "",
        "_Runs a presenter cycle; total eject = **present length addition** + **n**._"
      ].join("\n"),
      isTrusted: true
    },
    
  },

  { label: "^PP", insertText: "^PP${1:ms}", insertTextRules: suggestionSnip, kind: 10, /* suggestionKind.Event, */ detail: "Programmable Pause", documentation: { value: ["**^PP** — Pause for specified time.", "", "- **ms**: Milliseconds."].join("\n"), isTrusted: true } },
  { label: "~PP", insertText: "~PP${1:ms}", insertTextRules: suggestionSnip, kind: 10, /* suggestionKind.Event, */ detail: "Programmable Pause (immediate)", documentation: { value: ["**~PP** — Immediate pause.", "", "- **ms**: Milliseconds."].join("\n"), isTrusted: true } },

  {
    label: "^PQ",
    insertText: "^PQ${1:q},${2:p},${3:r},${4:o},${5:e}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Print Quantity",
    documentation: {
      value: [
        "**^PQ** — `^PQq,p,r,o,e`",
        "",
        "- **q**: Total labels to print",
        "- **p**: Labels between pauses (a.k.a. pause/cut value)",
        "- **r**: Replicates of each serial number",
        "- **o**: Override pause (`Y/N`)",
        "- **e**: Enable reprint on error (`Y/N`)",
        "",
        "_Controls batch size, pausing, and serial replication._"
      ].join("\n"),
      isTrusted: true
    },
    
  },

  { label: "^PR", insertText: "^PR${1:ips}", insertTextRules: suggestionSnip, kind: 10, /* suggestionKind.Event, */ detail: "Print Rate", documentation: { value: ["**^PR** — Set print speed.", "", "- **ips**: Inches per second (or printer units)."].join("\n"), isTrusted: true } },
  {
    label: "^PR",
    insertText: "^PR${1:p},${2:s},${3:b}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Print Rate",
    documentation: {
      value: [
        "**^PR** — `^PRp,s,b`",
        "",
        "- **p**: Print speed (ips/mm/s depending on model)",
        "- **s**: Slew speed (blank-feed speed)",
        "- **b**: Backfeed speed",
        "",
        "_Controls media, slew, and backfeed speeds during printing._"
      ].join("\n"),
      isTrusted: true
    },
    
  },
  { label: "~PS", insertText: "~PS", insertTextRules: suggestionSnip, kind: 10, /* suggestionKind.Event, */ detail: "Print Start", documentation: { value: ["**~PS** — Start/continue printing (immediate)."].join("\n"), isTrusted: true } },

  {
    label: "~RO",
    insertText: "~RO${1:c}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Reset Advanced Counters",
    documentation: {
      value: [
        "**~RO** — `~ROc`",
        "",
        "- **c**: Counter number (`1` or `2`).",
        "",
        "_Resets printer’s distance/labels counters._"
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "^SC",
    insertText: "^SC${1:baud},${2:parity},${3:data_bits},${4:stop_bits},${5:flow},${6:proto}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Serial Communications",
    documentation: {
      value: [
        "**^SC** — `^SCa,b,c,d,e,f`",
        "",
        "- **a**: Baud rate",
        "- **b**: Parity (`N`,`E`,`O`)",
        "- **c**: Data bits (7/8)",
        "- **d**: Stop bits (1/2)",
        "- **e**: Handshake/flow (`X`=XON/XOFF, `D`=DTR/DSR, `R`=RTS)",
        "- **f**: Protocol (`A`=ACK/NAK, `N`=None, `Z`=Zebra)",
        "",
        "_Use **^JUS** to save settings persistently._"
      ].join("\n"),
      isTrusted: true
    },
    
  },

  { label: "~SD", insertText: "~SD${1:n}", insertTextRules: suggestionSnip, kind: 10, /* suggestionKind.Event, */ detail: "Set Darkness", documentation: { value: ["**~SD** — Set print darkness (immediate).", "", "- **n**: Darkness level."].join("\n"), isTrusted: true } },

  { label: "^SE", insertText: "^SE${1:table}", insertTextRules: suggestionSnip, kind: 10, /* suggestionKind.Event, */ detail: "Encoding Table", documentation: { value: ["**^SE** — Select encoding/translation table.", "", "- **table**: Table identifier (printer-dependent)."].join("\n"), isTrusted: true } },

  {
    label: "^SI",
    insertText: "^SI${1:setting},${2:value}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Set Sensor Intensity",
    documentation: {
      value: [
        "**^SI** — `^SIa,b`",
        "",
        "- **a**: Sensor type (integer ID)",
        "- **b**: Intensity value (0–100)",
        "",
        "_Adjusts the intensity of media sensors (e.g., media, web, ribbon)._"
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "^SL",
    insertText: "^SL${1:mode},${2:language}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Set RTC Mode and Language",
    documentation: {
      value: [
        "**^SL** — `^SLa,b`",
        "",
        "- **a**: Mode (`S`=Start Time, `T`=Time Now, or numeric tolerance)",
        "- **b**: Language code (1=English, 2=Spanish, … 18=Polish)",
        "",
        "_Specifies how and in what language the Real Time Clock time prints._"
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "^SN",
    insertText: "^SN${1:start},${2:increment},${3:pad}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Serialization Data",
    documentation: {
      value: [
        "**^SN** — `^SNv,n,z`",
        "",
        "- **v**: Start value for serialization",
        "- **n**: Increment value",
        "- **z**: Padding value for serial (e.g., leading zeros)",
        "",
        "_Generates serialized data fields (e.g. sequential barcodes)._"
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "^SO",
    insertText: "^SO${1:sec},${2:months},${3:days},${4:years},${5:hours},${6:minutes},${7:seconds}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Set RTC Offset",
    documentation: {
      value: [
        "**^SO** — `^SOa,b,c,d,e,f,g`",
        "",
        "- **a–g**: Offset values for time fields: seconds, months, days, years, hours, minutes, seconds",
        "",
        "_Applies offsets to the Real Time Clock’s output._"
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "^SP",
    insertText: "^SP${1:dotRow}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Start Print",
    documentation: {
      value: [
        "**^SP** — `^SP#`",
        "",
        "- **#**: Dot row at which to begin printing",
        "",
        "_Delays print until the current format reaches this vertical position._"
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "^SQ",
    insertText: "^SQ${1:condition},${2:destination},${3:stop}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Halt ZebraNet Alert",
    documentation: {
      value: [
        "**^SQ** — `^SQa,b,c`",
        "",
        "- **a**: Alert condition",
        "- **b**: Destination (e.g., host)",
        "- **c**: Stop flag (`Y`/`N`)",
        "",
        "_Stops an ongoing ZebraNet alert under given conditions._"
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "^SR",
    insertText: "^SR${1:ohms}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Set Printhead Resistance",
    documentation: {
      value: [
        "**^SR** — `^SR####`",
        "",
        "- **####**: Resistance value in ohms (e.g., `0488–1175`)",
        "",
        "_Sets the printhead resistance—must not exceed printhead spec._"
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "^SS",
    insertText: "^SS${1:web},${2:media},${3:ribbon},${4:labelLength},${5:mediaLED},${6:ribbonLED},${7:markSense},${8:markMediaSense},${9:markLEDSense}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Set Media Sensors",
    documentation: {
      value: [
        "**^SS** — `^SSw,m,r,l,m2,r2,a,b,c`",
        "",
        "- **w**: Web sensor value (0–100)",
        "- **m**: Media sensor",
        "- **r**: Ribbon sensor",
        "- **l**: Label length (dots)",
        "- **m2**/**r2**: Media/Ribbon LED intensity",
        "- **a**/**b**/**c**: Mark sensing thresholds",
        "",
        "_Overrides calibration values for sensors._"
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "^ST",
    insertText: "^ST${1:month},${2:day},${3:year},${4:hour},${5:minute},${6:second},${7:format}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Set Date and Time (RTC)",
    documentation: {
      value: [
        "**^ST** — `^STa,b,c,d,e,f,g`",
        "",
        "- **a–f**: Month, day, year, hour, minute, second",
        "- **g**: Time format option (printer-dependent)",
        "",
        "_Sets the Real Time Clock’s current date/time._"
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "^SX",
    insertText: "^SX${1:condition},${2:destination},${3:set},${4:clear},${5:setting},${6:port}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "ZebraNet Alert",
    documentation: {
      value: [
        "**^SX** — `^SXa,b,c,d,e,f`",
        "",
        "- **a**: Alert condition",
        "- **b**: Destination",
        "- **c**: Set flag",
        "- **d**: Clear flag",
        "- **e**: Alert setting",
        "- **f**: Port ID",
        "",
        "_Triggers a ZebraNet alert message under defined conditions._"
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "^SZ",
    insertText: "^SZ${1:mode}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Set ZPL Mode",
    documentation: {
      value: [
        "**^SZ** — `^SZa`",
        "",
        "- **a**: `1`=ZPL, `2`=ZPL II",
        "",
        "_Switches the printer programming language mode._"
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "~TA",
    insertText: "~TA${1:position}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Tear-Off Adjust",
    documentation: {
      value: [
        "**~TA** — `~TA###`",
        "",
        "- **###**: Tear-off adjust in dots (positive/negative)",
        "",
        "_Adjusts media position relative to the tear-off bar._"
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "~WC",
    insertText: "~WC",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Print Configuration Label",
    documentation: {
      value: [
        "**~WC** — Print configuration label.",
        "",
        "_Prints a label containing printer configuration, sensor profiles, and firmware info._"
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "^WD",
    insertText: "^WD${1:device}:${2:filter}.${3:ext}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Print Directory Label",
    documentation: {
      value: [
        "**^WD** — `^WDd:o.x`",
        "",
        "- **d:o.x**: Device and mask (e.g., `R:*.GRF`)",
        "",
        "_Prints a label listing objects (e.g., graphics, formats) stored on the device._"
      ].join("\n"),
      isTrusted: true
    },
    
  },
  {
    label: "~WQ",
    insertText: "~WQ${1:queryType}",
    insertTextRules: suggestionSnip,
    kind: 10, /* suggestionKind.Event, */
    detail: "Write Query",
    documentation: {
      value: [
        "**~WQ** — `~WQq`",
        "",
        "- **q**: Query type (printer-specific)",
        "",
        "_Writes a query to the printer (used for diagnostics or commands)._"
      ].join("\n"),
      isTrusted: true
    },
    
  },


  /* PRINTER CONTROL & CONFIGURATION ****************************************************************************************/
  {
    label: "^FB",
    insertText: "^FB${1:w},${2:l},${3:s},${4:j},${5:h}",
    insertTextRules: suggestionSnip,
    kind: 25, /* suggestionKind.User, */
    detail: "Field Block",
    documentation: {
      value: [
        "**^FB** — `^FBw,l,s,j,h`",
        "",
        "- **w**: Block width (dots)",
        "- **l**: Maximum lines",
        "- **s**: Line spacing (dots)",
        "- **j**: Justification (`L`,`C`,`R`,`J`)",
        "- **h**: Hanging indent (dots)"
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^FC",
    insertText: "^FC${1:primary},${2:secondary},${3:tertiary}",
    insertTextRules: suggestionSnip,
    kind: 25, /* suggestionKind.User, */
    detail: "Field Clock",
    documentation: {
      value: [
        "**^FC** — `^FCa,b,c`",
        "",
        "- **a**: Primary clock indicator (delimiter char)",
        "- **b**: Secondary clock indicator",
        "- **c**: Tertiary clock indicator",
        "",
        "_Sets clock delimiters (and clock mode usage) for Real-Time Clock fields._"
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^FP",
    insertText: "^FP${1:d},${2:g}",
    insertTextRules: suggestionSnip,
    kind: 25, /* suggestionKind.User, */
    detail: "Field Parameter (vertical/reverse text)",
    documentation: {
      value: [
        "**^FP** — `^FPd,g`",
        "",
        "- **d**: Direction (`H`=horizontal, `V`=vertical, `R`=reverse/right-to-left)",
        "- **g**: Additional inter-character gap (dots, `0–9999`)",
        "",
        "_Used for vertical & right-to-left scripts; affects ^A/^FT output._"
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^HF",
    insertText: "^HF${1:device}:${2:format}.${3:ext}",
    insertTextRules: suggestionSnip,
    kind: 25, /* suggestionKind.User, */
    detail: "Host Format Return",
    documentation: {
      value: [
        "**^HF** — `^HFd:o.x`",
        "",
        "- **d**: Device (`R:`, `E:`, `B:`, `A:`)",
        "- **o**: Object (format name)",
        "- **x**: Extension (usually `ZPL`)",
        "",
        "_Returns a stored ZPL format’s contents to the host (e.g., `^HFB:FORMAT.ZPL`)._"
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^HG",
    insertText: "^HG${1:device}:${2:graphic}.${3:ext}",
    insertTextRules: suggestionSnip,
    kind: 25, /* suggestionKind.User, */
    detail: "Host Graphic Return",
    documentation: {
      value: [
        "**^HG** — `^HGd:o.x`",
        "",
        "- **d**: Device (`R:`, `E:`, `B:`, `A:`)",
        "- **o**: Object (graphic name)",
        "- **x**: Extension (e.g., `GRF`, `PNG` – model dependent)",
        "",
        "_Uploads a stored graphic to the host._"
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^HW",
    insertText: "^HW${1:device}:${2:pattern}.${3:ext}",
    insertTextRules: suggestionSnip,
    kind: 25, /* suggestionKind.User, */
    detail: "Host Directory List",
    documentation: {
      value: [
        "**^HW** — `^HWd:o.x`",
        "",
        "- **d**: Device to list (`R:`, `E:`, `Z:`, …)",
        "- **o**: Object filter (name or `*`/`?` wildcards)",
        "- **x**: Extension filter (e.g., `ZPL`, `GRF`, or `*`)",
        "",
        "_Returns a formatted directory listing to the host (e.g., `^HWE:*.ZPL`)._"
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^HY",
    insertText: "^HY${1:device}:${2:object}.${3:ext}",
    insertTextRules: suggestionSnip,
    kind: 25, /* suggestionKind.User, */
    detail: "Upload Graphics",
    documentation: {
      value: [
        "**^HY** — `^HYd:o.x`",
        "",
        "- **d**: Device (`R:`, `E:`, `B:`, `A:`)",
        "- **o**: Object name",
        "- **x**: Extension/format",
        "",
        "_Uploads graphic objects from the printer to the host (extended ^HG)._"
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^LH",
    insertText: "^LH${1:x},${2:y}",
    insertTextRules: suggestionSnip,
    kind: 25, /* suggestionKind.User, */
    detail: "Label Home",
    documentation: {
      value: [
        "**^LH** — `^LHx,y`",
        "",
        "- **x**: X offset (dots from left edge)",
        "- **y**: Y offset (dots from top edge)",
        "",
        "Sets origin for all `^FO`/`^FT` positions."
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^LL",
    insertText: "^LL${1:length}",
    insertTextRules: suggestionSnip,
    kind: 25, /* suggestionKind.User, */
    detail: "Label Length",
    documentation: {
      value: [
        "**^LL** — `^LLn`",
        "",
        "- **n**: Label length in dots",
        "",
        "Defines printable label length."
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^LR",
    insertText: "^LR${1:m}",
    insertTextRules: suggestionSnip,
    kind: 25, /* suggestionKind.User, */
    detail: "Label Reverse Print",
    documentation: {
      value: [
        "**^LR** — `^LRm`",
        "",
        "- **m**: Mode (`N`=normal, `Y`=reverse entire label)",
        "",
        "Reverses label colors (black <-> white)."
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^LS",
    insertText: "^LS${1:x}",
    insertTextRules: suggestionSnip,
    kind: 25, /* suggestionKind.User, */
    detail: "Label Shift",
    documentation: {
      value: [
        "**^LS** — `^LSx`",
        "",
        "- **x**: Horizontal shift in dots (+/-)",
        "",
        "Moves entire label horizontally."
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^LT",
    insertText: "^LT${1:y}",
    insertTextRules: suggestionSnip,
    kind: 25, /* suggestionKind.User, */
    detail: "Label Top",
    documentation: {
      value: [
        "**^LT** — `^LTy`",
        "",
        "- **y**: Top margin offset in dots (positive=down, negative=up)"
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^PO",
    insertText: "^PO${1:a}",
    insertTextRules: suggestionSnip,
    kind: 25, /* suggestionKind.User, */
    detail: "Print Orientation (invert label 180°)",
    documentation: {
      value: [
        "**^PO** — `^POa`",
        "",
        "- **a**: `N` (normal) | `I` (invert 180°)",
        "",
        "_Applies to the whole label; separate from field rotation (`N`,`R`,`I`,`B`) used by text/barcodes._"
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^PW",
    insertText: "^PW${1:w}",
    insertTextRules: suggestionSnip,
    kind: 25, /* suggestionKind.User, */
    detail: "Print Width",
    documentation: {
      value: [
        "**^PW** — `^PWn`",
        "",
        "- **n**: Label width in dots (printable area width)",
      ].join("\n"),
      isTrusted: true
    },

  },


  /* DOWNLOAD COMMANDS ****************************************************************************************/
  {
    label: "~DB",
    insertText: "~DB${1:device}:${2:FONT}.${3:ext},${4:nativeCell},${5:height},${6:width},${7:baseline},${8:space},${9:chars},${10:copyright},${11:data}",
    insertTextRules: suggestionSnip,
    kind: 27, /* suggestionKind.Snippet, */
    detail: "Download Bitmap Font",
    documentation: {
      value: [
        "**~DB** — `~DBd:o.x,a,h,w,base,space,#char,©,data`",
        "",
        "- **d:o.x**: Device & filename",
        "- **a**: Native cell size (points)",
        "- **h,w**: Character height/width (dots)",
        "- **base**: Baseline from top of cell (dots)",
        "- **space**: Space char width",
        "- **#char**: Number of characters in font",
        "- **©**: Copyright string",
        "- **data**: Structured glyph data (#xxxx,h,w,x,y,i,data …)",
      ].join("\\n"),
      isTrusted: true
    },

  },
  {
    label: "~DE",
    insertText: "~DE${1:device}:${2:name}.DAT,${3:size},${4:data}",
    insertTextRules: suggestionSnip,
    kind: 27, /* suggestionKind.Snippet, */
    detail: "Download Encoding",
    documentation: {
      value: [
        "**~DE** — `~DEd:o.x,s,data`",
        "",
        "- **d:o.x**: Device & table name (`.DAT`)",
        "- **s**: Table size (bytes)",
        "- **data**: Table payload",
      ].join("\\n"),
      isTrusted: true
    },

  },
  {
    label: "^DF",
    insertText: "^DF${1:device}:${2:FORMAT.ZPL}",
    insertTextRules: suggestionSnip,
    kind: 27, /* suggestionKind.Snippet, */
    detail: "Download Format (store template)",
    documentation: {
      value: [
        "**^DF** — Store format/template",
        "",
        "- **device**: `R:`, `E:`, `B:`",
        "- **FORMAT.ZPL**: Destination filename"
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "~DG",
    insertText: "~DG${1:device}:${2:NAME.GRF},${3:totalBytes},${4:bytesPerRow},${5:data}",
    insertTextRules: suggestionSnip,
    kind: 27, /* suggestionKind.Snippet, */
    detail: "Download Graphics",
    documentation: {
      value: [
        "**~DG** — `~DGd:o.x,t,w,data`",
        "",
        "- **d:o.x**: Device & `.GRF` name",
        "- **t**: Total bytes",
        "- **w**: Bytes per row",
        "- **data**: ASCII-hex (supports repeat compression)",
      ].join("\\n"),
      isTrusted: true
    },

  },
  {
    label: "~DN",
    insertText: "~DN",
    insertTextRules: suggestionSnip,
    kind: 27, /* suggestionKind.Snippet, */
    detail: "Abort Download Graphic",
    documentation: {
      value: [
        "**~DN** — Abort current graphic download (no params)"
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "~DS",
    insertText: "~DS${1:device}:${2:FONT}.SFT,${3:size},${4:data}",
    insertTextRules: suggestionSnip,
    kind: 27, /* suggestionKind.Snippet, */
    detail: "Download Intellifont",
    documentation: {
      value: [
        "**~DS** — `~DSd:o.x,s,data`",
        "",
        "- **d:o.x**: Device & font name (`.SFT`)",
        "- **s**: Size (bytes)",
        "- **data**: Font payload",
      ].join("\\n"),
      isTrusted: true
    },

  },
  {
    label: "~DT",
    insertText: "~DT${1:device}:${2:FONT}.DAT,${3:size},${4:data}",
    insertTextRules: suggestionSnip,
    kind: 27, /* suggestionKind.Snippet, */
    detail: "Download Bounded TrueType Font",
    documentation: {
      value: [
        "**~DT** — `~DTd:o.x,s,data`",
        "",
        "- **d:o.x**: Device & font name (`.DAT`)",
        "- **s**: Bytes required",
        "- **data**: Font payload",
      ].join("\\n"),
      isTrusted: true
    },

  },
  {
    label: "~DU",
    insertText: "~DU${1:device}:${2:FONT},${3:size},${4:data}",
    insertTextRules: suggestionSnip,
    kind: 27, /* suggestionKind.Snippet, */
    detail: "Download Unbounded TrueType Font",
    documentation: {
      value: [
        "**~DU** — `~DUd:o.x,s,data`",
        "",
        "- **d:o.x**: Device & font name (often no extension)",
        "- **s**: Total bytes",
        "- **data**: Hex payload",
      ].join("\\n"),
      isTrusted: true
    },

  },
  {
    label: "~DY",
    insertText: "~DY${1:device}:${2:object},${3:format},${4:ext},${5:totalBytes},${6:bytesPerRow},${7:data}",
    insertTextRules: suggestionSnip,
    kind: 27, /* suggestionKind.Snippet, */
    detail: "Download Objects",
    documentation: {
      value: [
        "**~DY** — `~DYd:f,b,x,t,w,data`",
        "",
        "- **d**: Device",
        "- **f**: Object name",
        "- **b**: Format code (bitmap/AR/other)",
        "- **x**: Extension",
        "- **t**: Total bytes",
        "- **w**: Bytes per row",
        "- **data**: Payload",
        "",
        "_Superset of ~DG; supports additional object/format types._"
      ].join("\\n"),
      isTrusted: true
    },

  },
  {
    label: "~EG",
    insertText: "~EG",
    insertTextRules: suggestionSnip,
    kind: 27, /* suggestionKind.Snippet, */
    detail: "Erase All Graphics (tilde form)",
    documentation: { value: "**~EG** — Erase all stored graphics.", isTrusted: true },

  },
  {
    label: "^EG",
    insertText: "^EG",
    insertTextRules: suggestionSnip,
    kind: 27, /* suggestionKind.Snippet, */
    detail: "Erase All Graphics (caret form)",
    documentation: { value: "**^EG** — Erase all stored graphics.", isTrusted: true },

  },

  // Shapes / graphics
  {
    label: "^GB",
    insertText: "^GB${1:w},${2:h},${3:thk},${4:c},${5:r}",
    insertTextRules: suggestionSnip,
    kind: 27, /* suggestionKind.Snippet, */
    detail: "Graphic Box",
    documentation: {
      value: [
        "**^GB** — `^GBw,h,thk,c,r`",
        "",
        "- **w,h**: Width/Height (dots)",
        "- **thk**: Border thickness",
        "- **c**: Color (`B`=black, `W`=white)",
        "- **r**: Corner-rounding (0–8)"
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^GC",
    insertText: "^GC${1:d},${2:thk},${3:c}",
    insertTextRules: suggestionSnip,
    kind: 27, /* suggestionKind.Snippet, */
    detail: "Graphic Circle",
    documentation: {
      value: [
        "**^GC** — `^GCd,thk,c`",
        "",
        "- **d**: Diameter (dots)",
        "- **thk**: Border thickness (0 = filled)",
        "- **c**: Color (`B`/`W`)"
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^GD",
    insertText: "^GD${1:w},${2:h},${3:thk},${4:c},${5:o}",
    insertTextRules: suggestionSnip,
    kind: 27, /* suggestionKind.Snippet, */
    detail: "Graphic Diagonal Line",
    documentation: {
      value: [
        "**^GD** — `^GDw,h,t,c,o`",
        "",
        "- **w,h**: Width/Height (dots)",
        "- **t**: Line thickness",
        "- **c**: Color (`B`/`W`)",
        "- **o**: Orientation (direction of diagonal)",
      ].join("\\n"),
      isTrusted: true
    },

  },
  {
    label: "^GE",
    insertText: "^GE${1:w},${2:h},${3:thk},${4:c}",
    insertTextRules: suggestionSnip,
    kind: 27, /* suggestionKind.Snippet, */
    detail: "Graphic Ellipse",
    documentation: {
      value: [
        "**^GE** — `^GEw,h,thk,c`",
        "",
        "- **w,h**: Major/minor axes (dots)",
        "- **thk**: Border thickness (0 = filled)",
        "- **c**: Color (`B`/`W`)"
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^GF",
    insertText: "^GF${1:a},${2:totalBytes},${3:bytesPerRowOrFmt},${4:bytesPerRow},${5:data}",
    insertTextRules: suggestionSnip,
    kind: 27, /* suggestionKind.Snippet, */
    detail: "Graphic Field",
    documentation: {
      value: [
        "**^GF** — `^GFa,b,c,d,data`",
        "",
        "- **a**: Compression (`A`=ASCII hex, `B`=binary, `C`=compressed)",
        "- **b**: Total bytes transmitted",
        "- **c**: Bytes in graphic data (or format count)",
        "- **d**: Bytes per row",
        "- **data**: Graphic data",
      ].join("\\n"),
      isTrusted: true
    },

  },
  {
    label: "^GS",
    insertText: "^GS${1:o},${2:h},${3:w}",
    insertTextRules: suggestionSnip,
    kind: 27, /* suggestionKind.Snippet, */
    detail: "Graphic Symbol",
    documentation: {
      value: [
        "**^GS** — `^GSo,h,w`",
        "",
        "- **o**: Orientation (`N`,`R`,`I`,`B`)",
        "- **h,w**: Size in dots",
        "",
        "_Symbol selection is via field data (^FD)._",
      ].join("\\n"),
      isTrusted: true
    },

  },

  // Storage / object management
  {
    label: "^ID",
    insertText: "^ID${1:device}:${2:NAME}.${3:EXT}",
    insertTextRules: suggestionSnip,
    kind: 27, /* suggestionKind.Snippet, */
    detail: "Object Delete",
    documentation: {
      value: [
        "**^ID** — Delete object",
        "",
        "- **device:file** (supports wildcards in many firmwares)"
      ].join("\n"),
      isTrusted: true
    },

  },
  {
    label: "^IL",
    insertText: "^IL${1:device}:${2:NAME.GRF}",
    insertTextRules: suggestionSnip,
    kind: 27, /* suggestionKind.Snippet, */
    detail: "Image Load (format image to bitmap)",
    documentation: {
      value: [
        "**^IL** — `^ILd:o.x`",
        "",
        "- **d:o.x**: Source image (e.g., `R:TEMPLATE.GRF`)",
        "- Loads the saved format image into the bitmap (at `^FO0,0`)."
      ].join("\\n"),
      isTrusted: true
    },

  },
  {
    label: "^IM",
    insertText: "^IM${1:device}:${2:NAME.GRF}",
    insertTextRules: suggestionSnip,
    kind: 27, /* suggestionKind.Snippet, */
    detail: "Image Move (recall, no magnification)",
    documentation: {
      value: [
        "**^IM** — `^IMd:o.x`",
        "",
        "- **d:o.x**: Stored image",
        "- Direct move (no magnification); position with **^FO**."
      ].join("\\n"),
      isTrusted: true
    },

  },
  {
    label: "^IS",
    insertText: "^IS${1:device}:${2:NAME.GRF},${3:printAfter:Y|N}",
    insertTextRules: suggestionSnip,
    kind: 27, /* suggestionKind.Snippet, */
    detail: "Image Save (store current format as graphic)",
    documentation: {
      value: [
        "**^IS** — `^ISd:o.x,p`",
        "",
        "- **d:o.x**: Destination & `.GRF` name",
        "- **p**: Print after storing (`Y`/`N`)",
        "",
        "_Saves the **current** ZPL format as a `.GRF` template._"
      ].join("\\n"),
      isTrusted: true
    },

  },
  {
    label: "^XG",
    insertText: "^XG${1:device}:${2:NAME.GRF},${3:x},${4:y}",
    insertTextRules: suggestionSnip,
    kind: 27, /* suggestionKind.Snippet, */
    detail: "Recall Graphic",
    documentation: {
      value: [
        "**^XG** — Recall graphic into field",
        "",
        "- **device:file**: Stored graphic (GRF)",
        "- **x,y**: Magnification (1–10 typical)"
      ].join("\n"),
      isTrusted: true
    },
  },
]




export function registerZplCompletions(monacoInst: Monaco) {
  monacoInst.languages.registerCompletionItemProvider(ZPL_ID, {
    triggerCharacters: ["^", "~", "F", "B", "A", "G", "L", "P", "M", "C"],
    provideCompletionItems(model, position) {
      const word = model.getWordUntilPosition(position);
      const range = new monacoInst.Range(
        position.lineNumber,
        word.startColumn,
        position.lineNumber,
        word.endColumn
      );

      const suggestions = suggestionData.map(suggestion => {
        return {...suggestion, range }
      })

      return { suggestions };
    },
  });
}


export const demoZpl = `^XA
^LRN
^MNY
^MFN,N
^LH10,12
^MCY
^POI
^PW812   ; This is an example with comments!
^CI27
^FO96,544^BY3^BCN,142,N,N,N,A^FV1Z4X7V81YW00000000^FS
^FO37,995^BY3^BCN,144,N,N,N,D^FV42000000>892612903000000000000000000^FS
^FO295,311^BY3^BCN,107,N,N,N,A^FV420000000000^FS
^FO30,818^BXN,4,200,,,,_^FD_142000000_192612903000000000000000000^FS
^FO20,221^CVY^BD2^FH_^FD988840000000000[)>_1E01_1D961Z00000000_1DUPSN_1D4X7V81_1E07W'EEH636*N$%,Q(_1CT3.4FQ&KAJKWR5J&Q$.:,C9F(V'G_0D_1E_04^FS
^FO15,11^A0N,22,26^FVTEST SENDER INC.^FS
^FO15,36^A0N,22,26^FVTEST STREET ^FS
^FO15,60^A0N,22,26^FVMISSOURI CITY TX 00000^FS
^FO91,89^A0N,30,34^FVSHIP ^FS
^FO91,130^A0N,30,34^FVTO : ^FS
^FO188,89^A0N,30,34^FVUSPS 00000^FS
^FO188,130^A0N,30,34^FVTEST STREET 2^FS
^FO188,171^A0N,30,34^FVIDAHO FALLS   ID  00000-0000^FS
^FO457,9^A0N,28,32^FV2 LBS^FS
^FO132,808^A0N,22,26^FVUSPS Deliver To: ^FS
^FO132,831^A0N,20,24^FVTEST RECEIVER^FS
^FO132,855^A0N,20,24^FVTEST STREET 3^FS
^FO132,878^A0N,20,24^FVIDAHO FALLS, ID 00000-0000^FS
^FO244,946^A0N,30,34^FVUSPS TRACKING # eVS^FS
^FO158,1167^A0N,26,30^FV9261 2903 0000 0000 0000 0000 00 ^FS
^FO110,731^A0N,39,42^FVUSPS PARCEL SELECT^FS
^FO574,715^A0N,18,22^FVUS POSTAGE PAID^FS
^FO640,739^A0N,18,22^FVUPS^FS
^FO640,763^A0N,18,22^FVeVS^FS
^FO396,804^A0N,22,26^FVCARRIER - LEAVE IF NO RESPONSE^FS
^FO688,9^A0N,28,32^FV1 OF 1^FS
^FO15,463^A0N,45,44^FVUPS SUREPOST^FS
^FO15,508^A0N,26,30^FVTRACKING #: 1Z 4X7 V81 YW 0000 0000^FS
^FO295,221^A0N,72,68^FVID 834 9-01 X^FS
^FO0,212^GB812,4,4,B,0^FS
^FO244,213^GB4,234,4,B,0^FS
^FO690,447^GB122,91,91,B,0^FS
^FO0,534^GB812,4,4,B,0^FS
^FO0,441^GB812,14,14,B,0^FS
^FO0,688^GB812,14,14,B,0^FS
^FO540,706^GB229,80,3,B,0^FS
^FO0,698^GB97,94,94,B,0^FS
^FO93,698^GB4,94,4,B,0^FS
^FO0,792^GB812,4,4,B,0^FS
^FO0,923^GB812,11,11,B,0^FS
^FO0,1207^GB812,11,11,B,0^FS
^FO10,1300^A0N,23,23^FDCONTAINS NICOTINE PRODUCTS^FS^FO10,1375^A0N,23,23^FDCIGARETTES/SMOKELESS TOBACCO:  FEDERAL LAW REQUIRES THE PAYMENT OF^FS ^FO10,1400^A0N,23,23^FDALL APPLICABLE EXCISE TAXES, AND COMPLIANCE  WITH APPLICABLE LICENSING^FS ^FO10,1425^A0N,23,23^FDAND TAX-STAMPING OBLIGATIONS.^FS^XZ

^XA
^DFE:SAMPLE.ZPL^FS
^FO20,30^GB750,1100,4^FS
^FO20,30^GB750,200,4^FS
^FO20,30^GB750,400,4^FS
^FO20,30^GB750,700,4^FS
^FO20,226^GB325,204,4^FS
^FO30,40^ADN,36,20^FDShip to: ^FS
^FO30,260^ADN,18,10^FDPart number #^FS
^FO360,260^ADN,18,10^FDDescription: ^FS
^FO30,750^ADN,36,20^FDFrom: ^FS
^FO150,125^ADN,36,20^FN1^FS
^FO60,330^ADN,36,20^FN2^FS
^FO480,330^ADN,36,20^FN3^FS
^FO70,480^BY4^B3N,,200^FN4^FS
^FO150,800^ADN,36,20^FN5^FS
^XZ

^XA
^XFE:SAMPLE.ZPL
^FN1^FDAcme Printing^FS
^FN2^FD14042^FS
^FN3^FDScrew^FS
^FN4^FD12345678^FS
^FN5^FDMacks Fabricating^FS
^XZ
`;