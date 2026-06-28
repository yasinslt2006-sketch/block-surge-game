import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function InterstitialAd({ open, onClose }: Props) {
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    if (!open) return;
    setCountdown(4);
    const id = setInterval(() => {
      setCountdown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-fuchsia-700 via-purple-700 to-indigo-900 p-8 text-center shadow-2xl">
        <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/70">Sponsored</div>
        <h3 className="mt-3 font-display text-3xl font-bold text-white">Stack Smarter</h3>
        <p className="mt-2 text-sm text-white/85">
          Imagine your ad here — placeholder interstitial shown every few runs.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          Demo Ad Network
        </div>
        <button
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white/80 hover:bg-black/60 disabled:opacity-40"
          onClick={onClose}
          disabled={countdown > 0}
          aria-label="Close ad"
        >
          {countdown > 0 ? <span className="text-xs font-bold">{countdown}</span> : <X className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
