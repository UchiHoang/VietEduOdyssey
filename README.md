# VietEdu Odyssey — Hành Trình Tri Thức Qua Thế Giới Cổ Tích

**VietEdu Odyssey** là một nền tảng giáo dục trực tuyến tương tác, được thiết kế đặc biệt dành cho trẻ em bậc Mầm non và Tiểu học. Dự án kết hợp phương pháp học tập qua trò chơi (Gamification) với kho tàng toán học cơ bản, được lồng ghép tinh tế vào các câu chuyện dân gian và văn học truyền thống Việt Nam.

## 🌟 Tính năng nổi bật

* **Học thông qua cốt truyện:** Các bài học toán học được dẫn dắt bởi các nhân vật quen thuộc như Trạng Quỳnh, Thánh Gióng, Chú Cuội...
* **Trò chơi tương tác đa dạng:** Bao gồm các dạng game kéo thả, đếm số, ghép đôi và giải đố logic được tùy chỉnh theo từng khối lớp.
* **Lộ trình học tập phân cấp:** Nội dung được phân chia rõ rệt từ cấp độ Tiền tiểu học (Preschool) đến lớp 5, bám sát chương trình giáo dục phổ thông.
* **Hệ thống thành tích (Gamification):** Tích hợp bảng xếp hạng, huy hiệu và điểm kinh nghiệm (XP) để khuyến khích tinh thần học tập của trẻ.
* **Công cụ quản lý:** Hệ thống Dashboard dành cho Admin để quản lý bài học, thư viện học liệu và theo dõi tiến độ của học sinh.

## 🛠 Công nghệ sử dụng

Dự án được xây dựng trên các công nghệ hiện đại nhằm đảm bảo hiệu năng và trải nghiệm người dùng mượt mà:

* **Frontend:** React + TypeScript, Vite.
* **Giao diện:** Tailwind CSS, shadcn/ui, Framer Motion (cho hiệu ứng chuyển động).
* **Backend & Database:** Supabase (Backend-as-a-Service) hỗ trợ Realtime database và xác thực người dùng.
* **Quản lý trạng thái:** React Hooks tùy chỉnh để xử lý logic game và tiến trình học tập.

## 🎓 Trải nghiệm website của chúng tôi ngay tại link: http://vieteduodyssey.vercel.app

## 🚀 Hướng dẫn cài đặt nhanh

1.  **Cài đặt các gói phụ thuộc:**
    ```powershell
    npm install
    ```

2.  **Thiết lập môi trường:**
    * Sao chép tệp `.env.example` thành `.env`.
    * Cấu hình các thông số `SUPABASE_URL` và `SUPABASE_ANON_KEY` từ dự án Supabase của bạn.

3.  **Khởi chạy máy chủ phát triển:**
    ```powershell
    npm run dev
    ```

4.  **Truy cập:** Mở trình duyệt và truy cập `http://localhost:5173`.

## 📂 Cấu trúc thư mục chính

* `/src/components/game`: Chứa các engine trò chơi chính (Đếm số, Kéo thả, Ghép cặp...).
* `/src/data`: Lưu trữ dữ liệu về cốt truyện và chương trình học cho từng khối lớp (định dạng JSON).
* `/src/pages`: Các trang chức năng như Lớp học, Hồ sơ, Bảng điều khiển Admin và trang Trò chơi.
* `/supabase`: Chứa các bản thiết kế cơ sở dữ liệu (schema) và các bản migration.

---
=======
© 2026 Đội ngũ phát triển Website VietEdu Odyssey.

