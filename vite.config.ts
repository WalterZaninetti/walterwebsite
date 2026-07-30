import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Import *.svg?react as a React component (tree-shakeable, no extra
    // network request) while still allowing plain `import url from './x.svg'`.
    svgr({ svgrOptions: { icon: true } }),
    // Re-compresses raster/svg assets at build time so nothing oversized
    // ever reaches the bundle just because someone forgot to run it through
    // an image tool first.
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { quality: 80 },
      avif: { quality: 60 },
      svg: { multipass: true },
    }),
    // `npm run analyze` opens dist/stats.html with a treemap of what's in
    // each chunk, gzip/brotli sizes included.
    ...(process.env.ANALYZE
      ? [
          visualizer({
            filename: 'dist/stats.html',
            gzipSize: true,
            brotliSize: true,
            open: true,
          }),
        ]
      : []),
  ],

  build: {
    target: 'es2022',
    cssCodeSplit: true,
    sourcemap: false,
    // Anything smaller than this is inlined as a data URI instead of
    // becoming a separate request (good for icons, bad for photos).
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        // Split framework code from app code so the framework chunk stays
        // byte-for-byte identical (and cached) across deploys.
        manualChunks(id) {
          if (id.includes('node_modules/react')) {
            return 'react';
          }
        },
      },
    },
  },
});
