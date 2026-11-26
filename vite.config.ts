import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import config from './mockup.config.ts'

const root = path.dirname(fileURLToPath(import.meta.url))

// Static build for potential-mockups: relative base + hash routing, so the folder works under
// any sub-path (/<client>/<mockup>/ and /_preview/...). No CDN at runtime.
export default defineConfig({
  base: './',
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: path.resolve(root, 'src/routes'),
      generatedRouteTree: path.resolve(root, 'src/routeTree.gen.ts'),
      quoteStyle: 'single',
      semicolons: false,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(root, 'src'),
      '@shared': path.resolve(root, 'shared'),
      '@config': path.resolve(root, 'mockup.config.ts'),
    },
  },
  server: { port: config.devPort, host: '127.0.0.1', strictPort: true },
  preview: { port: config.previewPort, host: '127.0.0.1', strictPort: true },
  build: {
    outDir: path.resolve(root, 'dist', config.clientSlug, config.mockupSlug),
    emptyOutDir: true,
    assetsInlineLimit: 0,
  },
})
