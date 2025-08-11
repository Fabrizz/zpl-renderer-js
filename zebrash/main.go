package main

import (
	"bytes"
	"syscall/js"

	"github.com/ingridhq/zebrash"
	"github.com/ingridhq/zebrash/drawers"
)

func zplToPNG(this js.Value, args []js.Value) interface{} {
	if len(args) < 4 {
		return js.ValueOf("missing arguments: zpl, widthMm, heightMm, dpmm")
	}

	zpl := args[0].String()
	widthMm := args[1].Float()
	heightMm := args[2].Float()
	dpmm := args[3].Float()

	parser := zebrash.NewParser()
	labels, err := parser.Parse([]byte(zpl))
	if err != nil {
		return js.ValueOf("parse error: " + err.Error())
	}
	if len(labels) == 0 {
		return js.ValueOf("no labels parsed")
	}

	var buf bytes.Buffer
	drawer := zebrash.NewDrawer()
	opts := drawers.DrawerOptions{
		LabelWidthMm:  widthMm,
		LabelHeightMm: heightMm,
		Dpmm:          int(dpmm),
	}
	err = drawer.DrawLabelAsPng(labels[0], &buf, opts)
	if err != nil {
		return js.ValueOf("draw error: " + err.Error())
	}

	// Convert []byte to Uint8Array for JS
	uint8Array := js.Global().Get("Uint8Array").New(len(buf.Bytes()))
	js.CopyBytesToJS(uint8Array, buf.Bytes())
	return uint8Array
}

func main() {
	js.Global().Set("zplToPNG", js.FuncOf(zplToPNG))
	select {} // prevent Go program from exiting
}
