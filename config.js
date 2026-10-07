/* ==========================================================================
   ORBITASK — THÔNG TIN TÁC GIẢ & LIÊN HỆ
   --------------------------------------------------------------------------
   Owen chỉ cần sửa phần CẤU HÌNH bên dưới. File này dùng chung cho cả
   index.html (landing) và app.html, nên sửa một chỗ là cập nhật cả hai.

   • Để trống ''  → mục đó tự ẩn, không hiện link hỏng.
   • Link mạng xã hội phải bắt đầu bằng https://
   • Lưu ý quyền riêng tư: không nên để số điện thoại / địa chỉ nhà ở đây,
     vì đây là web công khai.
   ========================================================================== */

window.ORBITASK_CONFIG = {
  author: 'Owen',
  version: '2.0',

  // Ảnh đại diện (không bắt buộc). Bỏ file ảnh vào cùng thư mục rồi ghi tên file,
  // vd: 'owen.jpg'. Nên dùng ảnh vuông ~400×400px, dưới 200KB.
  // Để trống '' → hiện chữ cái đầu của tên.
  avatar: 'owen.jpg',

  contact: {
    email: 'tiendatsgu298@gmail.com',
    github: 'https://github.com/OwenDepTry',
    facebook: '',   // vd: 'https://facebook.com/ten-cua-ban'
    linkedin: '',   // vd: 'https://linkedin.com/in/ten-cua-ban'
    feedback: 'https://docs.google.com/forms/d/e/1FAIpQLSdJle2Lma3chhwwqi_1tr5f-6ehph95Os5R6U5EWl_ImcV4kQ/viewform?usp=publish-editor'   // link Google Form góp ý
  }
};


/* ==========================================================================
   PHẦN DƯỚI ĐÂY KHÔNG CẦN SỬA — tự điền thông tin vào trang
   - [data-author]            → tên tác giả
   - [data-version]           → số phiên bản
   - [data-contact-list]      → danh sách link liên hệ ("icons" hoặc "labels")
   - [data-feedback]          → nút Góp ý / Báo lỗi (ẩn nếu chưa có email/form)
   - [data-avatar]            → ảnh đại diện (hoặc chữ cái đầu nếu chưa có ảnh)
   ========================================================================== */
(function () {
  'use strict';
  const cfg = window.ORBITASK_CONFIG || {};
  const c = cfg.contact || {};

  const svg = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const ICONS = {
    email: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
    github: svg('<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 00-1.3-3.2 4.2 4.2 0 00-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 00-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 00-.1 3.2A4.6 4.6 0 004 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>'),
    facebook: svg('<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>'),
    linkedin: svg('<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>')
  };

  const isWeb = (url) => /^https?:\/\//i.test(url || '');
  const items = [
    c.email && { key: 'email', label: 'Email', href: `mailto:${c.email}` },
    isWeb(c.github) && { key: 'github', label: 'GitHub', href: c.github },
    isWeb(c.facebook) && { key: 'facebook', label: 'Facebook', href: c.facebook },
    isWeb(c.linkedin) && { key: 'linkedin', label: 'LinkedIn', href: c.linkedin }
  ].filter(Boolean);

  const feedback = isWeb(c.feedback)
    ? c.feedback
    : (c.email ? `mailto:${c.email}?subject=${encodeURIComponent('Góp ý cho Orbitask')}` : '');

  function openInNewTab(a) {
    if (!a.href.startsWith('mailto:')) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
  }

  function fill() {
    document.querySelectorAll('[data-author]').forEach(el => { el.textContent = cfg.author || 'Owen'; });
    document.querySelectorAll('[data-version]').forEach(el => { el.textContent = cfg.version || '1.0'; });

    document.querySelectorAll('[data-contact-list]').forEach(list => {
      const withLabel = list.dataset.contactList === 'labels';
      list.replaceChildren(...items.map(it => {
        const a = document.createElement('a');
        a.className = 'contact-link' + (withLabel ? ' contact-link--label' : '');
        a.href = it.href;
        a.setAttribute('aria-label', `${it.label} của ${cfg.author || 'Owen'}`);
        a.innerHTML = ICONS[it.key];
        if (withLabel) {
          const span = document.createElement('span');
          span.textContent = it.label;
          a.append(span);
        }
        openInNewTab(a);
        return a;
      }));
      list.hidden = items.length === 0;
    });

    // Nút góp ý: mở thẳng email / form. Chưa có liên hệ → ẩn hẳn (không dẫn vào chỗ trống)
    document.querySelectorAll('[data-feedback]').forEach(el => {
      if (feedback) { el.href = feedback; openInNewTab(el); el.hidden = false; }
      else el.hidden = true;
    });

    // Ảnh đại diện: chỉ thay chữ cái bằng ảnh khi ảnh tải được (tránh hiện ảnh lỗi)
    const initial = (cfg.author || 'O').trim().charAt(0).toUpperCase();
    document.querySelectorAll('[data-avatar]').forEach(el => {
      el.textContent = initial;
      if (!cfg.avatar) return;
      const img = new Image();
      img.alt = '';
      img.decoding = 'async';
      img.onload = () => { el.replaceChildren(img); el.classList.add('has-photo'); };
      img.src = cfg.avatar;
    });

    if (!items.length && !feedback) {
      console.info('[Orbitask] Chưa có thông tin liên hệ: điền email / GitHub... trong config.js để hiện nút góp ý.');
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fill);
  else fill();
})();
