# Quota App - Alchemer Survey Quota Reporting

Ứng dụng web hiện đại để theo dõi và báo cáo quota của khảo sát Alchemer, được xây dựng với Vite, Bootstrap 5 và JavaScript.

## Tính năng

✨ **Cấu hình API linh hoạt**: Lưu API Key và Secret một lần, sử dụng cho mọi dự án.

🔗 **Tạo Link động cho từng dự án**: Tạo link báo cáo riêng biệt cho mỗi khảo sát với Survey ID và tên dự án tùy chỉnh.

📊 **Hiển thị quota trực quan**: 
- Bảng dữ liệu với Bootstrap styling
- Thanh tiến độ màu sắc (xanh/vàng/đỏ) theo trạng thái
- Tự động làm mới mỗi 5 phút

💾 **Lịch sử Link đã tạo**: Lưu trữ và quản lý tất cả các link đã tạo với khả năng xóa.

🎨 **Giao diện hiện đại**: Sử dụng Bootstrap 5 với font Inter từ Google Fonts.

## Cài đặt

```bash
# Clone repository
git clone https://github.com/phamdongdien19/quota-app-v1.git
cd quota-app-v1

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Mở trình duyệt và truy cập `http://localhost:5173`

## Cấu trúc Dự án

```
quota-app/
├── index.html          # Trang Viewer (hiển thị quota)
├── admin.html          # Trang Admin (cấu hình)
├── style.css           # CSS chung
├── src/
│   ├── viewer.js       # Logic trang Viewer
│   └── admin.js        # Logic trang Admin
├── vite.config.js      # Cấu hình Vite (multi-page + proxy)
└── package.json
```

## Sử dụng

### 1. Cấu hình API (Lần đầu)
- Truy cập `/admin.html`
- Nhập **API Key** và **API Secret** từ Alchemer
- Bấm **"Lưu Cấu Hình API"**

### 2. Tạo Link Báo Cáo
- Trong phần **"Tạo Link Báo Cáo"**:
  - Nhập **Tên Dự Án** (tùy chọn)
  - Nhập **Survey ID** (bắt buộc)
  - Bấm **"Tạo & Lưu Link"**
- Link sẽ tự động lưu vào **"Lịch sử Link đã tạo"**

### 3. Xem Báo Cáo
- Click nút **"Mở"** từ danh sách
- Hoặc truy cập trực tiếp: `/?id=SURVEY_ID&name=TEN_DU_AN`

## Build cho Production

```bash
npm run build
```

Files sẽ được tạo trong thư mục `dist/`.

**Lưu ý**: Đối với production, cần thiết lập proxy server để xử lý CORS cho Alchemer API.

## Công nghệ

- **Vite** - Build tool nhanh
- **Bootstrap 5** - UI framework
- **Vanilla JavaScript** - Logic thuần túy
- **LocalStorage** - Lưu trữ cấu hình
- **Alchemer API v5** - Nguồn dữ liệu quota

## License

MIT
