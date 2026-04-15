let vendorPromise: Promise<void> | null = null;

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = false;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

export function loadZebraPrint() {
  if (!vendorPromise) {
    vendorPromise = (async () => {
      await loadScript('/vendor/BrowserPrint-3.1.250.min.js');
      await loadScript('/vendor/BrowserPrint-Zebra-1.1.250.min.js');
    })();

  }
  return vendorPromise;
}