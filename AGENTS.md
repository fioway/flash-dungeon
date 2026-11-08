# Flash Dungeon: agent instructions

Read this before changing anything. It is the single source of truth for coding agents (Copilot, Claude Code, others). If a request conflicts with it, say so and ask.

## What this project is
- A very simple, Flash-era-style 2D browser game. Short sessions, one screen at a time, a handful of object types, basic collision.
- **Web first.** The owner will test engagement on the web, iterate until the numbers are good, and only then consider iOS (App Store) and PC (Steam).
- Owner goals: (1) earn enough to cover development costs (AI tokens, store listing fees), (2) have a portfolio project that shows product-management skill: defining metrics, instrumenting, iterating, and making ship-or-stop decisions from data.
- Repo is **public** and auto-deploys to GitHub Pages (`https://fioway.github.io/flash-dungeon/`) on every push to `main`.

## Stack (do not change without asking)
- **Phaser 4.2.1.** Most tutorials and training data are for Phaser 3. APIs differ between major versions: check `package.json` for the installed version and verify against the Phaser 4 docs before using an API from memory.
- **Vite** for dev server and build. **TypeScript in strict mode**, ES modules, no framework. Keep `strict` on: avoid `any` and `@ts-ignore` (explain in a comment if one is truly needed), and give event props, level data, and platform interfaces real types.
- **Node 22 LTS.** `npm ci` in CI, `npm install` locally.
- Runtime dependencies: Phaser only. Ask before adding any dependency.
- Commands: `npm run dev`, `npm run typecheck`, `npm run build` (runs the type check first, so type errors fail the deploy), `npm run preview`.
- `vite.config.js` sets `base: './'` (relative). Keep it, so the build works on GitHub Pages subpaths, itch.io, and inside a Capacitor wrapper.

## Structure
```
index.html                      page shell
src/main.ts                     game config and boot
src/scenes/                     one scene per file
src/analytics/track.ts          the ONLY place analytics code lives
public/assets/                  images, audio, level files
CREDITS.md                      source and license of every third-party asset
.github/workflows/deploy.yml    builds and deploys to GitHub Pages on push to main
```
Keep files small and modular so edits need little context. Split new scenes (menu, game, UI overlay, game over) into separate files rather than growing one.

## Platform targets and what that means now
- **Today: web only.** Free hosting, no purchases, no ads.
- **Possible later:** iOS via Capacitor wrapping the same web build; Steam via a desktop wrapper (Electron or similar). Do not add Capacitor, Electron, or any native/store code until the owner asks.
- Write code that will survive that move:
  - **Touch, keyboard, and (later) gamepad must all map to the same internal actions.** Never wire gameplay directly to one device.
  - **Design mobile-first:** base resolution 480x270, `Phaser.Scale.FIT`, `pixelArt: true`, integer scaling where possible, support portrait and landscape, respect safe-area insets (notches).
  - **Audio must be unlocked by the first user tap/click** (browsers and iOS Safari block it otherwise). Handle this early; silent failure on iOS is the classic bug.
  - **Storage can be blocked** (e.g. inside itch.io iframes). Any `localStorage`/`sessionStorage` use goes in try/catch and the game must work without it.
  - Keep load size small: texture atlases, compressed audio, no unoptimized images. Load time hurts the engagement numbers the owner is trying to measure.

## Monetization (design for it, do not build it yet)
- **No ads. Ever.** Do not add ad SDKs or ad placements.
- The owner is considering non-essential purchases (better equipment, extra level packs) and/or a low flat price (~$1) on iOS/Steam, with the web version free and unlocked. Not decided. **Do not implement purchases** until asked.
- When purchases are added later: route everything through one internal interface ("does the player own item X?") with a separate backend per platform (Apple In-App Purchase, Steam, web). Gameplay code must never call a store SDK directly.
- Design rule: the game must be fully completable and fun without buying anything. Be wary of paid items that make the game meaningfully easier or that undercut the difficulty curve.
- No accounts, no game server. Purchases and saves stay per-platform.

## Analytics and privacy (important)
- All analytics goes through `track(eventName, props)` in `src/analytics/track.ts`. **Never call an analytics SDK or `fetch` for telemetry anywhere else.**
- Events are anonymous. **Never log** names, emails, precise location, IP addresses, free-text input, or anything that identifies a person.
- Every event automatically carries the build version and a random in-memory session ID.
- The **persistent player ID** (needed for day-1/day-7 retention) is OFF by default (`ENABLE_PERSISTENT_ID = false`). Do not turn it on without the owner. Turning it on requires updating the privacy policy and deciding whether a consent prompt is needed.
- Do not add cross-site/cross-app tracking, cookies, or fingerprinting. Keep any consent need minimal.
- The game is for a **general audience, not aimed at children.** Do not add features or marketing that target kids (this triggers COPPA-style rules).
- A privacy policy must exist before real traffic or a store listing, and it must match exactly what `track()` sends. If you change what is collected, flag that the policy needs updating.
- Planned event set (names stable, add properties sparingly):

| Event | Properties | Answers |
|---|---|---|
| `session_start` | device (mobile/desktop), referrer category | where do players come from |
| `tutorial_complete` | seconds | is onboarding clear |
| `level_start` | level | where do players go |
| `level_complete` | level, seconds, attempts | is difficulty paced well |
| `level_fail` | level, cause | what frustrates players |
| `session_end` | duration, last level | where do players drop off |
| `paid_preview_seen` (later) | pack | is there demand for paid content |

- Derived metrics the owner cares about: tutorial completion %, per-level funnel and drop-off, attempts per level, median session length (use median, not mean), day-1/day-7 return (once the ID is enabled). **Engagement thresholds have not been set yet**: ask the owner before tuning toward a target.
- Keep a short experiment log in `docs/experiments.md` (create it at the first iteration): hypothesis, change, metric before/after, sample size, decision (keep/revert/move on). Note small samples honestly; this log is portfolio material.

## Assets and licensing
- **Never commit or reference art, audio, fonts, or code you do not have the rights to.** This includes Nintendo/Zelda sprites and any other copyrighted game rips, even "just as placeholders". The repo is public and deployed, so placeholders ship.
- Placeholders must be CC0 or similarly licensed: Ninja Adventure Asset Pack (itch.io), Kenney.nl packs (Tiny Dungeon, Tiny Town), or OpenGameArt items with a verified license.
- Record the name, source URL, author, and license of every third-party asset in `CREDITS.md` when it is added.
- The owner will replace placeholders with their own pixel art (Aseprite/Piskel). Target **16x16** sprites; match placeholder size to final size so hitboxes and layouts do not change on swap.
- **Always load assets by key** (`'player'`, `'sword'`), never by hard-coded path inside gameplay code, so swapping art is a file replacement.
- Pixel art must stay crisp: nearest-neighbor scaling, `pixelArt: true`.

## Levels
- Levels are **data, not code**: JSON files, or Tiled (free map editor) exports loaded with Phaser's tilemap loader. Do not hard-code level layouts in scenes.
- Do **not** build a custom level editor unless the owner asks. Hand-written JSON or Tiled covers a game this small.
- Tiled layer and object names must match what the code expects; check them when loading.

## Security and repo hygiene
- The repo is public. **Never commit secrets:** API keys, tokens, `.env` files, cloud or AI-service credentials. `.env*` is gitignored.
- A public analytics project key is fine in client code. A secret or personal API key is not. If a secret is ever committed, deleting it is not enough: tell the owner to revoke it immediately.
- **Git identity:** commit with the GitHub noreply address `344678241+fioway@users.noreply.github.com`, never the owner's personal email.
- `main` deploys automatically. **Do not leave `main` broken.** Run `npm run build` and fix errors before pushing. Do risky or experimental work on a branch and merge when it works. GitHub's Pages environment only deploys from `main`.
- Keep commits small and frequent so any change can be reverted for free.

## Phaser pitfalls to avoid
- Version confusion (see Stack). Do not paste Phaser 3 code without checking it against v4.
- Putting everything in one scene. Split early.
- **Memory leaks:** destroy sprites, listeners, timers, and tweens when a scene shuts down (`this.events.once('shutdown', ...)`). Long sessions otherwise slow down.
- Arcade physics is fast but limited (no rotated shapes, no realistic stacking). Do not stretch it; raise it with the owner if the design needs more.
- Scaling and resolution problems are easier to design in than to retrofit.
- Mobile web views (including a future Capacitor wrapper) differ from desktop Chrome in audio, touch, and performance. Prefer verified behavior on a real phone over assumptions.

## How to work (token- and time-efficient)
- Work in **small vertical slices**: get one mechanic or screen working before the next. Run it before starting the next change.
- For anything non-trivial, give a short plan first and wait for a go-ahead before writing lots of code.
- **Return only the changed function or a diff**, not whole rewritten files.
- Do not read the whole codebase for a narrow change; open only the files involved.
- Use scripts and tools for mechanical work (slicing sprite sheets, generating level JSON, batch-resizing with nearest-neighbor) instead of doing it by hand.
- Prefer the simplest thing that works. This is a deliberately small game: no abstractions, systems, or dependencies "for later" unless asked.
- State assumptions and anything unverified (for example, "not tested on a phone") plainly. Do not claim something works until it has been built or run.
- Record project decisions in this file so they are not re-litigated.

## Do not, without asking the owner
- Add dependencies, a game server, accounts, or a database.
- Add ads, purchases, wrappers (Capacitor/Electron), or store code.
- Enable the persistent player ID or add new data collection.
- Change the stack, loosen TypeScript strictness, change the base resolution, or change `base: './'`.
- Use any third-party asset not listed in `CREDITS.md`.
