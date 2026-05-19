# Audio files

All game audio lives here. Replace these WAV placeholders with your own files using the same names, or change paths in `src/assetManifest.js`.

## Music

```text
assets/custom/audio/music/menu.wav
assets/custom/audio/music/level-1.wav
assets/custom/audio/music/level-2.wav
assets/custom/audio/music/level-3.wav
assets/custom/audio/music/level-4.wav
```

Music is looped automatically. Recommended final format: `.mp3`, `.ogg`, or `.wav`. If you change the extension, also change the path in `src/assetManifest.js`.

## Sound effects

```text
assets/custom/audio/sfx/button.wav
assets/custom/audio/sfx/start.wav
assets/custom/audio/sfx/pause.wav
assets/custom/audio/sfx/resume.wav
assets/custom/audio/sfx/lane.wav
assets/custom/audio/sfx/pickup-package.wav
assets/custom/audio/sfx/pickup-repair.wav
assets/custom/audio/sfx/hit-cone.wav
assets/custom/audio/sfx/hit-crate.wav
assets/custom/audio/sfx/hit-pothole.wav
assets/custom/audio/sfx/hit-barrier.wav
assets/custom/audio/sfx/hit-oil.wav
assets/custom/audio/sfx/cargo-low.wav
assets/custom/audio/sfx/level-complete.wav
assets/custom/audio/sfx/game-over.wav
```

Short UI/action sounds usually work best at `0.05-0.4` seconds. Win/lose sounds can be longer, around `0.5-2` seconds.
