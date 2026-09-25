/* 四级备考工作台 · Service Worker（离线可开 + 添加到主屏幕）
   策略：网络优先（在线永远拿最新内容），断网时回退缓存。 */
const CACHE = 'cet4-v6';
const ASSETS = [
  './', 'index.html', 'vocab.html', 'listening.html', 'reading.html',
  'writing.html', 'translation.html', 'checkin.html',
  'manifest.webmanifest', 'icon.svg',
  'assets/css/styles.css',
  'assets/js/store.js', 'assets/js/app.js', 'assets/js/scorer.js',
  'assets/js/vocab-data.js', 'assets/js/vocab-data-cet4b.js',
  'assets/js/vocab-data-cet6a.js', 'assets/js/vocab-data-cet6b.js', 'assets/js/vocab-data-cet6c.js',
  'assets/js/vocab-data-ext1.js', 'assets/js/vocab-data-ext2.js', 'assets/js/vocab-data-ext3.js',
  'assets/js/vocab-data-ext4.js', 'assets/js/vocab-data-ext5.js', 'assets/js/vocab-data-ext6.js',
  'assets/js/vocab-data-ext7.js', 'assets/js/vocab-data-ext8.js', 'assets/js/vocab-data-ext9.js',
  'assets/js/vocab-meta.js',
  'assets/js/vocab.js', 'assets/js/dictball.js',
  'assets/js/listening-data.js', 'assets/js/listening.js',
  'assets/js/reading-data.js', 'assets/js/reading-extra.js', 'assets/js/reading-daily.js', 'assets/js/reading.js',
  'assets/js/writing-data.js', 'assets/js/writing.js',
  'assets/js/translation-data.js', 'assets/js/translation.js',
  'assets/js/checkin.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // 外链请求不拦截

  e.respondWith(
    fetch(req).then(res => {
      if (res && res.status === 200) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => caches.match(req).then(hit => {
      if (hit) return hit;
      if (req.mode === 'navigate') return caches.match('index.html');
      return new Response('', { status: 504, statusText: 'offline' });
    }))
  );
});
