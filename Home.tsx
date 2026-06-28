import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Award,
  Calendar,
  ChevronRight,
  Coins,
  Crown,
  Flame,
  Layers,
  Lock,
  Play,
  Sparkles,
  Trophy,
  Wind,
} from "lucide-react";
import { ENVIRONMENTS } from "@/lib/environments";
import { GameStats, loadStats } from "@/lib/storage";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { cn, formatNumber } from "@/lib/utils";

export default function HomePage() {
  const [stats, setStats] = useState<GameStats>(() => loadStats());

  useEffect(() => {
    setStats(loadStats());
  }, []);

  const dailyChallenge = useMemo(() => generateDaily(), []);

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,hsl(180_100%_60%/0.18),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_85%_30%,hsl(320_100%_65%/0.12),transparent_70%)]" />
          <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(60%_50%_at_50%_30%,#000_30%,transparent)]" />
        </div>

        <div className="mx-auto max-w-5xl px-5 pb-10 pt-10 sm:pt-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LogoMark />
              <div className="font-display text-base font-bold tracking-tight">
                Tower<span className="text-primary">Architect</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-semibold">
              <Coins className="h-3.5 w-3.5 text-amber-300" />
              {formatNumber(stats.coins)}
            </div>
          </div>

          <div className="mt-10 grid items-end gap-6 sm:mt-14 sm:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                <Sparkles className="h-3 w-3" /> One-tap arcade
              </div>
              <h1 className="mt-4 font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl">
                Stack the
                <br />
                <span className="bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
                  impossible sky.
                </span>
              </h1>
              <p className="mt-4 max-w-md text-base text-muted-foreground">
                Drop floors with perfect timing. Chain combos. Punch through five
                evolving environments — from neon city to the ocean's deep glow.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link to="/play">
                  <Button
                    size="lg"
                    className="h-14 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-7 text-base font-bold text-background shadow-[0_0_30px_rgba(0,255,255,0.35)] hover:opacity-95"
                  >
                    <Play className="mr-2 h-5 w-5 fill-current" />
                    Play Now
                  </Button>
                </Link>
                <Link to="/leaderboard">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 rounded-full border-white/20 px-5 text-base hover:bg-white/5"
                  >
                    <Trophy className="mr-2 h-4 w-4" />
                    Leaderboard
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <FeaturedTower />
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard icon={<Trophy className="h-4 w-4" />} label="Best Score" value={formatNumber(stats.highScore)} accent="from-amber-400/30" />
            <StatCard icon={<Layers className="h-4 w-4" />} label="Highest Tower" value={`${stats.highestTower} fl`} accent="from-cyan-400/30" />
            <StatCard icon={<Flame className="h-4 w-4" />} label="Best Combo" value={`x${stats.bestCombo}`} accent="from-pink-500/30" />
            <StatCard icon={<Crown className="h-4 w-4" />} label="Runs" value={stats.totalRuns.toString()} accent="from-fuchsia-500/30" />
          </div>
        </div>
      </section>

      {/* Daily challenge */}
      <section className="mx-auto max-w-5xl px-5 pb-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Daily Challenge</h2>
          <span className="text-xs text-muted-foreground">
            Resets in {hoursUntilMidnight()}h
          </span>
        </div>
        <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-fuchsia-700/20 via-card to-cyan-700/15 p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-fuchsia-500/20 text-fuchsia-300">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-300">Today's mission</p>
              <p className="mt-1 font-display text-lg font-semibold leading-tight">{dailyChallenge.title}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{dailyChallenge.description}</p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-1 rounded-full bg-amber-300/15 px-2.5 py-1 text-xs font-bold text-amber-300">
                <Coins className="h-3.5 w-3.5" /> +{dailyChallenge.reward}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Environments */}
      <section className="mx-auto max-w-5xl px-5 pb-10">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold">Environments</h2>
            <p className="text-sm text-muted-foreground">Reach the floor count to unlock the next sky.</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {ENVIRONMENTS.map((env) => {
            const unlocked = stats.highestTower >= env.unlockFloor;
            return (
              <div
                key={env.id}
                className={cn(
                  "group relative overflow-hidden rounded-xl border border-border p-3 transition",
                  unlocked ? "" : "opacity-70"
                )}
                style={{
                  background: `linear-gradient(160deg, ${env.skyTop}, ${env.skyBottom})`,
                }}
              >
                <div className="flex h-24 items-end">
                  <MiniTower env={env} unlocked={unlocked} />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="font-display text-sm font-semibold text-white">{env.name}</p>
                    <p className="text-[10px] uppercase tracking-wider text-white/70">
                      Floor {env.unlockFloor}+
                    </p>
                  </div>
                  {!unlocked && <Lock className="h-3.5 w-3.5 text-white/70" />}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Achievements */}
      <section className="mx-auto max-w-5xl px-5 pb-14">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-xl font-semibold">Achievements</h2>
          <span className="text-xs text-muted-foreground">
            {stats.achievements.length}/{ACHIEVEMENTS.length} unlocked
          </span>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {ACHIEVEMENTS.map((a) => {
            const earned = stats.achievements.includes(a.id);
            return (
              <div
                key={a.id}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3 transition",
                  earned ? "border-primary/40 bg-primary/5" : "border-border bg-card/60 opacity-70"
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-xl">
                  {earned ? a.icon : <Lock className="h-4 w-4 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold">{a.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.description}</p>
                </div>
                {earned && <Award className="h-4 w-4 text-primary" />}
              </div>
            );
          })}
        </div>

        <Link
          to="/leaderboard"
          className="mt-6 flex items-center justify-between rounded-xl border border-border bg-card/70 p-4 hover:bg-card"
        >
          <div>
            <p className="font-display text-base font-semibold">Daily & Global Leaderboards</p>
            <p className="text-xs text-muted-foreground">See where you rank among the architects.</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </section>

      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        <Wind className="mx-auto mb-1 h-3.5 w-3.5" />
        Tap. Stack. Soar. — One more run.
      </footer>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-border bg-card/70 p-4")}>
      <div className={cn("pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br opacity-60 blur-2xl", accent)} />
      <div className="relative">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {icon}
          {label}
        </div>
        <div className="mt-1 font-display text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
}

function LogoMark() {
  return (
    <div className="relative flex h-8 w-8 items-end justify-center overflow-hidden rounded-lg bg-gradient-to-br from-cyan-400 to-fuchsia-500 p-1">
      <div className="h-2 w-5 rounded-sm bg-white/90" />
      <div className="absolute bottom-3 h-2 w-3 rounded-sm bg-white/90" />
      <div className="absolute bottom-5 h-1.5 w-2 rounded-sm bg-white/90" />
    </div>
  );
}

function FeaturedTower() {
  // Decorative stylized stack
  const blocks = [
    { w: 100, hue: 180, x: 0 },
    { w: 96, hue: 200, x: 4 },
    { w: 88, hue: 250, x: 0 },
    { w: 80, hue: 300, x: -4 },
    { w: 72, hue: 320, x: 0 },
    { w: 64, hue: 30, x: 6 },
    { w: 58, hue: 50, x: 0 },
  ];
  return (
    <div className="relative mx-auto h-[260px] w-full max-w-[260px]">
      <div className="absolute inset-x-0 bottom-0 mx-auto flex flex-col-reverse items-center">
        {blocks.map((b, i) => (
          <div
            key={i}
            className="mt-1 rounded-md shadow-[0_8px_24px_-10px_rgba(0,0,0,0.6)]"
            style={{
              width: b.w + "px",
              height: "22px",
              transform: `translateX(${b.x}px)`,
              background: `linear-gradient(180deg, hsl(${b.hue} 80% 65%), hsl(${b.hue} 70% 38%))`,
            }}
          />
        ))}
      </div>
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur">
        Day 1 • Tower
      </div>
    </div>
  );
}

function MiniTower({ env, unlocked }: { env: { baseHue: number }; unlocked: boolean }) {
  const blocks = [70, 60, 52, 44, 36];
  return (
    <div className="flex w-full flex-col-reverse items-center">
      {blocks.map((w, i) => (
        <div
          key={i}
          className="mt-[2px] rounded-sm"
          style={{
            width: w + "%",
            height: 8,
            background: unlocked
              ? `linear-gradient(180deg, hsl(${env.baseHue} 80% 70%), hsl(${env.baseHue} 70% 35%))`
              : "rgba(255,255,255,0.15)",
          }}
        />
      ))}
    </div>
  );
}

function hoursUntilMidnight() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setHours(24, 0, 0, 0);
  return Math.max(1, Math.round((tomorrow.getTime() - now.getTime()) / 3600000));
}

function generateDaily() {
  // Deterministic daily challenge based on YYYY-MM-DD
  const today = new Date();
  const key = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  const seed = [...key].reduce((s, c) => s + c.charCodeAt(0), 0);
  const challenges = [
    { title: "Reach 25 floors in one run", description: "No do-overs. Stack steady, stack tall.", reward: 50 },
    { title: "Chain a 5x combo", description: "Land five perfect drops in a row.", reward: 40 },
    { title: "Earn 200 points", description: "Use combos to multiply your score.", reward: 60 },
    { title: "Survive past the Snow line", description: "Reach floor 20 to enter the alpine air.", reward: 70 },
    { title: "Stack 100 floors total", description: "Across as many runs as you need.", reward: 35 },
  ];
  return challenges[seed % challenges.length];
}
