export type EnvironmentId = "city" | "desert" | "snow" | "space" | "ocean";

export interface Environment {
  id: EnvironmentId;
  name: string;
  unlockFloor: number;
  // Sky gradient stops
  skyTop: string;
  skyBottom: string;
  // Floor base color (HSL hue rotates per floor)
  baseHue: number;
  hueRange: number;
  // Decorative accent
  accent: string;
  description: string;
}

export const ENVIRONMENTS: Environment[] = [
  {
    id: "city",
    name: "City",
    unlockFloor: 0,
    skyTop: "#0b1a3a",
    skyBottom: "#2a4d8f",
    baseHue: 195,
    hueRange: 40,
    accent: "#ffd166",
    description: "Glass towers under a midnight skyline.",
  },
  {
    id: "desert",
    name: "Desert",
    unlockFloor: 10,
    skyTop: "#3a1d12",
    skyBottom: "#e6884a",
    baseHue: 28,
    hueRange: 24,
    accent: "#ffe1a8",
    description: "Sandstone monoliths in golden dusk.",
  },
  {
    id: "snow",
    name: "Snow",
    unlockFloor: 20,
    skyTop: "#1a2c40",
    skyBottom: "#cfe7f5",
    baseHue: 200,
    hueRange: 30,
    accent: "#ffffff",
    description: "Frosted crystal columns in alpine air.",
  },
  {
    id: "space",
    name: "Space",
    unlockFloor: 30,
    skyTop: "#02010a",
    skyBottom: "#2d0b54",
    baseHue: 280,
    hueRange: 60,
    accent: "#7ef9ff",
    description: "Nebula towers piercing the void.",
  },
  {
    id: "ocean",
    name: "Ocean",
    unlockFloor: 40,
    skyTop: "#001a2c",
    skyBottom: "#0f6a8b",
    baseHue: 175,
    hueRange: 40,
    accent: "#a0f5d8",
    description: "Coral spires rising from the deep.",
  },
];

export function getEnvironmentForFloor(floor: number): Environment {
  let current = ENVIRONMENTS[0];
  for (const env of ENVIRONMENTS) {
    if (floor >= env.unlockFloor) current = env;
  }
  return current;
}

export function getNextEnvironment(floor: number): Environment | null {
  for (const env of ENVIRONMENTS) {
    if (env.unlockFloor > floor) return env;
  }
  return null;
}
