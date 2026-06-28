import { cn, formatNumber } from "@/lib/utils";
import { Flame, Layers, Trophy, Wind } from "lucide-react";
import { Environment } from "@/lib/environments";

interface HUDProps {
  score: number;
  combo: number;
  floors: number;
  highScore: number;
  environment: Environment;
}

export default function HUD({ score, combo, floors, highScore, environment }: HUDProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col gap-3 p-4 no-select">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Score</div>
          <div className="text-4xl font-display font-bold text-white text-shadow-glow leading-none">
            {formatNumber(score)}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-white/70">
            <Trophy className="h-3 w-3" /> Best {formatNumber(highScore)}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 text-right">
          <div
            className={cn(
              "flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur",
              floors > 0 && "border-neon-cyan/60 text-neon-cyan"
            )}
          >
            <Layers className="h-3.5 w-3.5" /> Floor {floors}
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/85 backdrop-blur">
            <Wind className="h-3.5 w-3.5" />
            {environment.name}
          </div>
        </div>
      </div>

      {combo >= 2 && (
        <div className="mx-auto animate-combo-pop">
          <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-fuchsia-500 px-4 py-1.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(255,90,180,0.5)]">
            <Flame className="h-4 w-4" /> Combo x{combo}
          </div>
        </div>
      )}
    </div>
  );
}
