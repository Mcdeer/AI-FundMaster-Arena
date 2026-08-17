import { defineConfig } from 'vite';

export default defineConfig({
  base: '/AI-FundMaster-Arena/',
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:21818',
        changeOrigin: true,
      },
    },
  },
});