import { clsx, type ClassValue } from "clsx"
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function rotateBase64Png(input: string, degrees: number): Promise<string> {
  const dataUrl = input.startsWith("data:image/png;base64,")
    ? input
    : `data:image/png;base64,${input}`;

  const img = await loadImage(dataUrl);
  const rad = (degrees % 360) * Math.PI / 180;

  // Tamaño del bounding box luego de rotar
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));
  const newW = Math.round(img.width * cos + img.height * sin);
  const newH = Math.round(img.width * sin + img.height * cos);

  const canvas = document.createElement("canvas");
  canvas.width = newW;
  canvas.height = newH;
  const ctx = canvas.getContext("2d")!;

  // Rotar alrededor del centro
  ctx.translate(newW / 2, newH / 2);
  ctx.rotate(rad);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);

  return canvas.toDataURL("image/png"); // base64 con prefijo data:
}

// Helper para cargar imágenes con promesa
function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = reject;
    im.src = src;
  });
}

export function useDebounced<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export const stringBytes = (s: string) => new TextEncoder().encode(s).length;

export function downloadTxtFile(content: string) {
  const fileName = `label.zpl`;

  // Create a Blob with the text content
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  // Create a hidden <a> element and trigger the download
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();

  // Clean up
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download a Base64 PNG string as an image file (auto-download, no prompt).
 * Accepts either raw base64 ("iVBORw0KGgo...") or a data URL
 * ("data:image/png;base64,iVBORw0KGgo...").
 */
export function downloadBase64Png(b64: string, fileName?: string) {
  // If it's a data URL, extract mime and base64 payload
  let mime = "image/png";
  let payload = b64;

  const dataUrlMatch = /^data:([^;]+);base64,(.*)$/i.exec(b64);
  if (dataUrlMatch) {
    mime = dataUrlMatch[1] || mime;
    payload = dataUrlMatch[2];
  }
  // Convert base64 → Blob
  const blob = base64ToBlob(payload, mime);

  const name = fileName ?? `label.png`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function base64ToBlob(base64: string, mime: string) {
  // Decode base64 to bytes
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}