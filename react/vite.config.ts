import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { mockApi } from './mock-api/plugin.js';

export default defineConfig({
  // The API lives inside the dev server: fetch('/api/...') just works, no second process.
  plugins: [react(), mockApi()],
  server: { port: 5180 },
});
