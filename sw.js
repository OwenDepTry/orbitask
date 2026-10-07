/* ==========================================================================
   Orbitask service worker
   - Lưu sẵn các file của web để dùng được khi mất mạng (PWA).
   - Hiện thông báo nhắc việc (bắt buộc trên Chrome Android).
   - Chỉ hoạt động khi web chạy qua http(s): localhost hoặc sau khi deploy.

   KHI SỬA CODE VÀ DEPLOY LẠI: tăng số phiên bản CACHE (vd 'orbitask-v3')
   để người dùng nhận bản mới thay vì bản đã lưu.
   ========================================================================== */
const CACHE = 'orbitask-v3';
const APP_SHELL = [
  './',
  'index.html',
  'app.html',
  'config.js',
  'manifest.webmanifest',
  'favicon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png'
];

// Cài đặt: lưu sẵn các file chính (file nào thiếu thì bỏ qua, không làm hỏng cả quá trình)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => Promise.allSettled(APP_SHELL.map((url) => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

// Kích hoạt: xóa cache của phiên bản cũ
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Font Google: lấy từ cache trước (ít thay đổi)
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      }))
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Trang HTML: ưu tiên mạng (để luôn thấy bản mới), mất mạng thì dùng bản đã lưu
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req, { ignoreSearch: true })
          .then((hit) => hit || caches.match('app.html')))
    );
    return;
  }

  // File khác (ảnh, config.js…): trả bản đã lưu ngay, đồng thời cập nhật ngầm
  event.respondWith(
    caches.match(req).then((hit) => {
      const network = fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => hit);
      return hit || network;
    })
  );
});

// Bấm vào thông báo → mở lại (hoặc focus) tab Orbitask
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ('focus' in client) return client.focus();
      }
      return self.clients.openWindow('app.html');
    })
  );
});
