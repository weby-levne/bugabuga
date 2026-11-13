import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function offlineServiceWorker(): Plugin {
  return {
    name: 'offline-service-worker',
    apply: 'build',
    generateBundle(_options, bundle) {
      const files = Object.keys(bundle)
        .filter((file) => !file.endsWith('.map') && file !== 'sw.js')
        .map((file) => `./${file}`);
      const precache = JSON.stringify(['./', './index.html', './manifest.webmanifest', './icons/icon.svg', ...files]);
      const worker = `const CACHE_PREFIX = 'dss-offline-';\nconst CACHE_NAME = CACHE_PREFIX + 'v${Date.now()}';\nconst PRECACHE = ${precache};\n\nself.addEventListener('install', (event) => { event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())); });\nself.addEventListener('activate', (event) => { event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim())); });\nself.addEventListener('fetch', (event) => { const request = event.request; if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return; event.respondWith(caches.match(request).then((cached) => cached || (request.mode === 'navigate' ? caches.match('./index.html') : Response.error()))); });\n`;
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: worker });
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), offlineServiceWorker()],
});
