package main

import (
	"bytes"
	"encoding/base64"
	"syscall/js"

	"github.com/ingridhq/zebrash"
	"github.com/ingridhq/zebrash/drawers"
)

var (
	renderBasicFn js.Func
	renderFn      js.Func
)

// --- Core render helper (bytes) ---
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

// zpl.Render(zpl, widthMm?, heightMm?, dpmm?) -> base64 PNG string ---
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

func renderBase64(this js.Value, args []js.Value) any {
	if len(args) < 1 {
		panic(js.Global().Get("Error").New("Missing argument: zpl"))
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
		panic(js.Global().Get("Error").New("Error rendering: " + err.Error()))
	}
	if len(png) == 0 {
		panic(js.Global().Get("Error").New("No labels parsed"))
	}

	return js.ValueOf(base64.StdEncoding.EncodeToString(png))
}

func main() {
	global := js.Global()

	// Namespace: globalThis.zpl.Render(...)
	zplNS := global.Get("zpl")
	if zplNS.IsUndefined() || zplNS.IsNull() {
		zplNS = global.Get("Object").New() // {}  (better than js.ValueOf(map[...]{}))
		global.Set("zpl", zplNS)
	}

	// Compatibility with older API: globalThis.zpl.Render(...)
	renderBasicFn = js.FuncOf(renderBase64Basic)
	zplNS.Set("Render", renderBasicFn)

	// New API: globalThis.zpl.zplToBase64(...)
	renderFn = js.FuncOf(renderBase64)
	zplNS.Set("zplToBase64", renderFn)

	select {}
}
