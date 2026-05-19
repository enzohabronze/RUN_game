import { assetManifest } from "./assetManifest.js";
import { gameText } from "./text.js";
import {
  buildFutureLeaderboardRows,
  createFutureProgressState,
  futureFeatures,
  futurePickupCatalog,
  loadFutureProgress,
  recordFutureRunResult,
  saveFutureProgress,
  unlockFutureLevel
} from "./futureFeatures.js";

const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

const VIRTUAL_WIDTH = 405;
const VIRTUAL_HEIGHT = 720;
const ROAD_LEFT = 68;
const ROAD_RIGHT = 337;
const ROAD_WIDTH = ROAD_RIGHT - ROAD_LEFT;
const LANE_WIDTH = ROAD_WIDTH / 3;
const LANES = [ROAD_LEFT + LANE_WIDTH * 0.5, VIRTUAL_WIDTH / 2, ROAD_RIGHT - LANE_WIDTH * 0.5];
const TOP_LANES = [166, 202.5, 239];
const PLAYER_Y = 570;
const PLAYER_HITBOX = { width: 52, height: 74, bottomOffset: 4 };
const PLAYER_DRAW_HEIGHT = 112;
const PLAYER_FALLBACK_ASPECT = 0.633;
const OBSTACLE_HITBOX = { scaleX: 0.72, scaleY: 0.58, bottomOffset: 5 };
const BASE_SPEED = 210;
const GROUND_TOP_SCALE = 0.48;
const GROUND_BOTTOM_SCALE = 1.2;
const DECOR_TOP_SCALE = 0.72;
const DECOR_BOTTOM_SCALE = 0.98;

const levels = [
  {
    name: "ЛЕСНАЯ ДОРОГА",
    distanceGoal: 1300,
    itemGoal: 6,
    speedBonus: 0,
    obstacleUnlock: ["obstacle-1-lvl1", "obstacle-2-lvl1", "obstacle-3-lvl1"],
    pickupUnlock: ["item-1-lvl1", "item-2-lvl1"],
    obstacleInterval: 1.35,
    pickupInterval: 1.4,
    finishLabel: "ЛЕСНАЯ ЗАСТАВА",
    finishColor: "#57c7a2",
    theme: { grass: "#254531", road: "#3f3d39", edge: "#54514a", skyTop: "#213c33", skyBottom: "#101716" }
  },
  {
    name: "СТАРАЯ ПРОСЕКА",
    distanceGoal: 1650,
    itemGoal: 8,
    speedBonus: 22,
    obstacleUnlock: ["obstacle-1-lvl2", "obstacle-2-lvl2", "obstacle-3-lvl2"],
    pickupUnlock: ["item-1-lvl2", "item-2-lvl2"],
    obstacleInterval: 1.18,
    pickupInterval: 1.3,
    finishLabel: "СТАРЫЙ МОСТ",
    finishColor: "#d9a54b",
    theme: { grass: "#31472e", road: "#45413a", edge: "#625d50", skyTop: "#394b33", skyBottom: "#151914" }
  },
  {
    name: "РЕМОНТНЫЙ УЧАСТОК",
    distanceGoal: 2000,
    itemGoal: 10,
    speedBonus: 45,
    obstacleUnlock: ["obstacle-1-lvl3", "obstacle-2-lvl3", "obstacle-3-lvl3", "obstacle-4-lvl3"],
    pickupUnlock: ["item-1-lvl3", "item-2-lvl3"],
    obstacleInterval: 1.02,
    pickupInterval: 1.22,
    finishLabel: "РЕМОНТНЫЙ ПОСТ",
    finishColor: "#f0c15a",
    theme: { grass: "#263943", road: "#46484a", edge: "#65615b", skyTop: "#2b4653", skyBottom: "#10181c" }
  },
  {
    name: "МАСЛЯНЫЙ СПУСК",
    distanceGoal: 2400,
    itemGoal: 12,
    speedBonus: 64,
    obstacleUnlock: ["obstacle-1-lvl4", "obstacle-2-lvl4", "obstacle-3-lvl4", "obstacle-4-lvl4"],
    pickupUnlock: ["item-1-lvl4", "item-2-lvl4"],
    obstacleInterval: 0.92,
    pickupInterval: 1.16,
    finishLabel: "МОЙКА ГРУЗА",
    finishColor: "#57b8ff",
    theme: { grass: "#263837", road: "#3b403f", edge: "#59584e", skyTop: "#245052", skyBottom: "#0f1717" }
  },
  {
    name: "СКЛАДСКОЙ КОРИДОР",
    distanceGoal: 2700,
    itemGoal: 13,
    speedBonus: 78,
    obstacleUnlock: ["obstacle-1-lvl5", "obstacle-2-lvl5", "obstacle-3-lvl5", "obstacle-4-lvl5"],
    pickupUnlock: ["item-1-lvl5", "item-2-lvl5"],
    obstacleInterval: 0.88,
    pickupInterval: 1.12,
    finishLabel: "ЗОНА ПОГРУЗКИ",
    finishColor: "#b28cff",
    theme: { grass: "#30333a", road: "#42454d", edge: "#676b75", skyTop: "#39404a", skyBottom: "#14171b" }
  },
  {
    name: "РЫНОЧНЫЙ РЯД",
    distanceGoal: 3000,
    itemGoal: 15,
    speedBonus: 92,
    obstacleUnlock: ["obstacle-1-lvl6", "obstacle-2-lvl6", "obstacle-3-lvl6", "obstacle-4-lvl6"],
    pickupUnlock: ["item-1-lvl6", "item-2-lvl6"],
    obstacleInterval: 0.84,
    pickupInterval: 1.08,
    finishLabel: "ТОРГОВАЯ ПЛОЩАДЬ",
    finishColor: "#ff8f5a",
    theme: { grass: "#3d3430", road: "#4d3f39", edge: "#725c4f", skyTop: "#6b4a39", skyBottom: "#1c1411" }
  },
  {
    name: "СНЕЖНАЯ ТРОПА",
    distanceGoal: 3300,
    itemGoal: 16,
    speedBonus: 104,
    obstacleUnlock: ["obstacle-1-lvl7", "obstacle-2-lvl7", "obstacle-3-lvl7", "obstacle-4-lvl7"],
    pickupUnlock: ["item-1-lvl7", "item-2-lvl7"],
    obstacleInterval: 0.8,
    pickupInterval: 1.04,
    finishLabel: "ТЕПЛЫЙ СКЛАД",
    finishColor: "#bcecff",
    theme: { grass: "#d9e7e8", road: "#9daeb2", edge: "#c8d5d7", skyTop: "#8fb5c0", skyBottom: "#263c44" }
  },
  {
    name: "НОЧНАЯ ДОСТАВКА",
    distanceGoal: 3600,
    itemGoal: 18,
    speedBonus: 116,
    obstacleUnlock: ["obstacle-1-lvl8", "obstacle-2-lvl8", "obstacle-3-lvl8", "obstacle-4-lvl8"],
    pickupUnlock: ["item-1-lvl8", "item-2-lvl8"],
    obstacleInterval: 0.76,
    pickupInterval: 1,
    finishLabel: "СВЕТЛЫЙ ДВОР",
    finishColor: "#f6e27a",
    theme: { grass: "#151a24", road: "#232838", edge: "#3a4054", skyTop: "#141a2d", skyBottom: "#06080d" }
  },
  {
    name: "ПОРТОВЫЙ ПРИЧАЛ",
    distanceGoal: 3900,
    itemGoal: 20,
    speedBonus: 128,
    obstacleUnlock: ["obstacle-1-lvl9", "obstacle-2-lvl9", "obstacle-3-lvl9", "obstacle-4-lvl9"],
    pickupUnlock: ["item-1-lvl9", "item-2-lvl9"],
    obstacleInterval: 0.72,
    pickupInterval: 0.98,
    finishLabel: "КРАН У ПРИЧАЛА",
    finishColor: "#42d6c9",
    theme: { grass: "#1b3b43", road: "#35484d", edge: "#54707a", skyTop: "#1f5664", skyBottom: "#071114" }
  },
  {
    name: "ФИНАЛЬНЫЙ МАРШРУТ",
    distanceGoal: 4300,
    itemGoal: 22,
    speedBonus: 142,
    obstacleUnlock: ["obstacle-1-lvl10", "obstacle-2-lvl10", "obstacle-3-lvl10", "obstacle-4-lvl10", "obstacle-5-lvl10"],
    pickupUnlock: ["item-1-lvl10", "item-2-lvl10"],
    obstacleInterval: 0.68,
    pickupInterval: 0.94,
    finishLabel: "ГЛАВНЫЙ СКЛАД",
    finishColor: "#ffffff",
    theme: { grass: "#2e2a35", road: "#3f3947", edge: "#665d72", skyTop: "#4a3b5e", skyBottom: "#100c16" }
  }
];

const ui = {
  mainMenu: document.querySelector("#mainMenu"),
  pauseMenu: document.querySelector("#pauseMenu"),
  gameOverMenu: document.querySelector("#gameOverMenu"),
  levelCompleteMenu: document.querySelector("#levelCompleteMenu"),
  howMenu: document.querySelector("#howMenu"),
  levelTestGrid: document.querySelector("#levelTestGrid"),
  cargoText: document.querySelector("#cargoText"),
  cargoFill: document.querySelector("#cargoFill"),
  itemsText: document.querySelector("#itemsText"),
  distanceText: document.querySelector("#distanceText"),
  levelText: document.querySelector("#levelText"),
  soundButton: document.querySelector("#soundButton"),
  finalStats: document.querySelector("#finalStats"),
  gameOverTitle: document.querySelector("#gameOverTitle"),
  levelCompleteTitle: document.querySelector("#levelCompleteTitle"),
  levelStats: document.querySelector("#levelStats"),
  starsText: document.querySelector("#starsText")
};

const hudIcons = {
  cargo: document.querySelector("#cargoIcon"),
  items: document.querySelector("#itemsIcon"),
  route: document.querySelector("#routeIcon"),
  level: document.querySelector("#levelIcon"),
  pause: document.querySelector("#pauseIcon")
};

const buttons = {
  start: document.querySelector("#startButton"),
  how: document.querySelector("#howButton"),
  closeHow: document.querySelector("#closeHowButton"),
  pause: document.querySelector("#pauseButton"),
  resume: document.querySelector("#resumeButton"),
  restartPause: document.querySelector("#restartFromPauseButton"),
  pauseBackToMenu: document.querySelector("#pauseBackToMenuButton"),
  restart: document.querySelector("#restartButton"),
  backToMenu: document.querySelector("#backToMenuButton"),
  nextLevel: document.querySelector("#nextLevelButton"),
  replayLevel: document.querySelector("#replayLevelButton"),
  completeBackToMenu: document.querySelector("#completeBackToMenuButton")
};

const obstacleRules = {
  "obstacle-1-lvl1": { width: 80, height: 58, cargoDamage: 10, scorePenalty: 35, lanesWide: 1 },
  "obstacle-2-lvl1": { width: 76, height: 70, cargoDamage: 14, scorePenalty: 45, lanesWide: 1 },
  "obstacle-3-lvl1": { width: 80, height: 72, cargoDamage: 22, scorePenalty: 80, lanesWide: 2 },
  "obstacle-1-lvl2": { width: 72, height: 70, cargoDamage: 12, scorePenalty: 40, lanesWide: 1 },
  "obstacle-2-lvl2": { width: 82, height: 54, cargoDamage: 8, scorePenalty: 35, lanesWide: 1, oil: true, hitboxScaleX: 0.9, hitboxScaleY: 0.62 },
  "obstacle-3-lvl2": { width: 82, height: 82, cargoDamage: 24, scorePenalty: 85, lanesWide: 2 },
  "obstacle-1-lvl3": { width: 54, height: 62, cargoDamage: 8, scorePenalty: 30, lanesWide: 1 },
  "obstacle-2-lvl3": { width: 58, height: 72, cargoDamage: 20, scorePenalty: 70, lanesWide: 2 },
  "obstacle-3-lvl3": { width: 86, height: 66, cargoDamage: 24, scorePenalty: 90, lanesWide: 2 },
  "obstacle-4-lvl3": { width: 82, height: 58, cargoDamage: 16, scorePenalty: 55, lanesWide: 1 },
  "obstacle-1-lvl4": { width: 70, height: 56, cargoDamage: 10, scorePenalty: 40, lanesWide: 1, oil: true, hitboxScaleX: 0.9, hitboxScaleY: 0.62 },
  "obstacle-2-lvl4": { width: 78, height: 78, cargoDamage: 18, scorePenalty: 60, lanesWide: 1 },
  "obstacle-3-lvl4": { width: 80, height: 58, cargoDamage: 15, scorePenalty: 55, lanesWide: 2, oil: true, hitboxScaleX: 0.9, hitboxScaleY: 0.62 },
  "obstacle-4-lvl4": { width: 86, height: 66, cargoDamage: 24, scorePenalty: 90, lanesWide: 2 },
  "obstacle-1-lvl5": { width: 80, height: 78, cargoDamage: 22, scorePenalty: 80, lanesWide: 2 },
  "obstacle-2-lvl5": { width: 82, height: 78, cargoDamage: 18, scorePenalty: 60, lanesWide: 1 },
  "obstacle-3-lvl5": { width: 84, height: 74, cargoDamage: 28, scorePenalty: 110, lanesWide: 3 },
  "obstacle-4-lvl5": { width: 74, height: 58, cargoDamage: 10, scorePenalty: 40, lanesWide: 1, oil: true, hitboxScaleX: 0.9, hitboxScaleY: 0.62 },
  "obstacle-1-lvl6": { width: 74, height: 66, cargoDamage: 10, scorePenalty: 40, lanesWide: 1 },
  "obstacle-2-lvl6": { width: 76, height: 72, cargoDamage: 20, scorePenalty: 70, lanesWide: 2 },
  "obstacle-3-lvl6": { width: 64, height: 92, cargoDamage: 18, scorePenalty: 65, lanesWide: 1, hitboxScaleX: 0.66, hitboxScaleY: 0.72 },
  "obstacle-4-lvl6": { width: 82, height: 70, cargoDamage: 26, scorePenalty: 100, lanesWide: 3 },
  "obstacle-1-lvl7": { width: 82, height: 58, cargoDamage: 10, scorePenalty: 35, lanesWide: 1 },
  "obstacle-2-lvl7": { width: 78, height: 54, cargoDamage: 12, scorePenalty: 50, lanesWide: 2, oil: true, hitboxScaleX: 0.9, hitboxScaleY: 0.62 },
  "obstacle-3-lvl7": { width: 82, height: 70, cargoDamage: 23, scorePenalty: 80, lanesWide: 2 },
  "obstacle-4-lvl7": { width: 84, height: 76, cargoDamage: 30, scorePenalty: 115, lanesWide: 3 },
  "obstacle-1-lvl8": { width: 58, height: 68, cargoDamage: 10, scorePenalty: 35, lanesWide: 1 },
  "obstacle-2-lvl8": { width: 58, height: 76, cargoDamage: 20, scorePenalty: 75, lanesWide: 2 },
  "obstacle-3-lvl8": { width: 66, height: 98, cargoDamage: 20, scorePenalty: 70, lanesWide: 1, hitboxScaleX: 0.66, hitboxScaleY: 0.72 },
  "obstacle-4-lvl8": { width: 84, height: 78, cargoDamage: 32, scorePenalty: 120, lanesWide: 3 },
  "obstacle-1-lvl9": { width: 72, height: 58, cargoDamage: 10, scorePenalty: 40, lanesWide: 1, oil: true, hitboxScaleX: 0.9, hitboxScaleY: 0.62 },
  "obstacle-2-lvl9": { width: 80, height: 56, cargoDamage: 16, scorePenalty: 60, lanesWide: 2 },
  "obstacle-3-lvl9": { width: 62, height: 82, cargoDamage: 22, scorePenalty: 85, lanesWide: 2 },
  "obstacle-4-lvl9": { width: 84, height: 72, cargoDamage: 28, scorePenalty: 110, lanesWide: 3 },
  "obstacle-1-lvl10": { width: 82, height: 84, cargoDamage: 34, scorePenalty: 130, lanesWide: 3 },
  "obstacle-2-lvl10": { width: 70, height: 56, cargoDamage: 10, scorePenalty: 40, lanesWide: 1, oil: true, hitboxScaleX: 0.9, hitboxScaleY: 0.62 },
  "obstacle-3-lvl10": { width: 84, height: 74, cargoDamage: 28, scorePenalty: 110, lanesWide: 3 },
  "obstacle-4-lvl10": { width: 84, height: 78, cargoDamage: 32, scorePenalty: 120, lanesWide: 3 },
  "obstacle-5-lvl10": { width: 84, height: 72, cargoDamage: 28, scorePenalty: 110, lanesWide: 3 }
};
const pickupRules = {
  "item-1-lvl1": { radius: 25, score: 120, items: 1 },
  "item-2-lvl1": { radius: 23, score: 95, items: 1 },
  "item-1-lvl2": { radius: 24, score: 110, items: 1 },
  "item-2-lvl2": { radius: 24, score: 60, cargo: 18 },
  "item-1-lvl3": { radius: 22, score: 105, items: 1 },
  "item-2-lvl3": { radius: 24, score: 60, cargo: 18 },
  "item-1-lvl4": { radius: 25, score: 120, items: 1 },
  "item-2-lvl4": { radius: 23, score: 90, cargo: 12 },
  "item-1-lvl5": { radius: 24, score: 130, items: 1 },
  "item-2-lvl5": { radius: 24, score: 60, cargo: 18 },
  "item-1-lvl6": { radius: 24, score: 125, items: 1 },
  "item-2-lvl6": { radius: 21, score: 150, items: 1 },
  "item-1-lvl7": { radius: 23, score: 120, items: 1 },
  "item-2-lvl7": { radius: 24, score: 60, cargo: 18 },
  "item-1-lvl8": { radius: 23, score: 130, items: 1 },
  "item-2-lvl8": { radius: 25, score: 120, items: 1 },
  "item-1-lvl9": { radius: 24, score: 135, items: 1 },
  "item-2-lvl9": { radius: 24, score: 60, cargo: 18 },
  "item-1-lvl10": { radius: 26, score: 180, items: 1 },
  "item-2-lvl10": { radius: 24, score: 60, cargo: 18 }
};

const futureProgress = futureFeatures.levelSelect || futureFeatures.characterSelect
  ? loadFutureProgress(levels.length)
  : createFutureProgressState(levels.length);

const state = {
  mode: "menu",
  levelIndex: 0,
  playerLane: 1,
  playerX: LANES[1],
  targetX: LANES[1],
  cargo: 100,
  damageTaken: 0,
  score: 0,
  collected: 0,
  distance: 0,
  speed: BASE_SPEED,
  roadOffset: 0,
  spawnTimer: 0,
  pickupTimer: 0,
  decorTimer: 0,
  invuln: 0,
  oilTimer: 0,
  turnTimer: 0,
  turnDirection: 0,
  hitTimer: 0,
  shakeTimer: 0,
  flashTimer: 0,
  levelIntroTimer: 0,
  dustTimer: 0,
  cargoLowSoundPlayed: false,
  entities: [],
  decor: [],
  particles: []
};

const sprites = await loadSprites(assetManifest);
const audio = createAudioSystem(assetManifest.audio || {});
applyScreenBackgrounds(sprites.backgrounds || {});
applyUiAssets(assetManifest.ui || {});
applyText();
buildLevelTestButtons();
setupButtonStates();
updateSoundButton();
resizeCanvas();
resetLevel(0);
setMode("menu");
requestAnimationFrame(tick);

buttons.start.addEventListener("click", () => {
  startLevel(0);
});
buttons.how.addEventListener("click", () => setMode("how"));
buttons.closeHow.addEventListener("click", () => setMode("menu"));
buttons.pause.addEventListener("click", togglePause);
buttons.resume.addEventListener("click", () => {
  playSfx("resume");
  setMode("playing");
});
buttons.restartPause.addEventListener("click", replayLevel);
buttons.restart.addEventListener("click", replayLevel);
buttons.pauseBackToMenu.addEventListener("click", backToMainMenu);
buttons.backToMenu.addEventListener("click", backToMainMenu);
buttons.completeBackToMenu.addEventListener("click", backToMainMenu);
buttons.nextLevel.addEventListener("click", nextLevel);
buttons.replayLevel.addEventListener("click", replayLevel);
if (ui.soundButton) ui.soundButton.addEventListener("click", toggleSound);

function backToMainMenu() {
  resetLevel(state.levelIndex);
  setMode("menu");
}

function startLevel(levelIndex) {
  unlockAudio();
  playSfx("start");
  state.levelIndex = levelIndex;
  resetLevel(levelIndex);
  setMode("playing");
}

document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    unlockAudio();
    playSfx("button");
  });
});
window.addEventListener("pointerdown", unlockAudio, { once: true });

window.addEventListener("resize", resizeCanvas);
window.addEventListener("keydown", handleKeyDown);

let touchStartX = 0;
let touchStartY = 0;
canvas.addEventListener("pointerdown", (event) => {
  touchStartX = event.clientX;
  touchStartY = event.clientY;
});

canvas.addEventListener("pointerup", (event) => {
  if (state.mode !== "playing") return;
  const dx = event.clientX - touchStartX;
  const dy = event.clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 24) {
    moveLane(dx > 0 ? 1 : -1);
  }
});

let lastTime = performance.now();
function tick(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.033);
  lastTime = now;

  if (state.mode === "playing") update(dt);
  render();
  requestAnimationFrame(tick);
}

function currentLevel() {
  return levels[state.levelIndex];
}

function resetLevel(levelIndex) {
  state.levelIndex = Math.min(levelIndex, levels.length - 1);
  state.playerLane = 1;
  state.playerX = LANES[1];
  state.targetX = LANES[1];
  state.cargo = 100;
  state.damageTaken = 0;
  state.score = 0;
  state.collected = 0;
  state.distance = 0;
  state.speed = BASE_SPEED + currentLevel().speedBonus;
  state.roadOffset = 0;
  state.spawnTimer = 1.1;
  state.pickupTimer = 0.75;
  state.decorTimer = 0.2;
  state.invuln = 0;
  state.oilTimer = 0;
  state.turnTimer = 0;
  state.turnDirection = 0;
  state.hitTimer = 0;
  state.shakeTimer = 0;
  state.flashTimer = 0;
  state.levelIntroTimer = 2.2;
  state.dustTimer = 0;
  state.cargoLowSoundPlayed = false;
  state.futureMagnetTimer = 0;
  state.entities = [];
  state.decor = [];
  state.particles = [];
  seedDecor();
  updateHud();
}

function replayLevel() {
  resetLevel(state.levelIndex);
  setMode("playing");
}

function nextLevel() {
  if (state.levelIndex < levels.length - 1) {
    resetLevel(state.levelIndex + 1);
    setMode("playing");
    return;
  }

  resetLevel(0);
  setMode("menu");
}

function setMode(mode) {
  state.mode = mode;
  ui.mainMenu.classList.toggle("overlay--active", mode === "menu");
  ui.pauseMenu.classList.toggle("overlay--active", mode === "paused");
  ui.gameOverMenu.classList.toggle("overlay--active", mode === "gameover");
  ui.levelCompleteMenu.classList.toggle("overlay--active", mode === "complete");
  ui.howMenu.classList.toggle("overlay--active", mode === "how");
  updateMusic();
}

function togglePause() {
  if (state.mode === "playing") {
    playSfx("pause");
    setMode("paused");
  } else if (state.mode === "paused") {
    playSfx("resume");
    setMode("playing");
  }
}

function update(dt) {
  const level = currentLevel();
  state.distance = Math.min(level.distanceGoal, state.distance + (state.speed * dt) / 5);
  state.speed = BASE_SPEED + level.speedBonus + Math.min(state.distance * 0.045, 92);
  state.roadOffset += state.speed * dt;
  state.invuln = Math.max(0, state.invuln - dt);
  state.oilTimer = Math.max(0, state.oilTimer - dt);
  if (futureFeatures.powerups) {
    state.futureMagnetTimer = Math.max(0, (state.futureMagnetTimer || 0) - dt);
    updateFutureMagnet(dt);
  }
  state.turnTimer = Math.max(0, state.turnTimer - dt);
  state.hitTimer = Math.max(0, state.hitTimer - dt);
  state.shakeTimer = Math.max(0, state.shakeTimer - dt);
  state.flashTimer = Math.max(0, state.flashTimer - dt);
  spawnTurnTrail(dt);

  const steerSpeed = state.oilTimer > 0 ? 6 : 11;
  state.playerX += (state.targetX - state.playerX) * Math.min(1, dt * steerSpeed);
  spawnFootDust(dt);

  if (state.levelIntroTimer > 0) {
    state.levelIntroTimer = Math.max(0, state.levelIntroTimer - dt);
    updateHud();
    return;
  }

  state.spawnTimer -= dt;
  state.pickupTimer -= dt;
  if (state.spawnTimer <= 0) spawnObstacle(level);
  if (state.pickupTimer <= 0) spawnPickup(level);

  for (const entity of state.entities) {
    entity.y += state.speed * dt;
    entity.x = averageLaneX(entity.lanes || [entity.lane]);
    entity.spin += dt * entity.spinSpeed;
  }

  for (const particle of state.particles) {
    particle.life -= dt;
    particle.y += particle.vy * dt;
    particle.x += particle.vx * dt;
  }

  checkCollisions();
  state.entities = state.entities.filter((entity) => entity.y < VIRTUAL_HEIGHT + 70 && !entity.dead);
  state.particles = state.particles.filter((particle) => particle.life > 0);

  if (state.cargo <= 0) {
    endGame();
  } else if (state.distance >= level.distanceGoal) {
    completeLevel();
  }

  updateHud();
}

function spawnObstacle(level) {
  const type = level.obstacleUnlock[Math.floor(Math.random() * level.obstacleUnlock.length)];
  const rule = obstacleRules[type];
  const lanes = chooseLanes(rule.lanesWide || 1);
  state.entities.push({
    kind: "obstacle",
    type,
    lane: lanes[0],
    lanes,
    x: averageLaneX(lanes),
    y: -60,
    width: rule.width,
    height: rule.height,
    hitboxScaleX: rule.hitboxScaleX,
    hitboxScaleY: rule.hitboxScaleY,
    hitboxBottomOffset: rule.hitboxBottomOffset,
    radius: Math.max(rule.width, rule.height) / 2,
    spin: 0,
    spinSpeed: 0
  });
  state.spawnTimer = Math.max(0.48, level.obstacleInterval - state.levelIndex * 0.04 + Math.random() * 0.35);
}

function spawnPickup(level) {
  const pool = level.pickupUnlock?.length ? level.pickupUnlock : ["item-1-lvl1", "item-2-lvl1"];
  const futurePool = futureFeatures.expandedPickups
    ? [...pool, "scoreSmall", "scoreMedium", "scoreLarge", "invulnerability", "magnet"]
    : pool;
  const type = futurePool[Math.floor(Math.random() * futurePool.length)];
  const rule = pickupRules[type] || futurePickupCatalog[type];
  const lane = chooseLane();
  state.entities.push({
    kind: "pickup",
    type,
    lane,
    lanes: [lane],
    x: averageLaneX([lane]),
    y: -60,
    radius: rule.radius,
    spin: 0,
    spinSpeed: rule.cargo ? 0.8 : 1.2
  });
  state.pickupTimer = Math.max(0.72, level.pickupInterval + Math.random() * 0.55);
}

function spawnFootDust(dt) {
  if (state.mode !== "playing" || state.levelIntroTimer > 0) return;
  state.dustTimer -= dt;
  if (state.dustTimer > 0) return;

  state.dustTimer = 0.045 + Math.random() * 0.035;
  const side = Math.random() < 0.5 ? -1 : 1;
  state.particles.push({
    type: "dust",
    x: state.playerX + side * (18 + Math.random() * 10),
    y: PLAYER_Y + 1,
    vx: side * (10 + Math.random() * 24),
    vy: 34 + Math.random() * 52,
    radius: 2.4 + Math.random() * 2.6,
    life: 0.34 + Math.random() * 0.18,
    maxLife: 0.52,
    color: "rgba(228, 205, 164, 0.72)"
  });
}

function spawnTurnTrail(dt) {
  if (state.mode !== "playing" || state.levelIntroTimer > 0 || state.turnTimer <= 0) return;
  const slideAmount = Math.abs(state.targetX - state.playerX);
  if (slideAmount < 3) return;

  const count = slideAmount > 22 ? 2 : 1;
  for (let i = 0; i < count; i += 1) {
    const behindDirection = -state.turnDirection;
    state.particles.push({
      type: "skid",
      x: state.playerX + behindDirection * (22 + Math.random() * 14),
      y: PLAYER_Y - 4 + Math.random() * 12,
      vx: behindDirection * (72 + Math.random() * 58),
      vy: 20 + Math.random() * 44,
      radius: 3 + Math.random() * 4,
      life: 0.22 + Math.random() * 0.12,
      maxLife: 0.34,
      color: "rgba(246, 224, 177, 0.86)"
    });
  }
}

function burstTurnDust(direction) {
  for (let i = 0; i < 10; i += 1) {
    const side = -direction;
    state.particles.push({
      type: i % 3 === 0 ? "spark" : "skid",
      x: state.playerX + side * (20 + Math.random() * 18),
      y: PLAYER_Y - 4 + Math.random() * 18,
      vx: side * (95 + Math.random() * 120),
      vy: -18 + Math.random() * 78,
      radius: i % 3 === 0 ? 2 + Math.random() * 2 : 3 + Math.random() * 5,
      life: 0.2 + Math.random() * 0.16,
      maxLife: 0.36,
      color: i % 3 === 0 ? "rgba(255, 238, 170, 0.95)" : "rgba(228, 205, 164, 0.8)"
    });
  }
}

function spawnDecor() {
  const side = Math.random() < 0.5 ? "left" : "right";
  createDecorItem(side, -70);
  state.decorTimer = 0.85 + Math.random() * 0.85;
}

function seedDecor() {
  for (let i = 0; i < 8; i += 1) {
    const side = i % 2 === 0 ? "left" : "right";
    createDecorItem(side, 40 + i * 92 + Math.random() * 36);
  }
  state.decorTimer = 0.6 + Math.random() * 0.6;
}

function createDecorItem(side, y) {
  const pool = sprites.decor?.[side] || [];
  if (!pool.length) {
    return false;
  }

  const sprite = pool[Math.floor(Math.random() * pool.length)];
  const x = side === "left"
    ? -10 + Math.random() * 42
    : VIRTUAL_WIDTH - 32 + Math.random() * 42;

  state.decor.push({
    sprite,
    x,
    y,
    width: 68 + Math.random() * 30,
    height: 42 + Math.random() * 28,
    speedScale: 0.42 + Math.random() * 0.18,
    groundOffset: 8 + Math.random() * 8,
    side
  });
  return true;
}

function chooseLane() {
  const occupied = state.entities
    .filter((entity) => entity.y < 100)
    .flatMap((entity) => entity.lanes || [entity.lane]);
  const lanes = [0, 1, 2].filter((lane) => !occupied.includes(lane));
  return lanes.length ? lanes[Math.floor(Math.random() * lanes.length)] : Math.floor(Math.random() * 3);
}

function chooseLanes(lanesWide) {
  const occupied = state.entities
    .filter((entity) => entity.y < 120)
    .flatMap((entity) => entity.lanes || [entity.lane]);
  const candidates = lanesWide === 3
    ? [[0, 1, 2]]
    : lanesWide === 2
      ? [[0, 1], [1, 2]]
      : [[0], [1], [2]];
  const free = candidates.filter((candidate) => candidate.every((lane) => !occupied.includes(lane)));
  const options = free.length ? free : candidates;
  return options[Math.floor(Math.random() * options.length)];
}

function averageLaneX(lanes) {
  return lanes.reduce((sum, lane) => sum + LANES[lane], 0) / lanes.length;
}

function getSpriteAspect(sprite) {
  return sprite?.complete && sprite.naturalWidth > 0 && sprite.naturalHeight > 0
    ? sprite.naturalWidth / sprite.naturalHeight
    : null;
}

function getObstacleVisualSize(entity, sprite) {
  const scale = getGroundScale(entity.y);
  const width = entity.width * scale;
  const aspect = getSpriteAspect(sprite);
  if (!aspect) {
    return { width, height: entity.height * scale };
  }
  return { width, height: width / aspect };
}

function getObstaclePieces(entity, sprite = sprites.obstacles[entity.type]) {
  const lanes = entity.lanes?.length ? entity.lanes : [entity.lane];
  const size = getObstacleVisualSize(entity, sprite);
  return lanes.map((lane) => ({
    x: LANES[lane],
    y: entity.y,
    width: size.width,
    height: size.height
  }));
}

function getObstacleHitboxes(entity) {
  const scaleX = entity.hitboxScaleX ?? OBSTACLE_HITBOX.scaleX;
  const scaleY = entity.hitboxScaleY ?? OBSTACLE_HITBOX.scaleY;
  const bottomOffset = entity.hitboxBottomOffset ?? OBSTACLE_HITBOX.bottomOffset;
  return getObstaclePieces(entity).map((piece) => {
    const width = piece.width * scaleX;
    const height = piece.height * scaleY;
    return {
      x: piece.x - width / 2,
      y: piece.y - bottomOffset - height,
      width,
      height
    };
  });
}

function perspectiveLaneX(lane, y) {
  const depth = getPerspectiveDepth(y);
  return TOP_LANES[lane] + (LANES[lane] - TOP_LANES[lane]) * depth;
}

function getPerspectiveDepth(y) {
  return Math.max(0, Math.min(1, (y + 60) / (PLAYER_Y + 40)));
}

function checkCollisions() {
  if (state.invuln > 0) return;
  for (const entity of state.entities) {
    if (entity.dead) continue;
    const playerRect = {
      x: state.playerX - PLAYER_HITBOX.width / 2,
      y: PLAYER_Y - PLAYER_HITBOX.bottomOffset - PLAYER_HITBOX.height,
      width: PLAYER_HITBOX.width,
      height: PLAYER_HITBOX.height
    };
    const hit = entity.kind === "obstacle"
      ? getObstacleHitboxes(entity).some((hitbox) => rectsOverlap(
        playerRect.x,
        playerRect.y,
        playerRect.width,
        playerRect.height,
        hitbox.x,
        hitbox.y,
        hitbox.width,
        hitbox.height
      ))
      : Math.hypot(state.playerX - entity.x, PLAYER_Y - entity.y) < getScaledRadius(entity) + 26;
    if (!hit) continue;

    entity.dead = true;
    if (entity.kind === "obstacle") {
      const rule = obstacleRules[entity.type];
      state.cargo = Math.max(0, state.cargo - rule.cargoDamage);
      state.damageTaken += rule.cargoDamage;
      state.score = Math.max(0, state.score - rule.scorePenalty);
      state.invuln = 0.85;
      state.hitTimer = 0.42;
      state.shakeTimer = 0.22;
      state.flashTimer = 0.28;
      if (rule.oil) state.oilTimer = 1.6;
      playObstacleSfx(entity.type);
      if (state.cargo <= 30 && !state.cargoLowSoundPlayed) {
        state.cargoLowSoundPlayed = true;
        playSfx("cargoLow");
      }
      spawnFutureObstacleHitAnimation(entity);
      burst(entity.x, entity.y, "#e85d56");
    } else {
      applyPickupEffect(entity);
    }
    break;
  }
}

function applyPickupEffect(entity) {
  const rule = pickupRules[entity.type] || futurePickupCatalog[entity.type];
  if (!rule) return;

  state.score += rule.score || 0;
  state.collected += rule.items || 0;
  state.cargo = Math.min(100, state.cargo + (rule.cargo || 0));

  if (futureFeatures.powerups && rule.effect === "invulnerability") {
    state.invuln = Math.max(state.invuln, rule.duration || 4);
  }

  if (futureFeatures.powerups && rule.effect === "magnet") {
    state.futureMagnetTimer = Math.max(state.futureMagnetTimer || 0, rule.duration || 5);
  }

  playSfx(rule.cargo ? "pickupRepair" : "pickupPackage");
  burst(entity.x, entity.y, rule.cargo ? "#57c7a2" : rule.effect ? "#6bbcff" : "#f0c15a");
}

function updateFutureMagnet(dt) {
  if (!state.futureMagnetTimer) return;
  const magnet = futurePickupCatalog.magnet;
  const radius = magnet.pullRadius || 120;
  const strength = magnet.pullStrength || 9;

  for (const entity of state.entities) {
    if (entity.kind !== "pickup" || entity.dead) continue;
    const dx = state.playerX - entity.x;
    const dy = PLAYER_Y - entity.y;
    const distance = Math.hypot(dx, dy);
    if (distance <= 0 || distance > radius) continue;

    const pull = Math.min(1, dt * strength * (1 - distance / radius));
    entity.x += dx * pull;
    entity.y += dy * pull * 0.35;
  }
}

function spawnFutureObstacleHitAnimation(entity) {
  if (!futureFeatures.obstacleHitAnimation) return;
  for (let i = 0; i < 8; i += 1) {
    state.particles.push({
      type: "impact",
      x: entity.x + (Math.random() - 0.5) * 44,
      y: entity.y - 22 + (Math.random() - 0.5) * 24,
      vx: (Math.random() - 0.5) * 170,
      vy: -60 - Math.random() * 120,
      radius: 3 + Math.random() * 4,
      life: 0.24 + Math.random() * 0.18,
      maxLife: 0.42,
      color: "#ffffff"
    });
  }
}

function completeLevel() {
  const level = currentLevel();
  const stars = calculateStars();
  const distanceScore = Math.floor(level.distanceGoal / 4);
  const cargoBonus = Math.floor(state.cargo * 8);
  state.score += distanceScore + cargoBonus + stars * 150;
  if (futureFeatures.levelSelect) {
    const nextProgress = unlockFutureLevel(futureProgress, state.levelIndex, stars);
    Object.assign(futureProgress, nextProgress);
    saveFutureProgress(futureProgress);
  }

  ui.levelCompleteTitle.textContent = "МОЛОДЕЦ";
  renderStars(stars);
  ui.levelStats.textContent = gameText.results.levelStats({
    damageTaken: state.damageTaken,
    cargo: Math.ceil(state.cargo),
    collected: state.collected,
    itemGoal: level.itemGoal,
    score: state.score
  });
  buttons.nextLevel.textContent = state.levelIndex < levels.length - 1
    ? gameText.buttons.nextLevel
    : gameText.buttons.finishGame;
  playSfx("levelComplete");
  setMode("complete");
}

function calculateStars() {
  const level = currentLevel();
  if (state.cargo >= 85 && state.collected >= level.itemGoal) return 3;
  if (state.cargo >= 55 && state.collected >= Math.ceil(level.itemGoal * 0.7)) return 2;
  return 1;
}

function endGame() {
  maybeRecordFutureGameOverScore();
  if (ui.gameOverTitle) ui.gameOverTitle.textContent = "ПОТРАЧЕНО";
  if (ui.finalStats) {
    ui.finalStats.textContent = gameText.results.gameOverStats({
      levelName: currentLevel().name,
      distance: Math.floor(state.distance),
      distanceGoal: currentLevel().distanceGoal,
      damageTaken: state.damageTaken,
      score: state.score
    });
  }
  playSfx("gameOver");
  setMode("gameover");
}

function maybeRecordFutureGameOverScore() {
  if (!futureFeatures.leaderboard) return;
  const name = window.prompt("Player name", "PLAYER");
  const entries = recordFutureRunResult({
    name,
    score: state.score,
    levelIndex: state.levelIndex,
    stars: 0,
    damageTaken: state.damageTaken
  });
  prepareFutureLeaderboardCascade(entries);
}

function prepareFutureLeaderboardCascade(entries) {
  if (!futureFeatures.leaderboardCascade) return [];
  return buildFutureLeaderboardRows(entries);
}

function burst(x, y, color) {
  for (let i = 0; i < 12; i += 1) {
    state.particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 130,
      vy: (Math.random() - 0.7) * 130,
      life: 0.42 + Math.random() * 0.18,
      color
    });
  }
}

function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function updateHud() {
  const level = currentLevel();
  const cargo = Math.ceil(state.cargo);
  const progress = Math.floor((state.distance / level.distanceGoal) * 100);
  ui.cargoText.textContent = `${cargo}%`;
  ui.cargoFill.style.width = `${Math.max(0, cargo)}%`;
  ui.cargoFill.style.backgroundColor = cargo > 60 ? "#57c7a2" : cargo > 30 ? "#f0c15a" : "#e85d56";
  ui.itemsText.textContent = `${state.collected}/${level.itemGoal}`;
  ui.distanceText.textContent = `${progress}%`;
  ui.levelText.textContent = `${state.levelIndex + 1}/${levels.length}`;
}

function handleKeyDown(event) {
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") moveLane(-1);
  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") moveLane(1);
  if (event.key === " " || event.key === "Escape") togglePause();
}

function moveLane(direction) {
  if (state.mode !== "playing") return;
  const nextLane = Math.max(0, Math.min(2, state.playerLane + direction));
  if (nextLane === state.playerLane) return;
  state.playerLane = nextLane;
  state.targetX = LANES[state.playerLane];
  state.turnDirection = direction;
  state.turnTimer = 0.55;
  burstTurnDust(direction);
  playSfx("lane");
}

function resizeCanvas() {
  const ratio = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
  canvas.width = VIRTUAL_WIDTH * ratio;
  canvas.height = VIRTUAL_HEIGHT * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function render() {
  const shake = state.shakeTimer > 0 ? Math.sin(performance.now() * 0.08) * 4 : 0;
  ctx.save();
  ctx.translate(shake, 0);
  drawBackground();
  drawFinishHint();
  drawEntities();
  drawPlayer();
  drawParticles();
  drawLevelIntro();
  ctx.restore();
  drawDamageFlash();
}

function drawBackground() {
  const theme = currentLevel().theme;
  const levelBackground = sprites.backgrounds?.levels?.[state.levelIndex];
  if (levelBackground?.complete && levelBackground.naturalWidth > 0) {
    drawScrollingCoverImage(levelBackground, -10, 0, VIRTUAL_WIDTH + 20, VIRTUAL_HEIGHT, state.roadOffset);
    return;
  }

  const sky = ctx.createLinearGradient(0, 0, 0, VIRTUAL_HEIGHT);
  sky.addColorStop(0, theme.skyTop);
  sky.addColorStop(1, theme.skyBottom);
  ctx.fillStyle = sky;
  ctx.fillRect(-10, 0, VIRTUAL_WIDTH + 20, VIRTUAL_HEIGHT);

  ctx.fillStyle = theme.grass;
  for (let y = -80; y < VIRTUAL_HEIGHT + 80; y += 90) {
    ctx.beginPath();
    ctx.ellipse(35, y + (state.roadOffset * 0.45) % 90, 42, 28, 0, 0, Math.PI * 2);
    ctx.ellipse(370, y + 35 + (state.roadOffset * 0.4) % 90, 46, 30, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawRoad() {
  if (sprites.road?.complete && sprites.road.naturalWidth > 0) {
    drawScrollingCoverImage(sprites.road, 0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT, state.roadOffset);
    return;
  }

  const theme = currentLevel().theme;
  ctx.fillStyle = theme.edge;
  roundRect(54, -10, 297, VIRTUAL_HEIGHT + 20, 18);
  ctx.fill();

  ctx.fillStyle = theme.road;
  roundRect(68, -10, 269, VIRTUAL_HEIGHT + 20, 12);
  ctx.fill();
}

function drawMotionLayer() {
  ctx.save();
  drawPerspectiveStrip(148, 334, -20, VIRTUAL_HEIGHT + 30);
  ctx.clip();

  ctx.lineCap = "round";
  for (let lane = 0; lane < 3; lane += 1) {
    drawGroundStreakLane(lane, 0);
    drawGroundStreakLane(lane, 72);
    drawGroundStreakLane(lane, 144);
  }

  ctx.restore();
}

function drawGroundStreakLane(lane, phase) {
  const spacing = 216;
  const offset = (state.roadOffset * 1.25 + phase) % spacing;
  for (let baseY = -spacing; baseY < VIRTUAL_HEIGHT + spacing; baseY += spacing) {
    const y = baseY + offset;
    const depth = getPerspectiveDepth(y);
    if (depth <= 0 || depth >= 1) continue;

    const x = perspectiveLaneX(lane, y);
    const streakLength = 8 + depth * 42;
    const streakWidth = 1 + depth * 3;
    const alpha = 0.05 + depth * 0.14;
    const sway = Math.sin((baseY + lane * 47) * 0.03) * (8 + depth * 10);

    ctx.globalAlpha = alpha;
    ctx.strokeStyle = "#f4f1e8";
    ctx.lineWidth = streakWidth;
    ctx.beginPath();
    ctx.moveTo(x + sway * 0.35, y - streakLength * 0.45);
    ctx.lineTo(x + sway, y + streakLength);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function drawSideDecor() {
  const visibleDecor = [...state.decor].sort((a, b) => a.y - b.y);
  for (const item of visibleDecor) {
    const scale = getDecorScale(item.y);
    const width = item.width * scale;
    const height = item.height * scale;
    const groundY = item.y + item.groundOffset;
    drawGroundShadow(item.x, groundY, width * 0.9, 0.12, 0.32);
    drawGroundedSprite(item.sprite, item.x, groundY, width, height, 0);
  }
}

function drawFinishHint() {
  const level = currentLevel();
  const remaining = level.distanceGoal - state.distance;
  if (remaining > 260 || state.mode !== "playing") return;

  const progress = 1 - remaining / 260;
  const alpha = Math.min(1, progress * 1.8);
  const pulse = Math.sin(performance.now() * 0.006) * 0.5 + 0.5;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "rgba(0, 0, 0, 0.42)";
  roundRect(54, 128, VIRTUAL_WIDTH - 108, 58, 8);
  ctx.fill();
  ctx.strokeStyle = level.finishColor || "#f4f1e8";
  ctx.lineWidth = 2 + pulse * 2;
  roundRect(58, 132, VIRTUAL_WIDTH - 116, 50, 8);
  ctx.stroke();
  ctx.fillStyle = "#fff";
  ctx.font = "16px 'Days One', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(level.finishLabel || "ФИНИШ", VIRTUAL_WIDTH / 2, 152);
  ctx.font = "10px 'Days One', sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
  ctx.fillText("ПУНКТ НАЗНАЧЕНИЯ БЛИЗКО", VIRTUAL_WIDTH / 2, 173);
  ctx.restore();
}

function drawLevelIntro() {
  if (state.levelIntroTimer <= 0 || state.mode !== "playing") return;

  const level = currentLevel();
  const t = state.levelIntroTimer;
  const fadeIn = Math.min(1, (2.2 - t) / 0.35);
  const fadeOut = Math.min(1, t / 0.45);
  const alpha = Math.min(fadeIn, fadeOut);
  const slide = (1 - fadeIn) * 48;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
  ctx.translate(0, slide);
  ctx.fillStyle = level.finishColor || "#f4f1e8";
  roundRect(42, 244, VIRTUAL_WIDTH - 84, 96, 8);
  ctx.fill();
  ctx.fillStyle = "rgba(0, 0, 0, 0.62)";
  roundRect(48, 250, VIRTUAL_WIDTH - 96, 84, 8);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "12px 'Days One', sans-serif";
  ctx.fillText(`УРОВЕНЬ ${state.levelIndex + 1}`, VIRTUAL_WIDTH / 2, 276);
  ctx.font = "20px 'Days One', sans-serif";
  fitText(level.name, VIRTUAL_WIDTH / 2, 310, VIRTUAL_WIDTH - 118, 20);
  ctx.restore();
}

function drawEntities() {
  const visibleEntities = [...state.entities].sort((a, b) => a.y - b.y);
  for (const entity of visibleEntities) {
    if (entity.kind === "obstacle") {
      const sprite = sprites.obstacles[entity.type];
      for (const piece of getObstaclePieces(entity, sprite)) {
        drawGroundShadow(piece.x, piece.y, piece.width * 0.62, 0.24, 0.28);
        drawGroundedSprite(sprite, piece.x, piece.y, piece.width, piece.height, 0);
      }
      continue;
    }

    const sprite = sprites.pickups[entity.type];
    const scale = getGroundScale(entity.y);
    const width = entity.radius * 2 * scale;
    const height = entity.radius * 2 * scale;
    drawGroundShadow(entity.x, entity.y, width * 0.62, 0.16 + scale * 0.08, 0.2);
    drawGroundedSprite(sprite, entity.x, entity.y, width, height, entity.spin);
  }
}

function drawPlayer() {
  const blink = state.invuln > 0 && !futureFeatures.powerupAnimations && Math.floor(performance.now() / 80) % 2 === 0;
  if (blink) return;
  const bob = state.mode === "playing" ? Math.sin(performance.now() * 0.018) * 2 : 0;
  const frame = getPlayerFrame();
  const size = getPlayerDrawSize(frame);
  drawGroundShadow(state.playerX, PLAYER_Y, size.width * 0.78, 0.32, 0.3);
  drawFuturePowerupAuras();
  drawGroundedSprite(frame, state.playerX, PLAYER_Y + bob, size.width, size.height, 0);
}

function getPlayerDrawSize(frame) {
  const rawAspect = getSpriteAspect(frame);
  const aspect = rawAspect && rawAspect < 0.85 ? rawAspect : PLAYER_FALLBACK_ASPECT;
  return {
    width: PLAYER_DRAW_HEIGHT * aspect,
    height: PLAYER_DRAW_HEIGHT
  };
}

function drawParticles() {
  for (const particle of state.particles) {
    const maxLife = particle.maxLife || 0.6;
    const alpha = Math.max(0, particle.life / maxLife);
    ctx.globalAlpha = particle.type === "dust" ? alpha * 0.42 : particle.type === "skid" ? alpha * 0.62 : alpha;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    if (particle.type === "skid") {
      ctx.ellipse(particle.x, particle.y, (particle.radius || 4) * 1.8, particle.radius || 4, -0.35, 0, Math.PI * 2);
      ctx.fill();
    } else if (particle.type === "spark") {
      ctx.rect(particle.x - 1, particle.y - 1, (particle.radius || 3) * 2.2, 2);
      ctx.fill();
    } else {
      ctx.arc(particle.x, particle.y, particle.radius || 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}

function drawFuturePowerupAuras() {
  if (!futureFeatures.powerupAnimations) return;
  const time = performance.now() * 0.006;

  if (state.invuln > 0) {
    ctx.save();
    ctx.globalAlpha = 0.24 + Math.sin(time) * 0.06;
    ctx.strokeStyle = "#7ee7ff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(state.playerX, PLAYER_Y - 48, 46, 58, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  if (state.futureMagnetTimer > 0) {
    ctx.save();
    ctx.globalAlpha = 0.18 + Math.sin(time * 1.4) * 0.05;
    ctx.strokeStyle = "#f0c15a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(state.playerX, PLAYER_Y - 42, 70 + Math.sin(time) * 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawDamageFlash() {
  if (state.flashTimer <= 0) return;
  ctx.globalAlpha = Math.min(0.32, state.flashTimer);
  ctx.fillStyle = "#e85d56";
  ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
  ctx.globalAlpha = 1;
}

function drawSprite(sprite, x, y, width, height, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  if (sprite?.complete && sprite.naturalWidth > 0) {
    ctx.drawImage(sprite, -width / 2, -height / 2, width, height);
  } else {
    ctx.fillStyle = "#f0c15a";
    roundRect(-width / 2, -height / 2, width, height, 8);
    ctx.fill();
  }
  ctx.restore();
}

function drawGroundedSprite(sprite, x, groundY, width, height, rotation) {
  ctx.save();
  ctx.translate(x, groundY);
  ctx.rotate(rotation);
  if (sprite?.complete && sprite.naturalWidth > 0) {
    ctx.drawImage(sprite, -width / 2, -height, width, height);
  } else {
    ctx.fillStyle = "#f0c15a";
    roundRect(-width / 2, -height, width, height, 8);
    ctx.fill();
  }
  ctx.restore();
}

function drawGroundShadow(x, groundY, width, heightScale, alpha) {

    return;
}
/*
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.ellipse(x, groundY + 2, width / 2, width * heightScale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
*/

function getPlayerFrame() {
  if (!assetManifest.usePlayerAnimations) return sprites.player;

  const tier = getDamageTier();
  const stateKey = getPlayerAnimationState();
  const animation = sprites.playerAnimations?.[`damage${tier}`]?.[stateKey]
    || sprites.playerAnimations?.damage0?.[stateKey]
    || sprites.playerAnimations?.damage0?.run;
  const frame = getAnimationFrame(animation, sprites.player);
  return frame?.complete && frame.naturalWidth > 0 ? frame : sprites.player;
}

function getDamageTier() {
  if (state.cargo <= 25) return 3;
  if (state.cargo <= 50) return 2;
  if (state.cargo <= 75) return 1;
  return 0;
}

function getPlayerAnimationState() {
  if (state.hitTimer > 0) return "hit";
  const isChangingLane = Math.abs(state.targetX - state.playerX) > 3;
  if ((state.turnTimer > 0 || isChangingLane) && state.turnDirection < 0) return "turnLeft";
  if ((state.turnTimer > 0 || isChangingLane) && state.turnDirection > 0) return "turnRight";
  return "run";
}

function getAnimationFrame(animation, fallback) {
  if (!animation?.frames?.length) return fallback;

  const frameDuration = 1000 / animation.fps;
  const frameIndex = Math.floor(performance.now() / frameDuration) % animation.frames.length;
  return animation.frames[frameIndex] || fallback;
}

function getDepth(y) {
  return Math.max(0, Math.min(1, y / VIRTUAL_HEIGHT));
}

function getGroundScale(y) {
  return 1;
}

function getDecorScale(y) {
  const depth = getDepth(y);
  return DECOR_TOP_SCALE + depth * (DECOR_BOTTOM_SCALE - DECOR_TOP_SCALE);
}

function getScaledRadius(entity) {
  return entity.radius * getGroundScale(entity.y);
}

function roundRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function fitText(text, x, y, maxWidth, startSize) {
  let size = startSize;
  ctx.font = `${size}px 'Days One', sans-serif`;
  while (ctx.measureText(text).width > maxWidth && size > 9) {
    size -= 1;
    ctx.font = `${size}px 'Days One', sans-serif`;
  }
  ctx.fillText(text, x, y);
}

function drawCoverImage(image, x, y, width, height) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const scaledWidth = image.naturalWidth * scale;
  const scaledHeight = image.naturalHeight * scale;
  const sourceX = (scaledWidth - width) / 2 / scale;
  const sourceY = (scaledHeight - height) / 2 / scale;
  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
}

function drawScrollingCoverImage(image, x, y, width, height, offset) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  const drawX = x + (width - drawWidth) / 2;
  let drawY = y + (offset % drawHeight) - drawHeight;

  while (drawY < y + height) {
    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
    drawY += drawHeight;
  }
}

function drawPerspectiveBackground(image, offset) {
  ctx.fillStyle = "#000";
  ctx.fillRect(-10, 0, VIRTUAL_WIDTH + 20, VIRTUAL_HEIGHT);

  const sliceHeight = 4;
  const halfSourceWidth = image.naturalWidth / 2;
  for (let y = 0; y < VIRTUAL_HEIGHT; y += sliceHeight) {
    const height = Math.min(sliceHeight, VIRTUAL_HEIGHT - y);
    const { left, right } = getPerspectiveEdges(158, 314, y + height, -20, VIRTUAL_HEIGHT + 30);
    const leftWidth = Math.max(0, left + 10);
    const rightWidth = Math.max(0, VIRTUAL_WIDTH + 10 - right);

    if (leftWidth > 1) {
      drawRepeatedSlice(image, 0, halfSourceWidth, -10, y, leftWidth, height, offset);
    }
    if (rightWidth > 1) {
      drawRepeatedSlice(image, halfSourceWidth, halfSourceWidth, right, y, rightWidth, height, offset);
    }
  }
}

function drawPerspectiveTexture(image, topWidth, bottomWidth, offset) {
  const sliceHeight = 4;
  for (let y = 0; y < VIRTUAL_HEIGHT; y += sliceHeight) {
    const height = Math.min(sliceHeight, VIRTUAL_HEIGHT - y);
    const { left, right } = getPerspectiveEdges(topWidth, bottomWidth, y + height, -20, VIRTUAL_HEIGHT + 30);
    drawRepeatedSlice(image, 0, image.naturalWidth, left, y, right - left, height, offset);
  }
}

function drawPerspectiveStrip(topWidth, bottomWidth, topY, bottomY) {
  const center = VIRTUAL_WIDTH / 2;
  ctx.beginPath();
  ctx.moveTo(center - topWidth / 2, topY);
  ctx.lineTo(center + topWidth / 2, topY);
  ctx.lineTo(center + bottomWidth / 2, bottomY);
  ctx.lineTo(center - bottomWidth / 2, bottomY);
  ctx.closePath();
}

function drawSidePerspectiveAreas(roadTopWidth, roadBottomWidth, topY, bottomY) {
  const center = VIRTUAL_WIDTH / 2;
  const topLeft = center - roadTopWidth / 2;
  const topRight = center + roadTopWidth / 2;
  const bottomLeft = center - roadBottomWidth / 2;
  const bottomRight = center + roadBottomWidth / 2;

  ctx.beginPath();
  ctx.moveTo(-10, topY);
  ctx.lineTo(topLeft, topY);
  ctx.lineTo(bottomLeft, bottomY);
  ctx.lineTo(-10, bottomY);
  ctx.closePath();

  ctx.moveTo(topRight, topY);
  ctx.lineTo(VIRTUAL_WIDTH + 10, topY);
  ctx.lineTo(VIRTUAL_WIDTH + 10, bottomY);
  ctx.lineTo(bottomRight, bottomY);
  ctx.closePath();
}

function getPerspectiveEdges(topWidth, bottomWidth, y, topY, bottomY) {
  const center = VIRTUAL_WIDTH / 2;
  const depth = Math.max(0, Math.min(1, (y - topY) / (bottomY - topY)));
  const width = topWidth + (bottomWidth - topWidth) * depth;
  return {
    left: center - width / 2,
    right: center + width / 2
  };
}

function drawRepeatedSlice(image, sourceX, sourceWidth, x, y, width, height, offset) {
  const sourceY = positiveModulo(y - offset, image.naturalHeight);
  const firstHeight = Math.min(height, image.naturalHeight - sourceY);
  ctx.drawImage(image, sourceX, sourceY, sourceWidth, firstHeight, x, y, width, firstHeight);

  if (firstHeight < height) {
    const restHeight = height - firstHeight;
    ctx.drawImage(image, sourceX, 0, sourceWidth, restHeight, x, y + firstHeight, width, restHeight);
  }
}

function positiveModulo(value, size) {
  return ((value % size) + size) % size;
}

function applyText() {
  buttons.start.textContent = gameText.buttons.start;
  buttons.how.textContent = gameText.buttons.how;
  buttons.closeHow.textContent = gameText.buttons.closeHow;
  buttons.resume.textContent = gameText.buttons.resume;
  buttons.restartPause.textContent = gameText.buttons.restartPause;
  buttons.pauseBackToMenu.textContent = gameText.buttons.backToMenu;
  buttons.restart.textContent = gameText.buttons.restart;
  buttons.backToMenu.textContent = gameText.buttons.backToMenu;
  buttons.nextLevel.textContent = gameText.buttons.nextLevel;
  buttons.replayLevel.textContent = gameText.buttons.replayLevel;
  buttons.completeBackToMenu.textContent = gameText.buttons.backToMenu;

  setText("#pauseTitle", "ПАУЗА");
  setText("#gameOverTitle", "ПОТРАЧЕНО");
  setText("#levelCompleteTitle", "МОЛОДЕЦ");
  setText("#pauseMenu .kicker", gameText.screens.pauseKicker);
  setText("#pauseMenu h2", gameText.screens.pauseTitle);
  setText("#levelCompleteMenu .kicker", gameText.screens.levelCompleteKicker);
  setText("#howMenu .kicker", gameText.screens.howKicker);
  setText("#howMenu h2", gameText.screens.howTitle);
  setText("#howMenu .summary", gameText.screens.howSummary);
  setText("#cargoIcon + div span", gameText.hud.cargo);
  setText("#itemsIcon + div span", gameText.hud.collected);
  setText("#routeIcon + div span", gameText.hud.route);
  setText("#levelIcon + div span", gameText.hud.level);
}

function setText(selector, text) {
  const element = document.querySelector(selector);
  if (element) element.textContent = text;
}

function buildLevelTestButtons() {
  if (!ui.levelTestGrid) return;
  ui.levelTestGrid.innerHTML = "";
  levels.forEach((level, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "level-test-button";
    button.textContent = `${index + 1}`;
    button.title = `Тест: ${level.name}`;
    button.addEventListener("click", () => startLevel(index));
    ui.levelTestGrid.append(button);
  });
}

function setupButtonStates() {
  document.querySelectorAll(".primary, .secondary, .level-test-button").forEach((button) => {
    const press = () => button.classList.add("is-pressed");
    const release = () => button.classList.remove("is-pressed");
    button.addEventListener("pointerdown", press);
    button.addEventListener("pointerup", release);
    button.addEventListener("pointerleave", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("blur", release);
    button.addEventListener("keydown", (event) => {
      if (event.key === " " || event.key === "Enter") press();
    });
    button.addEventListener("keyup", release);
  });
}

function applyScreenBackgrounds(backgrounds) {
  setOverlayBackground(ui.mainMenu, backgrounds.menu);
  setOverlayBackground(ui.pauseMenu, backgrounds.pause);
  setOverlayBackground(ui.gameOverMenu, backgrounds.gameOver);
  setOverlayBackground(ui.levelCompleteMenu, backgrounds.levelComplete);
}

function setOverlayBackground(element, path) {
  if (!element || !path) return;
  const url = typeof path === "string" ? new URL(path, import.meta.url).href : path.src;
  if (!url) return;
  element.style.backgroundImage = `url("${url}")`;
}

function applyUiAssets(uiAssets) {
  const buttons = uiAssets.buttons || {};
  setCssImage("--button-primary-normal", buttons.primary?.normal);
  setCssImage("--button-primary-hover", buttons.primary?.hover);
  setCssImage("--button-primary-active", buttons.primary?.active);
  setCssImage("--button-secondary-normal", buttons.secondary?.normal);
  setCssImage("--button-secondary-hover", buttons.secondary?.hover);
  setCssImage("--button-secondary-active", buttons.secondary?.active);

  const icons = uiAssets.icons || {};
  setImage(hudIcons.cargo, icons.cargo);
  setImage(hudIcons.items, icons.items);
  setImage(hudIcons.route, icons.route);
  setImage(hudIcons.level, icons.level);
  setImage(hudIcons.pause, icons.pause);

  const titles = uiAssets.titles || {};
  setTitleImage(ui.mainMenu?.querySelector("#menuTitle"), titles.menu);
  setTitleImage(ui.pauseMenu?.querySelector("#pauseTitle"), titles.pause);
  setTitleImage(ui.levelCompleteMenu?.querySelector("#levelCompleteTitle"), titles.levelComplete);
  setTitleImage(ui.gameOverMenu?.querySelector("#gameOverTitle"), titles.gameOver);
}

function setCssImage(variable, path) {
  if (!path) return;
  document.documentElement.style.setProperty(variable, `url("${assetUrl(path)}")`);
}

function setImage(image, path) {
  if (!image || !path) return;
  image.src = assetUrl(path);
}

function setTitleImage(element, path) {
  if (!element || !path) return;
  const url = assetUrl(path);
  const image = new Image();
  image.onload = () => {
    element.style.backgroundImage = `url("${url}")`;
    element.classList.add("screen-title--image");
  };
  image.src = url;
}

function assetUrl(path) {
  const url = new URL(path, import.meta.url);
  url.searchParams.set("v", assetManifest.assetVersion || "dev");
  return url.href;
}

function createAudioSystem(audioManifest) {
  const music = new Map();
  const sfx = new Map();
  const musicVolume = audioManifest.musicVolume ?? 0.42;
  const sfxVolume = audioManifest.sfxVolume ?? 0.72;
  const storedMuted = localStorage.getItem("cart-runner-muted") === "true";

  if (audioManifest.music?.menu) {
    music.set("menu", createAudioElement(audioManifest.music.menu, musicVolume, true));
  }
  (audioManifest.music?.levels || []).forEach((path, index) => {
    music.set(`level-${index}`, createAudioElement(path, musicVolume, true));
  });

  Object.entries(audioManifest.sfx || {}).forEach(([key, path]) => {
    sfx.set(key, createAudioElement(path, sfxVolume, false));
  });

  return {
    unlocked: false,
    muted: storedMuted,
    musicKey: "",
    currentMusic: null,
    music,
    sfx
  };
}

function createAudioElement(path, volume, loop) {
  const element = new Audio(assetUrl(path));
  element.preload = "auto";
  element.loop = loop;
  element.volume = volume;
  return element;
}

function unlockAudio() {
  if (audio.unlocked) return;
  audio.unlocked = true;
  updateMusic();
}

function toggleSound() {
  audio.muted = !audio.muted;
  localStorage.setItem("cart-runner-muted", String(audio.muted));
  updateSoundButton();
  updateMusic();
}

function updateSoundButton() {
  if (!ui.soundButton) return;
  ui.soundButton.textContent = audio.muted ? gameText.hud.soundOff : gameText.hud.soundOn;
  ui.soundButton.classList.toggle("audio-button--muted", audio.muted);
}

function updateMusic() {
  const key = state.mode === "playing" ? `level-${state.levelIndex}` : "menu";
  playMusic(key);
}

function playMusic(key) {
  if (audio.musicKey === key && audio.currentMusic) {
    if (!audio.muted && audio.unlocked) audio.currentMusic.play().catch(() => {});
    if (audio.muted) audio.currentMusic.pause();
    return;
  }

  if (audio.currentMusic) {
    audio.currentMusic.pause();
    audio.currentMusic.currentTime = 0;
  }

  audio.musicKey = key;
  audio.currentMusic = audio.music.get(key) || audio.music.get("menu") || null;
  if (!audio.currentMusic || audio.muted || !audio.unlocked) return;
  audio.currentMusic.currentTime = 0;
  audio.currentMusic.play().catch(() => {});
}

function playSfx(key) {
  if (audio.muted || !audio.unlocked) return;
  const source = audio.sfx.get(key);
  if (!source) return;
  const sound = source.cloneNode();
  sound.volume = source.volume;
  sound.play().catch(() => {});
}

function playObstacleSfx(type) {
  const rule = obstacleRules[type];
  const key = rule?.oil
    ? "hitOil"
    : rule?.lanesWide === 3
      ? "hitBarrier"
      : rule?.lanesWide === 2
        ? "hitCrate"
        : "hitCone";
  playSfx(key);
}

function renderStars(stars) {
  const full = assetManifest.ui?.stars?.full;
  const empty = assetManifest.ui?.stars?.empty;
  if (!ui.starsText || !full || !empty) return;

  ui.starsText.innerHTML = "";
  ui.starsText.classList.remove("stars--reveal");
  for (let index = 0; index < 3; index += 1) {
    const image = document.createElement("img");
    image.className = "star-icon";
    image.alt = index < stars ? "Звезда" : "Пустая звезда";
    image.src = assetUrl(index < stars ? full : empty);
    image.style.animationDelay = `${index * 140}ms`;
    ui.starsText.append(image);
  }
  requestAnimationFrame(() => ui.starsText.classList.add("stars--reveal"));
}

async function loadSprites(manifest) {
  return {
    player: await loadImage(manifest.player),
    playerAnimations: await loadPlayerAnimations(manifest.playerAnimations || {}),
    road: manifest.road ? await loadImage(manifest.road) : null,
    decor: await loadDecor(manifest.decor || {}),
    obstacles: await loadGroup(manifest.obstacles),
    pickups: await loadGroup(manifest.pickups),
    backgrounds: await loadBackgrounds(manifest.backgrounds || {})
  };
}

async function loadDecor(decor) {
  return {
    left: await Promise.all((decor.left || []).map((path) => loadImage(path))).then((items) => items.filter(Boolean)),
    right: await Promise.all((decor.right || []).map((path) => loadImage(path))).then((items) => items.filter(Boolean))
  };
}

async function loadBackgrounds(backgrounds) {
  return {
    menu: backgrounds.menu ? await loadImage(backgrounds.menu) : null,
    pause: backgrounds.pause ? await loadImage(backgrounds.pause) : null,
    gameOver: backgrounds.gameOver ? await loadImage(backgrounds.gameOver) : null,
    levelComplete: backgrounds.levelComplete ? await loadImage(backgrounds.levelComplete) : null,
    levels: await Promise.all((backgrounds.levels || []).map((path) => loadImage(path)))
  };
}

async function loadPlayerAnimations(animationSets) {
  const result = {};
  await Promise.all(Object.entries(animationSets).map(async ([damageKey, states]) => {
    result[damageKey] = {};
    await Promise.all(Object.entries(states).map(async ([stateKey, animation]) => {
      result[damageKey][stateKey] = {
        fps: animation.fps || 8,
        frames: await Promise.all((animation.frames || []).map((path) => loadImage(path)))
      };
      result[damageKey][stateKey].frames = result[damageKey][stateKey].frames.filter(Boolean);
    }));
  }));
  return result;
}

async function loadGroup(group) {
  const result = {};
  await Promise.all(Object.entries(group).map(async ([key, path]) => {
    result[key] = await loadImage(path);
  }));
  return result;
}

function loadImage(path) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => {
      console.warn(`[assets] Не удалось загрузить: ${path}`);
      resolve(null);
    };
    image.src = assetUrl(path);
  });
}
