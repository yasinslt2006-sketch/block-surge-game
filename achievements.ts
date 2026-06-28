export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-five", name: "First Steps", description: "Stack 5 floors in a single run.", icon: "👣" },
  { id: "quarter-century", name: "Quarter Century", description: "Reach 25 floors.", icon: "🏙️" },
  { id: "half-ton", name: "Half Ton", description: "Reach 50 floors.", icon: "🗼" },
  { id: "combo-streak", name: "Combo Streak", description: "Land a 5x combo.", icon: "🔥" },
  { id: "combo-master", name: "Combo Master", description: "Land a 15x combo.", icon: "⚡" },
  { id: "dedicated", name: "Dedicated", description: "Play 10 runs.", icon: "🎯" },
  { id: "addicted", name: "One More Run", description: "Play 50 runs.", icon: "♾️" },
  { id: "ocean-bound", name: "Ocean Bound", description: "Reach the Ocean environment.", icon: "🌊" },
];
