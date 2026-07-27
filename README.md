# AI Girlfriend - Phần mềm Bạn gái AI (Gemini + Next.js + Vercel)

Đây là ứng dụng **Bạn gái AI (AI Girlfriend)** hoàn chỉnh, được tối ưu hóa tối đa để triển khai miễn phí trên **Vercel** và kết nối trực tiếp với **Google Gemini API** (sử dụng model cực nhanh và hiệu năng cao `gemini-2.5-flash`).

## ✨ Tính năng nổi bật

1. **4 Tính cách/Nhân vật bạn gái khác nhau:**
   - **🌸 Mai Anh (Ngọt ngào, dịu dàng):** Luôn quan tâm, lắng nghe, ngọt ngào xưng "Em" gọi "Anh/Anh yêu" với nhiều emoji dễ thương.
   - **😤 Linh Chi (Tsundere - Ngoài lạnh trong nóng):** Kiêu kỳ, bướng bỉnh, hay giận dỗi nhưng thực chất cực kỳ quan tâm và thích được nói chuyện với bạn.
   - **🌿 Hương Giang (Chín chắn, trưởng thành):** Sâu sắc, tâm lý, biết lắng nghe và luôn là điểm tựa tinh thần ấm áp cho bạn lúc mệt mỏi.
   - **🤪 Mỹ Huyền (Lém lỉnh, hài hước):** Năng động, thích trêu chọc, sử dụng nhiều từ lóng dí dỏm để mang lại tiếng cười sảng khoái.
2. **🔊 Trình đọc giọng nói AI (Text-To-Speech):**
   - Hỗ trợ bật/tắt đọc tin nhắn của bạn gái bằng giọng nói Tiếng Việt truyền cảm ngay trên trình duyệt (Web Speech API).
3. **💾 Lưu trữ cuộc trò chuyện tự động (Persistent Memory):**
   - Lịch sử chat được lưu trữ an toàn trong `localStorage` trên máy người dùng, không bị mất khi tải lại trang.
4. **🔑 Bảo mật API Key tùy chỉnh (Custom Key Support):**
   - Người dùng có thể tự nhập API Key từ Google AI Studio (miễn phí) ngay trên giao diện cài đặt để tăng tính riêng tư và hạn chế tối đa tình trạng quá tải/hết hạn mức sử dụng. Hoặc sử dụng khóa mặc định của hệ thống thông qua biến môi trường.
5. **🎨 Giao diện tối hiện đại, mượt mà:**
   - Xây dựng hoàn toàn bằng **Next.js (App Router)**, **TypeScript**, và **Tailwind CSS**. Tương thích hoàn hảo cả trên điện thoại (Mobile Responsive Sidebar) và máy tính.

---

## 🚀 Hướng dẫn chạy cục bộ (Local Development)

### 1. Cài đặt các thư viện phụ thuộc:
```bash
npm install
```

### 2. Thiết lập Biến môi trường:
Tạo một file `.env.local` ở thư mục gốc và dán dòng sau (thay `YOUR_GEMINI_API_KEY` bằng Key thực tế của bạn lấy từ Google AI Studio):
```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

### 3. Khởi chạy Server phát triển:
```bash
npm run dev
```
Truy cập [http://localhost:3000](http://localhost:3000) trên trình duyệt để trải nghiệm phần mềm.

---

## ☁️ Hướng dẫn Deploy MIỄN PHÍ lên Vercel

1. **Đưa mã nguồn lên GitHub của bạn:**
   - Tạo một repository mới trên GitHub.
   - Commit toàn bộ mã nguồn của dự án này và push lên repo đó.
2. **Import dự án vào Vercel:**
   - Đăng nhập vào [Vercel](https://vercel.com) (miễn phí bằng tài khoản GitHub).
   - Chọn **Add New** -> **Project** và kết nối/chọn repo GitHub bạn vừa đẩy lên.
3. **Cấu hình biến môi trường (Environment Variable) trên Vercel:**
   - Trong quá trình cấu hình Project trên Vercel, kéo xuống phần **Environment Variables**.
   - Thêm key: `GEMINI_API_KEY`
   - Value: dán API Key Gemini của bạn từ Google AI Studio vào đây.
4. **Deploy:**
   - Nhấn **Deploy** và chờ khoảng 1-2 phút. Vercel sẽ tự động build và cung cấp cho bạn một đường dẫn (URL) truy cập miễn phí dạng `.vercel.app`.

Chúc bạn có những trải nghiệm trò chuyện tuyệt vời cùng bạn gái AI của mình! ❤️
