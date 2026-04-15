import { ready } from "zpl-renderer-js";
import { useMemo } from "react";
import { useDebounced } from "@/lib/utils";

const { api } = await ready;

type ZplRendererProps = {
  zpl: string;
  /** milliseconds */
  debounce?: number;
  /** width in millimeters */
  wmm?: number;
  /** height in millimeters */
  hmm?: number;
  /** dots per millimeter */
  dpmm?: number;
  /* optional className for the img */
  className?: string;
  /** callback to set PNG data */
  setPng?: (png: string | null) => void;
  /** rotation in degrees */
  rotation?: number | undefined;
};

export default function ZplPreview({
  zpl,
  wmm = 101.6,
  hmm = 203.2,
  dpmm = 8,
  debounce = 300,
  setPng,
  className
}: ZplRendererProps) {
  const debouncedZpl = useDebounced(zpl, debounce);
  const b64 = useMemo(() => {
    const b = api.Render(debouncedZpl, wmm, hmm, dpmm);
    if (setPng) setPng(b);
    return b;
  }, [debouncedZpl, dpmm, hmm, wmm, setPng]);

  return (
    <img
      src={`data:image/png;base64,${b64}`}
      alt="ZPL Preview"
      className={className}
    />
  );
}