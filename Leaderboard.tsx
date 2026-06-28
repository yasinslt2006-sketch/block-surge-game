import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Crown, Globe2, Sun } from "lucide-react";
import { loadStats } from "@/lib/storage";
import { cn, formatNumber } from "@/lib/utils";

interface Row {
  rank: number;
  name: string;
  score: number;
  floors: number;
  isYou?: boolean;
}

const SEED_NAMES = [
  "Skyline_Nova",
  "Pixel_Hawk",
  "GravityKing",
  "NeonArch",
  "SteelBee",
  "LunaStack",
  "VortexJin",
  "Orbital9",
  "QuartzMimi",
  "AeroVel",
  "CraneOp",
  "Zenith_Z",
];

function generateBoard(seed: number, yourScore: number, yourFloors: number): Row[] {
  const rng = mulberry32(seed);
  const rows: Row[] = [];
  for (let i = 0; i < 12; i++) {
    const baseScore = Math.round(800 + rng() * 4200);
    const floors = Math.round(20 + rng() * 80);
    rows.push({
      rank: 0,
      name: SEED_NAMES[i % SEED_NAMES.length],
      score: baseScore,
      floors,
    });
  }
  if (yourScore > 0) {
    rows.push({ rank: 0, name: "You", score: yourScore, floors: yourFloors, isYou: true });
  }
  rows.sort((a, b) => b.score - a.score);
  rows.forEach((r, i) => (r.rank = i + 1));
  return rows;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function LeaderboardPage() {
  const stats = useMemo(() => loadStats(), []);
  const [tab, setTab] = useState<"daily" | "global">("daily");
  const today = new Date();
  const daySeed =
    today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

  const rows = useMemo(() => {
    if (tab === "daily") {
      const todayBest = stats.runs.filter((r) => {
        const d = new Date(r.date);
        return d.toDateString() === new Date().toDateString();
      });
      const bestToday = todayBest.reduce((acc, r) => (r.score > acc ? r.score : acc), 0);
      const bestTodayFloors = todayBest.reduce((acc, r) => (r.score > acc ? r.floors : acc), 0);
      return generateBoard(daySeed, bestToday, bestTodayFloors);
    }
    return generateBoard(42, stats.highScore, stats.highestTower);
  }, [tab, daySeed, stats]);

  return (
    <div className="min-h-[100dvh] bg-background">
      <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-border/70 bg-background/85 px-4 py-3 backdrop-blur">
        <Link to="/">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Compete
          </p>
          <h1 className="font-display text-lg font-semibold leading-tight">Leaderboards</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-5">
        <div className="inline-flex rounded-full border border-border bg-card p-1 text-xs font-semibold">
          <button
            onClick={() => setTab("daily")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition",
              tab === "daily" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Sun className="h-3.5 w-3.5" /> Daily
          </button>
          <button
            onClick={() => setTab("global")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition",
              tab === "global" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Globe2 className="h-3.5 w-3.5" /> Global
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="grid grid-cols-[40px_1fr_80px_70px] gap-3 border-b border-border bg-secondary/40 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <span>#</span>
            <span>Architect</span>
            <span className="text-right">Score</span>
            <span className="text-right">Floors</span>
          </div>
          <ul>
            {rows.slice(0, 20).map((r) => (
              <li
                key={r.rank + r.name}
                className={cn(
                  "grid grid-cols-[40px_1fr_80px_70px] items-center gap-3 px-4 py-3 text-sm",
                  r.isYou && "bg-primary/10",
                  r.rank <= 3 && "border-b border-border/60"
                )}
              >
                <span className={cn("font-display font-bold", r.rank === 1 && "text-amber-300", r.rank === 2 && "text-slate-200", r.rank === 3 && "text-orange-300")}>
                  {r.rank === 1 ? <Crown className="h-4 w-4" /> : r.rank}
                </span>
                <span className={cn("truncate font-medium", r.isYou && "text-primary")}>{r.name}</span>
                <span className="text-right font-display font-semibold">{formatNumber(r.score)}</span>
                <span className="text-right text-muted-foreground">{r.floors}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          {tab === "daily" ? "Daily board resets at midnight local time." : "Global standings — mock data for V1.0."}
        </p>

        <div className="mt-6 rounded-2xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Your recent runs</p>
          {stats.runs.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No runs yet. Play a round to populate.</p>
          ) : (
            <ul className="mt-2 divide-y divide-border/60">
              {stats.runs.slice(0, 8).map((r) => (
                <li key={r.date} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-muted-foreground">
                    {new Date(r.date).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}
                  </span>
                  <span className="font-display font-semibold">{formatNumber(r.score)} • {r.floors} fl</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
