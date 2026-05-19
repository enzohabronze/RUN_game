const customRoot = "../assets/custom";

function playerSet(damage) {
  return {
    run: {
      fps: 10,
      frames: [
        `${customRoot}/player/run/damage-${damage}/frame-0.png`,
        `${customRoot}/player/run/damage-${damage}/frame-1.png`,
        `${customRoot}/player/run/damage-${damage}/frame-2.png`,
        `${customRoot}/player/run/damage-${damage}/frame-3.png`
      ]
    },
    turnLeft: {
      fps: 12,
      frames: [
        `${customRoot}/player/turn-left/damage-${damage}/frame-0.png`,
        `${customRoot}/player/turn-left/damage-${damage}/frame-1.png`
      ]
    },
    turnRight: {
      fps: 12,
      frames: [
        `${customRoot}/player/turn-right/damage-${damage}/frame-0.png`,
        `${customRoot}/player/turn-right/damage-${damage}/frame-1.png`
      ]
    },
    hit: {
      fps: 8,
      frames: [
        `${customRoot}/player/hit/damage-${damage}/frame-0.png`,
        `${customRoot}/player/hit/damage-${damage}/frame-1.png`
      ]
    }
  };
}

export const assetManifest = {
  assetVersion: "dev-10",
  usePlayerAnimations: true,
  player: `${customRoot}/player/player.png`,
  playerAnimations: {
    damage0: playerSet(0),
    damage1: playerSet(1),
    damage2: playerSet(2),
    damage3: playerSet(3)
  },
  road: null,
  decor: {
    left: [
      `${customRoot}/decor/left-1.png`,
      `${customRoot}/decor/left-2.png`,
      `${customRoot}/decor/left-3.png`
    ],
    right: [
      `${customRoot}/decor/right-1.png`,
      `${customRoot}/decor/right-2.png`,
      `${customRoot}/decor/right-3.png`
    ]
  },
  obstacles: {
    "obstacle-1-lvl1": `${customRoot}/obstacles/obstacle-1-lvl1.png`,
    "obstacle-2-lvl1": `${customRoot}/obstacles/obstacle-2-lvl1.png`,
    "obstacle-3-lvl1": `${customRoot}/obstacles/obstacle-3-lvl1.png`,
    "obstacle-1-lvl2": `${customRoot}/obstacles/obstacle-1-lvl2.png`,
    "obstacle-2-lvl2": `${customRoot}/obstacles/obstacle-2-lvl2.png`,
    "obstacle-3-lvl2": `${customRoot}/obstacles/obstacle-3-lvl2.png`,
    "obstacle-1-lvl3": `${customRoot}/obstacles/obstacle-1-lvl3.png`,
    "obstacle-2-lvl3": `${customRoot}/obstacles/obstacle-2-lvl3.png`,
    "obstacle-3-lvl3": `${customRoot}/obstacles/obstacle-3-lvl3.png`,
    "obstacle-4-lvl3": `${customRoot}/obstacles/obstacle-4-lvl3.png`,
    "obstacle-1-lvl4": `${customRoot}/obstacles/obstacle-1-lvl4.png`,
    "obstacle-2-lvl4": `${customRoot}/obstacles/obstacle-2-lvl4.png`,
    "obstacle-3-lvl4": `${customRoot}/obstacles/obstacle-3-lvl4.png`,
    "obstacle-4-lvl4": `${customRoot}/obstacles/obstacle-4-lvl4.png`,
    "obstacle-1-lvl5": `${customRoot}/obstacles/obstacle-1-lvl5.png`,
    "obstacle-2-lvl5": `${customRoot}/obstacles/obstacle-2-lvl5.png`,
    "obstacle-3-lvl5": `${customRoot}/obstacles/obstacle-3-lvl5.png`,
    "obstacle-4-lvl5": `${customRoot}/obstacles/obstacle-4-lvl5.png`,
    "obstacle-1-lvl6": `${customRoot}/obstacles/obstacle-1-lvl6.png`,
    "obstacle-2-lvl6": `${customRoot}/obstacles/obstacle-2-lvl6.png`,
    "obstacle-3-lvl6": `${customRoot}/obstacles/obstacle-3-lvl6.png`,
    "obstacle-4-lvl6": `${customRoot}/obstacles/obstacle-4-lvl6.png`,
    "obstacle-1-lvl7": `${customRoot}/obstacles/obstacle-1-lvl7.png`,
    "obstacle-2-lvl7": `${customRoot}/obstacles/obstacle-2-lvl7.png`,
    "obstacle-3-lvl7": `${customRoot}/obstacles/obstacle-3-lvl7.png`,
    "obstacle-4-lvl7": `${customRoot}/obstacles/obstacle-4-lvl7.png`,
    "obstacle-1-lvl8": `${customRoot}/obstacles/obstacle-1-lvl8.png`,
    "obstacle-2-lvl8": `${customRoot}/obstacles/obstacle-2-lvl8.png`,
    "obstacle-3-lvl8": `${customRoot}/obstacles/obstacle-3-lvl8.png`,
    "obstacle-4-lvl8": `${customRoot}/obstacles/obstacle-4-lvl8.png`,
    "obstacle-1-lvl9": `${customRoot}/obstacles/obstacle-1-lvl9.png`,
    "obstacle-2-lvl9": `${customRoot}/obstacles/obstacle-2-lvl9.png`,
    "obstacle-3-lvl9": `${customRoot}/obstacles/obstacle-3-lvl9.png`,
    "obstacle-4-lvl9": `${customRoot}/obstacles/obstacle-4-lvl9.png`,
    "obstacle-1-lvl10": `${customRoot}/obstacles/obstacle-1-lvl10.png`,
    "obstacle-2-lvl10": `${customRoot}/obstacles/obstacle-2-lvl10.png`,
    "obstacle-3-lvl10": `${customRoot}/obstacles/obstacle-3-lvl10.png`,
    "obstacle-4-lvl10": `${customRoot}/obstacles/obstacle-4-lvl10.png`,
    "obstacle-5-lvl10": `${customRoot}/obstacles/obstacle-5-lvl10.png`
  },
  pickups: {
    "item-1-lvl1": `${customRoot}/pickups/item-1-lvl1.png`,
    "item-2-lvl1": `${customRoot}/pickups/item-2-lvl1.png`,
    "item-1-lvl2": `${customRoot}/pickups/item-1-lvl2.png`,
    "item-2-lvl2": `${customRoot}/pickups/item-2-lvl2.png`,
    "item-1-lvl3": `${customRoot}/pickups/item-1-lvl3.png`,
    "item-2-lvl3": `${customRoot}/pickups/item-2-lvl3.png`,
    "item-1-lvl4": `${customRoot}/pickups/item-1-lvl4.png`,
    "item-2-lvl4": `${customRoot}/pickups/item-2-lvl4.png`,
    "item-1-lvl5": `${customRoot}/pickups/item-1-lvl5.png`,
    "item-2-lvl5": `${customRoot}/pickups/item-2-lvl5.png`,
    "item-1-lvl6": `${customRoot}/pickups/item-1-lvl6.png`,
    "item-2-lvl6": `${customRoot}/pickups/item-2-lvl6.png`,
    "item-1-lvl7": `${customRoot}/pickups/item-1-lvl7.png`,
    "item-2-lvl7": `${customRoot}/pickups/item-2-lvl7.png`,
    "item-1-lvl8": `${customRoot}/pickups/item-1-lvl8.png`,
    "item-2-lvl8": `${customRoot}/pickups/item-2-lvl8.png`,
    "item-1-lvl9": `${customRoot}/pickups/item-1-lvl9.png`,
    "item-2-lvl9": `${customRoot}/pickups/item-2-lvl9.png`,
    "item-1-lvl10": `${customRoot}/pickups/item-1-lvl10.png`,
    "item-2-lvl10": `${customRoot}/pickups/item-2-lvl10.png`
  },
  backgrounds: {
    menu: `${customRoot}/backgrounds/menu.png`,
    pause: `${customRoot}/backgrounds/pause.png`,
    gameOver: `${customRoot}/backgrounds/game-over.png`,
    levelComplete: `${customRoot}/backgrounds/level-complete.png`,
    levels: [
      `${customRoot}/backgrounds/levels/level-1.png`,
      `${customRoot}/backgrounds/levels/level-2.png`,
      `${customRoot}/backgrounds/levels/level-3.png`,
      `${customRoot}/backgrounds/levels/level-4.png`,
      `${customRoot}/backgrounds/levels/level-5.png`,
      `${customRoot}/backgrounds/levels/level-6.png`,
      `${customRoot}/backgrounds/levels/level-7.png`,
      `${customRoot}/backgrounds/levels/level-8.png`,
      `${customRoot}/backgrounds/levels/level-9.png`,
      `${customRoot}/backgrounds/levels/level-10.png`
    ]
  },
  ui: {
    buttons: {
      primary: {
        normal: `${customRoot}/ui/buttons/primary-normal.png`,
        hover: `${customRoot}/ui/buttons/primary-hover.png`,
        active: `${customRoot}/ui/buttons/primary-active.png`
      },
      secondary: {
        normal: `${customRoot}/ui/buttons/secondary-normal.png`,
        hover: `${customRoot}/ui/buttons/secondary-hover.png`,
        active: `${customRoot}/ui/buttons/secondary-active.png`
      }
    },
    icons: {
      cargo: `${customRoot}/ui/icons/cargo.png`,
      items: `${customRoot}/ui/icons/items.png`,
      route: `${customRoot}/ui/icons/route.png`,
      level: `${customRoot}/ui/icons/level.png`,
      pause: `${customRoot}/ui/icons/pause.png`
    },
    stars: {
      full: `${customRoot}/ui/stars/star-full.png`,
      empty: `${customRoot}/ui/stars/star-empty.png`
    },
    titles: {
      menu: `${customRoot}/ui/titles/menu.png`,
      pause: `${customRoot}/ui/titles/pause.png`,
      levelComplete: `${customRoot}/ui/titles/level-complete.png`,
      gameOver: `${customRoot}/ui/titles/game-over.png`
    }
  },
  audio: {
    musicVolume: 0.42,
    sfxVolume: 0.72,
    music: {
      menu: `${customRoot}/audio/music/menu.mp3`,
      levels: [
        `${customRoot}/audio/music/level-1.mp3`,
        `${customRoot}/audio/music/level-2.mp3`,
        `${customRoot}/audio/music/level-3.mp3`,
        `${customRoot}/audio/music/level-4.mp3`,
        `${customRoot}/audio/music/level-5.mp3`,
        `${customRoot}/audio/music/level-6.mp3`,
        `${customRoot}/audio/music/level-7.mp3`,
        `${customRoot}/audio/music/level-8.mp3`,
        `${customRoot}/audio/music/level-9.mp3`,
        `${customRoot}/audio/music/level-10.mp3`
      ]
    },
    sfx: {
      button: `${customRoot}/audio/sfx/button.mp3`,
      start: `${customRoot}/audio/sfx/start.mp3`,
      pause: `${customRoot}/audio/sfx/pause.mp3`,
      resume: `${customRoot}/audio/sfx/resume.mp3`,
      lane: `${customRoot}/audio/sfx/lane.mp3`,
      pickupPackage: `${customRoot}/audio/sfx/pickup-package.mp3`,
      pickupRepair: `${customRoot}/audio/sfx/pickup-repair.mp3`,
      hitCone: `${customRoot}/audio/sfx/hit-cone.mp3`,
      hitCrate: `${customRoot}/audio/sfx/hit-crate.mp3`,
      hitPothole: `${customRoot}/audio/sfx/hit-pothole.mp3`,
      hitBarrier: `${customRoot}/audio/sfx/hit-barrier.mp3`,
      hitOil: `${customRoot}/audio/sfx/hit-oil.mp3`,
      cargoLow: `${customRoot}/audio/sfx/cargo-low.mp3`,
      levelComplete: `${customRoot}/audio/sfx/level-complete.mp3`,
      gameOver: `${customRoot}/audio/sfx/game-over.mp3`
    }
  }
};

// Все рабочие ассеты игры лежат в assets/custom и должны быть PNG.
// По умолчанию игрок берется из player/player.png.
// Когда будут готовы все кадры анимации, можно поставить usePlayerAnimations: true.
// damage0 = груз 76-100%, damage1 = 51-75%, damage2 = 26-50%, damage3 = 0-25%.
// Меняй только пути или сами PNG-файлы, ключи player/run/turnLeft/turnRight/hit лучше не переименовывать.
