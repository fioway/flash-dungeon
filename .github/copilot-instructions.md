# Project instructions

Flash Dungeon: a simple 2D browser game. Web first, possibly iOS (Capacitor) and Steam (Electron) later.

## Stack
- Phaser (check package.json for the exact version; do not suggest APIs from other major versions)
- Vite, plain JavaScript (ES modules)
- No other runtime dependencies unless asked

## Structure
- `src/main.js`: game config and boot
- `src/scenes/`: one scene per file
- `src/analytics/track.js`: the only place analytics code lives
- `public/assets/`: images, audio, level JSON

## Rules
- All analytics goes through `track(eventName, props)`. Never call an analytics SDK directly.
- Never log personal data (names, emails, precise location, free text).
- Input must work with touch, keyboard, and (later) gamepad, mapped to the same actions.
- Load assets by key (`'player'`, `'sword'`), never by hard-coded path inside gameplay code, so placeholder art can be swapped for final art.
- Use pixel-art settings (`pixelArt: true`, integer scaling where possible).
- Destroy listeners, timers, and tweens when a scene shuts down.
- Keep files small and modular. Prefer returning only the changed function over rewriting whole files.
- Levels are data (JSON or Tiled), not hard-coded.
- Only use art, sound, and fonts with a license that allows commercial use; record the source in `CREDITS.md`.
