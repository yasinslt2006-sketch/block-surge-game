const KEY = "tower-architect-v1";

export interface GameStats {
  highScore: number;
  highestTower: number;
  totalRuns: number;
  totalFloors: number;
  perfectStacks: number;
  bestCombo: number;
  coins: number;
  achievements: string[];
  settings: {
    sound: boolean;
    haptics: boolean;
  };
  runs: RunRecord[];
}

export interface RunRecord {
  date: string;
  score: number;
  floors: number;
  bestCombo: number;
}

const DEFAULT: GameStats = {
  highScore: 0,
  highestTower: 0,
  totalRuns: 0,
  totalFloors: 0,
  perfectStacks: 0,
  bestCombo: 0,
  coins: 0,
  achievements: [],
  settings: { sound: true, haptics: true },
  runs: [],
};

export function loadStats(): GameStats {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT, ...parsed, settings: { ...DEFAULT.settings, ...(parsed.settings ?? {}) } };
  } catch {
    return DEFAULT;
  }
}

export function saveStats(stats: GameStats) {
  try {
    localStorage.setItem(KEY, JSON.stringify(stats));
  } catch {
    // ignore quota errors
  }
}

export function recordRun(
  prev: GameStats,
  run: { score: number; floors: number; bestCombo: number; perfectStacks: number; coinsEarned: number }
): GameStats {
  const next: GameStats = {
    ...prev,
    highScore: Math.max(prev.highScore, run.score),
    highestTower: Math.max(prev.highestTower, run.floors),
    totalRuns: prev.totalRuns + 1,
    totalFloors: prev.totalFloors + run.floors,
    perfectStacks: prev.perfectStacks + run.perfectStacks,
    bestCombo: Math.max(prev.bestCombo, run.bestCombo),
    coins: prev.coins + run.coinsEarned,
    runs: [
      { date: new Date().toISOString(), score: run.score, floors: run.floors, bestCombo: run.bestCombo },
      ...prev.runs,
    ].slice(0, 25),
  };

  // Achievements
  const ach = new Set(next.achievements);
  if (run.floors >= 5) ach.add("first-five");
  if (run.floors >= 25) ach.add("quarter-century");
  if (run.floors >= 50) ach.add("half-ton");
  if (run.bestCombo >= 5) ach.add("combo-streak");
  if (run.bestCombo >= 15) ach.add("combo-master");
  if (next.totalRuns >= 10) ach.add("dedicated");
  if (next.totalRuns >= 50) ach.add("addicted");
  if (run.floors >= 40) ach.add("ocean-bound");
  next.achievements = Array.from(ach);

  saveStats(next);
  return next;
}
