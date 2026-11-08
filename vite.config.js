import { defineConfig } from 'vite';
import packageJson from './package.json' with { type: 'json' };

export default defineConfig({
  define: {
    __BUILD_VERSION__: JSON.stringify(packageJson.version),
  },
  // Relative base so the build works on itch.io, GitHub Pages subpaths,
  // and inside a Capacitor wrapper later.
  base: './',
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 2000, // Phaser is large; this silences the warning
  },
});
