# Kế hoạch Thực thi: Kết nối Frontend với Backend (FE-BE Integration)

Trọng tâm của chặng đường tiếp theo là biến giao diện tĩnh của Frontend (Next.js) thành một ứng dụng động, giao tiếp trực tiếp với Backend (NestJS) thông qua các API chúng ta vừa xây dựng.

## Mục tiêu (Objectives)
- Thiết lập bộ khung gọi API (Axios).
- Tích hợp luồng Đăng ký / Đăng nhập (Auth).
- Xử lý Global State (Zustand hoặc React Context) để lưu thông tin User đăng nhập.
- Viết component Tải ảnh lên MinIO.

## Chi tiết Triển khai (Proposed Changes)

### 1. Thiết lập API Client (Axios)
- **Cài đặt thư viện**: `npm install axios`.
- **[NEW] `frontend/src/lib/axios.ts`**: Cấu hình Axios Instance.
  - Setup `baseURL: 'http://localhost:3000'` (Chỉ thẳng vào Backend).
  - Setup **Interceptors**: Tự động chặn mọi request chuẩn bị gửi đi để nhét `Authorization: Bearer <token>` vào Header (nếu User đã đăng nhập). Tự động chặn mọi response trả về lỗi `401 Unauthorized` để văng User ra ngoài màn hình Login.

### 2. Tích hợp Quản lý Trạng thái (State Management)
- Khởi tạo thư mục `frontend/src/store/`.
- Xây dựng một `authStore` (Zustand) để lưu lại:
  - Trạng thái `isAuthenticated` (Đã đăng nhập chưa).
  - Thông tin `user` (Tên, Avatar, Quyền).
  - Chuỗi `token` (Để nạp vào Axios).

### 3. Tích hợp Các Luồng (Flows) Cốt Lõi
Sẽ tiến hành cuốn chiếu theo đúng thứ tự các Phase của Backend:
1. **Auth Flow (Đăng ký/Đăng nhập)**: Nối API `/auth/login` vào form. Nếu thành công, quăng token vào LocalStorage/Cookie.
2. **Business Flow (Hồ sơ Startup)**: Nối API `/businesses` để load danh sách các dự án Khởi nghiệp lên trang chủ.
3. **Upload Flow (Ảnh)**: Tạo component `<ImageUploader />`. Khi người dùng chọn ảnh, component này sẽ gọi ngay API `POST /upload` (FormData), nhận về cái link của MinIO và hiện ảnh lên cho người dùng xem trước.
4. **Article & Social Flow**: Nối API đọc bài viết, đếm view, thả tim (bookmark) và bình luận.

---

## Open Questions dành cho User (Hãy trả lời khi kết nối AI mới)

> [!WARNING]
> **[CÂU HỎI 1] Cấu trúc lưu Token:** Bạn muốn lưu JWT Token ở LocalStorage (Dễ code, rủi ro bị XSS) hay lưu trong HTTP-Only Cookies (Bảo mật tuyệt đối, hơi rườm rà lúc code SSR của Next.js)?
> 
> **[CÂU HỎI 2] Quản lý State:** Bạn chuộng dùng thư viện nào để quản lý Global State? **Zustand** (Rất nhẹ, trend hiện tại) hay **Redux Toolkit** (Nặng đô, truyền thống) hay chỉ cần **React Context** (Đơn giản nhất)?

**LỜI NHẮN CHO AI MỚI**: Khi khởi động lại, hãy hỏi User 2 câu hỏi trên để chốt phương án trước khi gõ code nhé!

## QUY?T �?NH C?A USER (�� Ch?t)
- **Luu Token**: LocalStorage (Uu ti�n t?c d? MVP).
- **Qu?n l� State**: Zustand.

**L?I NH?N CHO AI M?I**: Ngu?i d�ng d� ch?t phuong �n. H�y ti?n h�nh kh?i t?o thu m?c store, c�i d?t xios, zustand v� b?t d?u tri?n khai c�c lu?ng FE-BE ngay l?p t?c!
