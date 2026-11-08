import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base so the build works on itch.io, GitHub Pages subpaths,
  // and inside a Capacitor wrapper later.
  base: './',
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 2000, // Phaser is large; this silences the warning
  },
});
