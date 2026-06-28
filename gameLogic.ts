import { Environment, getEnvironmentForFloor } from "./environments";

export interface Floor {
  x: number;
  width: number;
  // World-space y from the ground; ground=0, grows upward
  y: number;
  height: number;
  hue: number;
  saturation: number;
  lightness: number;
  // For collapse animation
  vx: number;
  vy: number;
  rotation: number;
  vr: number;
}

export interface ActiveFloor {
  x: number;
  width: number;
  height: number;
  direction: 1 | -1;
  speed: number;
  hue: number;
  saturation: number;
  lightness: number;
}

export interface GameState {
  status: "ready" | "playing" | "gameover";
  floors: Floor[];
  active: ActiveFloor | null;
  // World camera offset (how much we've scrolled up)
  cameraY: number;
  cameraTargetY: number;
  // Width of the world (canvas width)
  worldWidth: number;
  worldHeight: number;
  // Score
  score: number;
  combo: number;
  bestCombo: number;
  perfectStacks: number;
  coinsEarned: number;
  // Floor count (>= 1 after first drop)
  floorCount: number;
  // Effects
  flashTime: number;
  shakeTime: number;
  shakeMagnitude: number;
  // Floating score popups
  popups: ScorePopup[];
  // Falling chips from miss cuts
  chips: Floor[];
  // Wind/challenge
  windForce: number;
  windPhase: number;
  // Current environment
  environment: Environment;
}

export interface ScorePopup {
  x: number;
  y: number;
  text: string;
  age: number;
  life: number;
  color: string;
}

export const FLOOR_HEIGHT = 28;
export const INITIAL_WIDTH_RATIO = 0.55;
export const PERFECT_THRESHOLD = 4; // px difference allowed
export const BASE_SPEED = 2.4;
export const MAX_SPEED = 7.8;
export const PERFECT_REWARD = 4; // px added back on perfect

export function createInitialState(worldWidth: number, worldHeight: number): GameState {
  const env = getEnvironmentForFloor(0);
  const baseWidth = Math.round(worldWidth * INITIAL_WIDTH_RATIO);
  const baseX = (worldWidth - baseWidth) / 2;

  const baseFloor: Floor = {
    x: baseX,
    y: 0,
    width: baseWidth,
    height: FLOOR_HEIGHT * 2.2,
    hue: env.baseHue,
    saturation: 70,
    lightness: 35,
    vx: 0,
    vy: 0,
    rotation: 0,
    vr: 0,
  };

  return {
    status: "ready",
    floors: [baseFloor],
    active: spawnActive(baseFloor, env, 0, worldWidth),
    cameraY: 0,
    cameraTargetY: 0,
    worldWidth,
    worldHeight,
    score: 0,
    combo: 0,
    bestCombo: 0,
    perfectStacks: 0,
    coinsEarned: 0,
    floorCount: 0,
    flashTime: 0,
    shakeTime: 0,
    shakeMagnitude: 0,
    popups: [],
    chips: [],
    windForce: 0,
    windPhase: 0,
    environment: env,
  };
}

function spawnActive(prev: Floor, env: Environment, floorCount: number, worldWidth: number): ActiveFloor {
  const speed = Math.min(BASE_SPEED + floorCount * 0.08, MAX_SPEED);
  const hue = env.baseHue + (Math.sin(floorCount * 0.7) * 0.5 + 0.5) * env.hueRange;
  const lightness = 55 + (floorCount % 3) * 4;
  // Alternate sides
  const fromLeft = floorCount % 2 === 0;
  return {
    x: fromLeft ? -prev.width : worldWidth,
    width: prev.width,
    height: FLOOR_HEIGHT,
    direction: fromLeft ? 1 : -1,
    speed,
    hue,
    saturation: 78,
    lightness,
  };
}

export function updateState(state: GameState, dt: number) {
  // dt in ms approx 16
  if (state.status === "playing" && state.active) {
    // Wind challenge - kicks in after floor 15
    if (state.floorCount >= 15) {
      state.windPhase += dt * 0.0008;
      state.windForce = Math.sin(state.windPhase) * Math.min(0.6, (state.floorCount - 15) * 0.04);
    } else {
      state.windForce = 0;
    }

    state.active.x += state.active.direction * state.active.speed + state.windForce;
    if (state.active.direction === 1 && state.active.x >= state.worldWidth) {
      state.active.direction = -1;
    } else if (state.active.direction === -1 && state.active.x + state.active.width <= 0) {
      state.active.direction = 1;
    }
  }

  // Camera smoothing
  state.cameraY += (state.cameraTargetY - state.cameraY) * Math.min(1, dt / 140);

  // Effects decay
  if (state.flashTime > 0) state.flashTime = Math.max(0, state.flashTime - dt);
  if (state.shakeTime > 0) state.shakeTime = Math.max(0, state.shakeTime - dt);

  // Popups
  for (const p of state.popups) p.age += dt;
  state.popups = state.popups.filter((p) => p.age < p.life);

  // Chips (falling cut pieces)
  for (const c of state.chips) {
    c.vy += 0.6;
    c.x += c.vx;
    c.y -= c.vy; // world y goes upward; falling means y decreases visually below ground
    c.rotation += c.vr;
  }
  state.chips = state.chips.filter((c) => c.y > -800);

  // Collapse falling floors when game over
  if (state.status === "gameover") {
    for (const f of state.floors) {
      f.vy += 0.5;
      f.y -= f.vy;
      f.x += f.vx;
      f.rotation += f.vr;
    }
  }
}

export interface DropResult {
  kind: "perfect" | "good" | "miss";
  scoreGained: number;
  combo: number;
}

export function dropActive(state: GameState): DropResult {
  if (!state.active || state.status !== "playing") {
    return { kind: "miss", scoreGained: 0, combo: state.combo };
  }
  const active = state.active;
  const last = state.floors[state.floors.length - 1];

  const overlapStart = Math.max(active.x, last.x);
  const overlapEnd = Math.min(active.x + active.width, last.x + last.width);
  const overlap = overlapEnd - overlapStart;

  if (overlap <= 0) {
    // Miss - game over
    state.status = "gameover";
    // Add the active piece as a falling chip
    state.chips.push({
      x: active.x,
      y: last.y + last.height + FLOOR_HEIGHT,
      width: active.width,
      height: FLOOR_HEIGHT,
      hue: active.hue,
      saturation: active.saturation,
      lightness: active.lightness,
      vx: active.direction * 2,
      vy: -2,
      rotation: 0,
      vr: (Math.random() - 0.5) * 0.1,
    });
    // Detach the floors so they tumble
    for (const f of state.floors) {
      f.vx = (Math.random() - 0.5) * 1.2;
      f.vy = -Math.random() * 2;
      f.vr = (Math.random() - 0.5) * 0.06;
    }
    state.shakeTime = 600;
    state.shakeMagnitude = 14;
    state.active = null;
    return { kind: "miss", scoreGained: 0, combo: 0 };
  }

  const diff = Math.abs(active.x - last.x);
  const isPerfect = diff <= PERFECT_THRESHOLD;

  let newX: number;
  let newWidth: number;

  if (isPerfect) {
    // Snap perfectly, optionally add small width bonus (capped to initial)
    newX = last.x;
    newWidth = Math.min(last.width + PERFECT_REWARD, state.worldWidth * INITIAL_WIDTH_RATIO);
  } else {
    newX = overlapStart;
    newWidth = overlap;

    // Spawn falling chip from the cut-off side
    const cutLeft = active.x < last.x;
    const chipX = cutLeft ? active.x : last.x + last.width;
    const chipWidth = active.width - overlap;
    state.chips.push({
      x: chipX,
      y: last.y + last.height + FLOOR_HEIGHT,
      width: chipWidth,
      height: FLOOR_HEIGHT,
      hue: active.hue,
      saturation: active.saturation,
      lightness: active.lightness,
      vx: cutLeft ? -1.5 : 1.5,
      vy: 0,
      rotation: 0,
      vr: (Math.random() - 0.5) * 0.08,
    });
  }

  const newFloor: Floor = {
    x: newX,
    y: last.y + last.height,
    width: newWidth,
    height: FLOOR_HEIGHT,
    hue: active.hue,
    saturation: active.saturation,
    lightness: active.lightness,
    vx: 0,
    vy: 0,
    rotation: 0,
    vr: 0,
  };
  state.floors.push(newFloor);
  state.floorCount += 1;

  // Combo
  if (isPerfect) {
    state.combo += 1;
    state.perfectStacks += 1;
    state.flashTime = 280;
    state.shakeTime = 90;
    state.shakeMagnitude = 4;
  } else {
    state.combo = 0;
  }
  state.bestCombo = Math.max(state.bestCombo, state.combo);

  // Score
  const baseScore = isPerfect ? 10 : 3;
  const comboMult = isPerfect ? Math.max(1, state.combo) : 1;
  const gained = baseScore * comboMult;
  state.score += gained;
  state.coinsEarned += isPerfect ? 2 : 1;

  // Popup
  state.popups.push({
    x: newX + newWidth / 2,
    y: newFloor.y + newFloor.height + 18,
    text: isPerfect ? `PERFECT! +${gained}` : `+${gained}`,
    age: 0,
    life: 900,
    color: isPerfect ? "#fff45a" : "#a0f5d8",
  });

  // Update environment
  const newEnv = getEnvironmentForFloor(state.floorCount);
  if (newEnv.id !== state.environment.id) {
    state.environment = newEnv;
    state.popups.push({
      x: state.worldWidth / 2,
      y: newFloor.y + newFloor.height + 80,
      text: `${newEnv.name.toUpperCase()} UNLOCKED`,
      age: 0,
      life: 1600,
      color: "#7ef9ff",
    });
  }

  // Camera scrolls so active floor stays near top of viewport
  const targetCamera = Math.max(0, newFloor.y - state.worldHeight * 0.55);
  state.cameraTargetY = targetCamera;

  // Spawn next active
  state.active = spawnActive(newFloor, state.environment, state.floorCount, state.worldWidth);

  return { kind: isPerfect ? "perfect" : "good", scoreGained: gained, combo: state.combo };
}

export function startPlaying(state: GameState) {
  state.status = "playing";
}
