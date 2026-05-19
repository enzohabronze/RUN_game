# Future Features

These systems are prepared but disabled in `src/futureFeatures.js`.

## Feature Flags

All future systems are off by default:

```js
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
```

Switch a flag to `true` only when the UI and assets for that system are ready.

## Character Select

Two initial characters are prepared:

- `runner`: default balanced character.
- `mover`: more cargo protection and score gain, but slightly worse steering.

Suggested character stats:

- `startCargo`: cargo value at level start.
- `speedBonus`: flat speed modifier.
- `steeringMultiplier`: lane-change responsiveness.
- `damageMultiplier`: obstacle damage modifier.
- `scoreMultiplier`: points modifier.
- `magnetRadiusBonus`: extra magnet pickup radius.

Future assets can live here:

```text
assets/custom/future/characters/runner/
assets/custom/future/characters/mover/
```

## Leaderboard

Prepared storage key:

```text
cart-runner-future-leaderboard
```

Planned flow:

1. Game over opens name input.
2. Player enters a short name.
3. Result is saved locally in browser storage.
4. Main menu can open a leaderboard screen with name, score, level, stars, damage, and date.

This is a local leaderboard, not online.

## Expanded Pickups

Prepared pickup groups:

- `scoreSmall`: small score pickup.
- `scoreMedium`: medium score pickup.
- `scoreLarge`: rare high-score pickup.
- `invulnerability`: temporary obstacle immunity.
- `magnet`: pulls pickups toward the player.

Prepared but disabled animation flags:

- `powerupAnimations`: draws shield and magnet aura around the player.
- `obstacleHitAnimation`: adds extra impact particles on obstacle collision.
- `leaderboardCascade`: prepares leaderboard rows with staggered animation delays.

Future assets can live here:

```text
assets/custom/future/pickups/score-small.png
assets/custom/future/pickups/score-medium.png
assets/custom/future/pickups/score-large.png
assets/custom/future/pickups/invulnerability.png
assets/custom/future/pickups/magnet.png
```

## Level Select

Prepared storage key:

```text
cart-runner-future-progress
```

Planned rule:

- Level 1 is unlocked by default.
- Finishing a level unlocks the next one.
- Best star result per level is stored.
- Main menu can open a level select screen.

## Extra Gameplay Mechanics

Good next mechanics for this game:

- Pickup combo: collecting without damage increases score multiplier.
- Level objectives: each level can require a special goal.
- Risk lanes: dangerous lanes with better rewards.
- Cargo weight: more cargo gives more score but worsens steering.
- Daily route: one seeded challenge route with its own record table.
