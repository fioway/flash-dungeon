# Flash Dungeon

A simple Flash-style 2D browser game built with Phaser and Vite.

## Run it

```
npm install
npm run dev       # local dev server with hot reload
npm run typecheck  # type-check without building
npm run build      # type-check, then production build into dist/
npm run preview   # serve the production build locally
```

Requires a current Node.js LTS.

## Structure

```
index.html                      page shell
vite.config.js                  build config (relative base for any host)
src/main.ts                     game config and boot
src/scenes/GameScene.ts         placeholder scene (movement via keys or touch)
src/analytics/track.ts          the only place analytics code lives
public/assets/                  images, audio, level files
.github/copilot-instructions.md conventions for AI coding tools
```

## Analytics

All events go through `track(name, props)`. With no `ENDPOINT` set, events are
printed to the browser console only. The persistent player ID (needed for
day-1 / day-7 retention) is off by default; see `src/analytics/track.ts`
before turning it on, and update the privacy policy when you do.

## Deploying

`npm run build`, then upload the contents of `dist/` to itch.io (zip it, mark
as HTML5), Cloudflare Pages, or GitHub Pages.

## Credits

Record the source and license of every third-party asset in `CREDITS.md`.
