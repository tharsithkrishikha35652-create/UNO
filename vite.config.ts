import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { rmSync } from 'node:fs';
import { resolve } from 'node:path';

export default defineConfig({
  envDir: './src',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'exclude-release-apks-from-web-assets',
      apply: 'build',
      closeBundle() {
        // Vite copies public/ into dist; APKs are copied to dist only after the web build.
        rmSync(resolve(process.cwd(), 'dist/release-apk'), { recursive: true, force: true });
        // Remove APKs left by older release scripts from Vite's public source directory.
        rmSync(resolve(process.cwd(), 'public/release-apk'), { recursive: true, force: true });
      },
    },
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: ['localhost', '127.0.0.1', '.local'],
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
  build: {
    sourcemap: false,
  },
});
