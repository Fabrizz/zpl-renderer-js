import { FileText, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { PDFDocument } from "pdf-lib";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Acepta un array de PNGs en base64 (cada uno con o sin "data:image/png;base64,")
 * y descarga UN solo PDF con 1 página por etiqueta.
 */
async function downloadPdfFromBase64Pngs(
  base64Pngs: string[],
  fileName = "labels.pdf",
  opts?: { fitToA4?: boolean; openInNewTab?: boolean; alsoDownload?: boolean }
) {
  if (!Array.isArray(base64Pngs) || base64Pngs.length === 0) {
    throw new Error("No PNGs provided");
  }

  const pdfDoc = await PDFDocument.create();

  const stripDataUrl = (b64: string) => (b64.includes(",") ? b64.split(",")[1] : b64);
  const base64ToBytes = (b64: string) =>
    Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

  const A4 = { w: 595.28, h: 841.89 }; // pts @72dpi

  for (let i = 0; i < base64Pngs.length; i++) {
    const raw = base64Pngs[i];
    if (!raw || typeof raw !== "string") continue;

    const pureBase64 = stripDataUrl(raw);
    const pngBytes = base64ToBytes(pureBase64);
    const png = await pdfDoc.embedPng(pngBytes);

    const imgWidth = png.width;
    const imgHeight = png.height;

    if (opts?.fitToA4) {
      const scale = Math.min(A4.w / imgWidth, A4.h / imgHeight);
      const drawW = imgWidth * scale;
      const drawH = imgHeight * scale;

      const page = pdfDoc.addPage([A4.w, A4.h]);
      const x = (A4.w - drawW) / 2;
      const y = (A4.h - drawH) / 2;

      page.drawImage(png, { x, y, width: drawW, height: drawH });
    } else {
      const page = pdfDoc.addPage([imgWidth, imgHeight]);
      page.drawImage(png, { x: 0, y: 0, width: imgWidth, height: imgHeight });
    }
  }

  const pdfBytes = await pdfDoc.save();

  const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  if (opts?.openInNewTab !== false) {
    const win = window.open(url, "_blank", "noopener,noreferrer");

    // If popup blocked, fall back to download
    if (!win) {
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  }

  // Optional: still download even if you opened it
  if (opts?.alsoDownload) {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // Give the browser a moment to start loading the blob URL before revoking
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export default function DownloadAsPdf({
  base64Png,
}: {
  base64Png: string[] | Error;
}) {
  const [loading, setLoading] = useState(false);

  function download() {
    setLoading(true);

    if (base64Png instanceof Error) {
      toast.error("Could not download your file.", {
        description: "There was an error with the ZPL code.",
      });
      setLoading(false);
      return;
    }

    downloadPdfFromBase64Pngs(base64Png, "labels.pdf", { fitToA4: false, openInNewTab: true, alsoDownload: false })
      .catch((e) => {
        console.error(e);
        toast.error("Could not download your file.", {
          description: "There was an error generating the PDF.",
        });
      })
      .finally(() => {
        setLoading(false);
        toast.success("Generated labels.pdf", {
          description: "Download should start shortly.",
        });
      });
  }

  return (
    <Button
      variant="outline"
      className="rounded-md px-2.5! h-7 flex items-center gap-1 relative"
      onClick={download}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="inline size-3.5 -ml-0.5" />
      ) : (
        <FileText className="inline size-3.5 -ml-0.5" />
      )}
      <span>PDF</span>
    </Button>
  );
}
