export const futureFeatures = {
  characterSelect: false,
  leaderboard: false,
  leaderboardCascade: false,
  expandedPickups: false,
  levelSelect: false,
  powerups: false,
  powerupAnimations: false,
  obstacleHitAnimation: false
};

export const futureCharacters = [
  {
    id: "runner",
    name: "Runner",
    description: "Balanced character for the default game feel.",
    stats: {
      startCargo: 100,
      speedBonus: 0,
      steeringMultiplier: 1,
      damageMultiplier: 1,
      scoreMultiplier: 1,
      magnetRadiusBonus: 0
    },
    assetRoot: "../assets/custom/future/characters/runner"
  },
  {
    id: "mover",
    name: "Mover",
    description: "Slower steering, but better cargo protection and score gain.",
    stats: {
      startCargo: 110,
      speedBonus: -8,
      steeringMultiplier: 0.92,
      damageMultiplier: 0.85,
      scoreMultiplier: 1.08,
      magnetRadiusBonus: 8
    },
    assetRoot: "../assets/custom/future/characters/mover"
  }
];

export const futurePickupCatalog = {
  scoreSmall: {
    type: "score",
    score: 80,
    radius: 22,
    assetPath: "../assets/custom/future/pickups/score-small.png"
  },
  scoreMedium: {
    type: "score",
    score: 140,
    radius: 24,
    assetPath: "../assets/custom/future/pickups/score-medium.png"
  },
  scoreLarge: {
    type: "score",
    score: 240,
    radius: 26,
    assetPath: "../assets/custom/future/pickups/score-large.png"
  },
  invulnerability: {
    type: "powerup",
    effect: "invulnerability",
    duration: 4.5,
    radius: 25,
    assetPath: "../assets/custom/future/pickups/invulnerability.png"
  },
  magnet: {
    type: "powerup",
    effect: "magnet",
    duration: 6,
    radius: 25,
    pullRadius: 120,
    pullStrength: 9,
    assetPath: "../assets/custom/future/pickups/magnet.png"
  }
};

export const futureMechanicsIdeas = [
  {
    id: "combo-chain",
    name: "Pickup combo",
    note: "Consecutive pickups without cargo damage add a temporary score multiplier."
  },
  {
    id: "route-objectives",
    name: "Level objectives",
    note: "Each level can ask for a different target: collect items, keep cargo above a limit, or avoid a certain obstacle type."
  },
  {
    id: "risk-lanes",
    name: "Risk lanes",
    note: "Some lanes can become temporarily dangerous, but contain better rewards."
  },
  {
    id: "cargo-weight",
    name: "Cargo weight",
    note: "More collected cargo improves score but slightly worsens steering until the level ends."
  },
  {
    id: "daily-route",
    name: "Daily route",
    note: "A seeded level gives the same obstacle pattern for one day and can have its own record table."
  }
];

const FUTURE_SAVE_KEY = "cart-runner-future-progress";
const FUTURE_LEADERBOARD_KEY = "cart-runner-future-leaderboard";

export function createFutureProgressState(levelCount) {
  return {
    selectedCharacterId: futureCharacters[0].id,
    unlockedLevel: 0,
    levelStars: Array.from({ length: levelCount }, () => 0),
    activePowerups: {
      invulnerability: 0,
      magnet: 0
    }
  };
}

export function loadFutureProgress(levelCount) {
  try {
    const saved = JSON.parse(localStorage.getItem(FUTURE_SAVE_KEY) || "null");
    return {
      ...createFutureProgressState(levelCount),
      ...saved,
      levelStars: normalizeStars(saved?.levelStars, levelCount)
    };
  } catch {
    return createFutureProgressState(levelCount);
  }
}

export function saveFutureProgress(progress) {
  localStorage.setItem(FUTURE_SAVE_KEY, JSON.stringify(progress));
}

export function loadFutureLeaderboard() {
  try {
    const entries = JSON.parse(localStorage.getItem(FUTURE_LEADERBOARD_KEY) || "[]");
    return Array.isArray(entries) ? entries.slice(0, 20) : [];
  } catch {
    return [];
  }
}

export function recordFutureRunResult({ name, score, levelIndex, stars, damageTaken }) {
  const entry = {
    name: sanitizeFutureName(name),
    score: Math.max(0, Math.floor(score || 0)),
    levelIndex: Math.max(0, Math.floor(levelIndex || 0)),
    stars: Math.max(0, Math.min(3, Math.floor(stars || 0))),
    damageTaken: Math.max(0, Math.floor(damageTaken || 0)),
    date: new Date().toISOString()
  };
  const entries = [...loadFutureLeaderboard(), entry]
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);
  localStorage.setItem(FUTURE_LEADERBOARD_KEY, JSON.stringify(entries));
  return entries;
}

export function buildFutureLeaderboardRows(entries) {
  return loadFutureLeaderboardRows(entries).map((entry, index) => ({
    ...entry,
    rank: index + 1,
    animationDelayMs: index * 70
  }));
}

export function unlockFutureLevel(progress, levelIndex, stars) {
  const nextProgress = {
    ...progress,
    levelStars: normalizeStars(progress.levelStars, progress.levelStars.length)
  };
  nextProgress.levelStars[levelIndex] = Math.max(nextProgress.levelStars[levelIndex] || 0, stars);
  nextProgress.unlockedLevel = Math.max(nextProgress.unlockedLevel || 0, levelIndex + 1);
  return nextProgress;
}

function normalizeStars(stars, levelCount) {
  return Array.from({ length: levelCount }, (_, index) => {
    const value = Array.isArray(stars) ? stars[index] : 0;
    return Math.max(0, Math.min(3, Math.floor(value || 0)));
  });
}

function loadFutureLeaderboardRows(entries) {
  return Array.isArray(entries) ? entries.slice(0, 20) : [];
}

function sanitizeFutureName(name) {
  const value = String(name || "PLAYER").trim().slice(0, 16);
  return value || "PLAYER";
}
