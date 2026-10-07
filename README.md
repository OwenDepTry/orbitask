# Orbitask

App quản lý công việc dạng Kanban: miễn phí, riêng tư, cài được như app.
Thiết kế & phát triển bởi **Owen**.

**Tính năng (v2.0)**

- Nhiều bảng Kanban (Cần làm → Đang làm → Hoàn thành), kéo thả, sắp xếp tự động hoặc thủ công
- Checklist các bước nhỏ, nhãn (`#học`, `#CLB`…), việc lặp lại hằng ngày / tuần / tháng
- Nhắc hạn chót: thanh nhắc trong app, thông báo trình duyệt, thêm vào Google Calendar / Lịch iPhone
- Xem dạng lịch tháng và thống kê số việc hoàn thành mỗi tuần
- Cài lên màn hình chính (PWA), dùng được khi mất mạng, chế độ sáng / tối
- Dữ liệu lưu ngay trong trình duyệt, xuất / nhập file sao lưu

---

## 1. Cấu trúc thư mục

```
orbitask/
├── index.html            Landing page (trang chủ)
├── app.html              App quản lý công việc
├── config.js             Tên tác giả, ảnh, liên hệ  ← Owen sửa ở đây
├── sw.js                 Service worker: dùng offline + thông báo
├── manifest.webmanifest  Thông tin để cài như app (tên, icon, màu)
├── favicon.svg           Icon trên tab trình duyệt
├── icons/                Icon app các cỡ (Android, iPhone)
├── og-image.png          Ảnh xem trước khi chia sẻ link
├── owen.jpg              Ảnh đại diện
├── netlify.toml          Cấu hình khi deploy lên Netlify
└── README.md             File bạn đang đọc
```

## 2. Chỉnh thông tin cá nhân

Mở `config.js` và sửa phần đầu file: tên, ảnh, email, GitHub, link Google Form góp ý.
Mục nào để trống `''` sẽ tự ẩn trên web.

## 3. Chạy thử trên máy

**Cách dễ nhất:** trong VS Code, cài extension **Live Server** → chuột phải `index.html` → **Open with Live Server**.

**Hoặc dùng terminal** (cần Python):

```bash
python -m http.server 8000
```

Rồi mở <http://localhost:8000>. Nhấn `Ctrl + C` để dừng.

> Mở file trực tiếp (bấm đúp vào `index.html`) vẫn xem được, nhưng **cài app, dùng offline
> và thông báo** chỉ hoạt động khi chạy qua `localhost` hoặc sau khi deploy.

---

## 4. Đưa lên mạng

### Cách 1: Netlify Drop (nhanh nhất, ~1 phút)

1. Vào <https://app.netlify.com/drop> và đăng nhập (có thể dùng tài khoản GitHub).
2. Kéo **cả thư mục Orbitask** thả vào trang.
3. Xong! Netlify cho bạn một link dạng `https://ten-ngau-nhien.netlify.app`.

Nhược điểm: mỗi lần sửa code phải kéo thả lại.

### Cách 2: GitHub + Netlify (khuyên dùng, tự cập nhật)

Đẩy code lên GitHub một lần, sau đó mỗi lần bạn cập nhật code, Netlify **tự deploy lại**.

**Bước 1: Đưa code lên GitHub.** Dễ nhất là dùng **GitHub Desktop** (<https://desktop.github.com>):

1. Đăng nhập tài khoản GitHub.
2. **File → Add local repository** → chọn thư mục Orbitask → bấm **create a repository**.
3. Ô **Summary** gõ `Orbitask v2.0` → bấm **Commit to main**.
4. Bấm **Publish repository** → bỏ tick *Keep this code private* nếu muốn công khai → **Publish**.

Hoặc dùng terminal trong VS Code (cần cài Git: <https://git-scm.com>):

```bash
git init
git add .
git commit -m "Orbitask v2.0"
git branch -M main
git remote add origin https://github.com/OwenDepTry/orbitask.git
git push -u origin main
```

(Tạo repo trống tên `orbitask` trên github.com trước khi chạy lệnh `git remote`.)

**Bước 2: Kết nối Netlify.**

1. Vào <https://app.netlify.com> → **Add new site → Import an existing project**.
2. Chọn **GitHub** → chọn repo `orbitask`.
3. Để nguyên các ô cài đặt (file `netlify.toml` đã cấu hình sẵn) → **Deploy**.
4. Đổi tên link cho đẹp: **Site configuration → Change site name** → vd `orbitask-owen`
   → link thành `https://orbitask-owen.netlify.app`.

**Từ giờ, mỗi lần cập nhật:** sửa code → Commit → **Push** (GitHub Desktop) → Netlify tự deploy sau ~30 giây.

> Vercel (<https://vercel.com>) hoặc GitHub Pages cũng dùng được với Orbitask, cách làm tương tự.

### Sau khi có link: 2 việc nhỏ

1. **Ảnh xem trước khi chia sẻ link.** Mở `index.html`, tìm dòng `og:image` và sửa thành link đầy đủ:

   ```html
   <meta property="og:image" content="https://orbitask-owen.netlify.app/og-image.png" />
   ```

   Zalo và Facebook cần link đầy đủ mới hiện được ảnh. Kiểm tra bằng
   <https://developers.facebook.com/tools/debug/>.

2. **Mỗi lần deploy bản mới:** mở `sw.js`, tăng số ở dòng `const CACHE = 'orbitask-v2';`
   (thành `v3`, `v4`…). Nếu quên, người đã cài app có thể vẫn thấy bản cũ.

---

## 5. Tên miền riêng (không bắt buộc)

1. Mua tên miền ở một nhà cung cấp (vd `orbitask.id.vn`, `orbitask.com`).
2. Trên Netlify: **Domain management → Add a domain** → nhập tên miền.
3. Làm theo hướng dẫn của Netlify để trỏ DNS (thường là thêm bản ghi tại trang quản lý tên miền).
4. Netlify tự cấp HTTPS miễn phí sau khi tên miền hoạt động.

Sau khi đổi tên miền, nhớ cập nhật lại link `og:image` trong `index.html`.

---

© 2026 Orbitask · Thiết kế & phát triển bởi Owen
