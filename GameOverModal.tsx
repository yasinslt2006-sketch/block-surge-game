import { Button } from "@/components/ui/button";
import { ArrowRight, Coins, Home, PlayCircle, RotateCcw, Trophy } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { useEffect, useState } from "react";

interface GameOverModalProps {
  open: boolean;
  score: number;
  floors: number;
  bestCombo: number;
  coinsEarned: number;
  isNewBest: boolean;
  onRetry: () => void;
  onContinue: () => void;
  onHome: () => void;
  continueUsed: boolean;
}

export default function GameOverModal({
  open,
  score,
  floors,
  bestCombo,
  coinsEarned,
  isNewBest,
  onRetry,
  onContinue,
  onHome,
  continueUsed,
}: GameOverModalProps) {
  const [adCountdown, setAdCountdown] = useState(0);
  const [watchingAd, setWatchingAd] = useState(false);

  useEffect(() => {
    if (!watchingAd) return;
    setAdCountdown(3);
    const id = setInterval(() => {
      setAdCountdown((c) => {
        if (c <= 1) {
          clearInterval(id);
          setWatchingAd(false);
          onContinue();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [watchingAd, onContinue]);

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md animate-float-up">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card/95 p-6 shadow-2xl">
        {watchingAd ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="h-16 w-16 animate-pulse-glow rounded-full bg-primary/20 ring-2 ring-primary/60" />
            <div>
              <p className="text-lg font-semibold">Watching ad…</p>
              <p className="text-sm text-muted-foreground">Resuming in {adCountdown}s</p>
            </div>
            <p className="text-xs text-muted-foreground/80">(simulated rewarded ad)</p>
          </div>
        ) : (
          <>
            <div className="mb-2 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {isNewBest ? "New Best!" : "Tower Collapsed"}
              </p>
              <h2 className="mt-1 font-display text-3xl font-bold">
                {isNewBest ? (
                  <span className="bg-gradient-to-r from-amber-300 to-pink-400 bg-clip-text text-transparent">
                    {formatNumber(score)}
                  </span>
                ) : (
                  formatNumber(score)
                )}
              </h2>
            </div>

            <div className="my-4 grid grid-cols-3 gap-2 text-center">
              <Stat label="Floors" value={floors.toString()} />
              <Stat label="Combo" value={`x${bestCombo}`} />
              <Stat
                label="Coins"
                value={
                  <span className="inline-flex items-center gap-1">
                    <Coins className="h-3.5 w-3.5 text-amber-300" />
                    {coinsEarned}
                  </span>
                }
              />
            </div>

            {isNewBest && (
              <div className="mb-3 flex items-center justify-center gap-1.5 rounded-lg border border-amber-300/40 bg-amber-300/10 py-1.5 text-xs font-semibold text-amber-200">
                <Trophy className="h-3.5 w-3.5" /> Personal best score!
              </div>
            )}

            <div className="flex flex-col gap-2">
              {!continueUsed && floors >= 3 && (
                <Button
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400"
                  onClick={() => setWatchingAd(true)}
                >
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Continue (Watch Ad)
                </Button>
              )}
              <Button className="w-full" onClick={onRetry}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Play Again
                <ArrowRight className="ml-2 h-4 w-4 opacity-60" />
              </Button>
              <Button variant="ghost" className="w-full" onClick={onHome}>
                <Home className="mr-2 h-4 w-4" />
                Main Menu
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/40 px-2 py-2">
      <div className="font-display text-lg font-bold text-foreground">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
