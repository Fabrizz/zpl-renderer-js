package main

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"syscall/js"

	"github.com/ingridhq/zebrash"
	"github.com/ingridhq/zebrash/drawers"
)

var (
	renderBasicFn js.Func
	renderAsyncFn js.Func
)

// Core render helper
func zplToPNGBytes(zpl string, widthMm, heightMm float64, dpmm int) ([]byte, error) {
	parser := zebrash.NewParser()
	labels, err := parser.Parse([]byte(zpl))
	if err != nil || len(labels) == 0 {
		return nil, err
	}

	var buf bytes.Buffer
	drawer := zebrash.NewDrawer()
	opts := drawers.DrawerOptions{
		LabelWidthMm:  widthMm,
		LabelHeightMm: heightMm,
		Dpmm:          dpmm,
	}
	if err := drawer.DrawLabelAsPng(labels[0], &buf, opts); err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

// zpl.Render(zpl, widthMm?, heightMm?, dpmm?) -> base64 PNG
func renderBase64Basic(this js.Value, args []js.Value) any {
	if len(args) < 1 {
		return js.ValueOf("missing argument: zpl")
	}
	zpl := args[0].String()

	// Defaults: 101.6 × 203.2 mm @ 8 dpmm (~203 DPI)
	widthMm := 101.6
	heightMm := 203.2
	dpmm := 8

	// Optional overrides
	if len(args) > 1 && args[1].Type() == js.TypeNumber {
		widthMm = args[1].Float()
	}
	if len(args) > 2 && args[2].Type() == js.TypeNumber {
		heightMm = args[2].Float()
	}
	if len(args) > 3 && args[3].Type() == js.TypeNumber {
		dpmm = args[3].Int()
	}

	png, err := zplToPNGBytes(zpl, widthMm, heightMm, dpmm)
	if err != nil {
		return js.ValueOf("draw error: " + err.Error())
	}
	if len(png) == 0 {
		return js.ValueOf("no labels parsed")
	}

	return js.ValueOf(base64.StdEncoding.EncodeToString(png))
}

func renderBase64Async(this js.Value, args []js.Value) any {
	promiseConstructor := js.Global().Get("Promise")
	return promiseConstructor.New(js.FuncOf(func(this js.Value, promiseArgs []js.Value) any {
		resolve := promiseArgs[0]
		reject := promiseArgs[1]

		// Run the processing in a goroutine to make it async
		go func() {
			// Convert to Promise rejection
			defer func() {
				if r := recover(); r != nil {
					reject.Invoke(js.Global().Get("Error").New(fmt.Sprintf("Unexpected error: %v", r)))
				}
			}()

			// Validation
			if len(args) < 1 {
				reject.Invoke(js.Global().Get("Error").New("Missing argument: zpl"))
				return
			}

			zpl := args[0].String()

			// Defaults: 101.6 × 203.2 mm @ 8 dpmm (~203 DPI)
			widthMm := 101.6
			heightMm := 203.2
			dpmm := 8

			// Optional overrides
			if len(args) > 1 && args[1].Type() == js.TypeNumber {
				widthMm = args[1].Float()
			}
			if len(args) > 2 && args[2].Type() == js.TypeNumber {
				heightMm = args[2].Float()
			}
			if len(args) > 3 && args[3].Type() == js.TypeNumber {
				dpmm = args[3].Int()
			}

			// Process the ZPL
			png, err := zplToPNGBytes(zpl, widthMm, heightMm, dpmm)
			if err != nil {
				reject.Invoke(js.Global().Get("Error").New("Error rendering: " + err.Error()))
				return
			}
			if len(png) == 0 {
				reject.Invoke(js.Global().Get("Error").New("No labels parsed"))
				return
			}

			// Resolve the promise with the base64 string
			resolve.Invoke(js.ValueOf(base64.StdEncoding.EncodeToString(png)))
		}()

		return nil
	}))
}

func main() {
	global := js.Global()

	// Namespace: globalThis.zpl.Render(...)
	zplNS := global.Get("zpl")
	if zplNS.IsUndefined() || zplNS.IsNull() {
		zplNS = global.Get("Object").New()
		global.Set("zpl", zplNS)
	}

	// Compatibility with older API: globalThis.zpl.Render(...)
	renderBasicFn = js.FuncOf(renderBase64Basic)
	zplNS.Set("Render", renderBasicFn)

	// New async API: globalThis.zpl.zplToBase64Async(...)
	renderAsyncFn = js.FuncOf(renderBase64Async)
	zplNS.Set("zplToBase64Async", renderAsyncFn)

	select {}
}
