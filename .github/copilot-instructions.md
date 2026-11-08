# Copilot instructions

The full project instructions are in `AGENTS.md` at the repo root. Read it first; it is the source of truth.

Hard rules, repeated here so they are never missed:
- Phaser 4 (see `package.json`), Vite, strict TypeScript. Do not use Phaser 3 APIs without checking them against v4. No new dependencies without asking.
- All analytics goes through `track()` in `src/analytics/track.ts`. Never log personal data. The persistent player ID stays off unless the owner says otherwise.
- No ads. Do not implement purchases, Capacitor, Electron, or accounts until asked.
- Never commit secrets (the repo is public) or any asset without a verified license. No Nintendo/Zelda or other copyrighted game art, even as placeholders. Record every asset in `CREDITS.md`.
- Load assets by key, make levels data (JSON/Tiled), and map touch, keyboard, and gamepad to the same actions.
- `main` auto-deploys to GitHub Pages. Run `npm run build` before pushing and do not leave `main` broken.
- Return only the changed function or a diff, work in small slices, and say what you did not test.
