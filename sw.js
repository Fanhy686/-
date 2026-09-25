/* 四级备考工作台 · Service Worker（离线可开 + 添加到主屏幕） */
const CACHE = 'cet4-v1';
const ASSETS = [
  './', 'index.html', 'vocab.html', 'listening.html', 'reading.html',
  'writing.html', 'translation.html', 'quiz.html', 'checkin.html',
  'manifest.webmanifest', 'icon.svg',
  'assets/css/styles.css',
  'assets/js/store.js', 'assets/js/app.js',
  'assets/js/vocab-data.js', 'assets/js/vocab.js',
  'assets/js/listening-data.js', 'assets/js/listening.js',
  'assets/js/reading-data.js', 'assets/js/reading.js',
  'assets/js/writing-data.js', 'assets/js/writing.js',
  'assets/js/translation-data.js', 'assets/js/translation.js',
  'assets/js/quiz-data.js', 'assets/js/quiz.js',
  'assets/js/checkin.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
