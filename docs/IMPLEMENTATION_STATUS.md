# Trạng Thái Triển Khai Backend (Implementation Status)

Tài liệu này đóng vai trò như một "bộ nhớ vĩnh cửu" (Permanent Memory) ghi lại chính xác tiến độ code Backend, để đảm bảo bất cứ khi nào khởi động lại dự án, hệ thống cũng biết chính xác chúng ta đang ở đâu và cần làm gì tiếp theo.

## 🟢 Những Phần Đã Hoàn Thành (Done)

### 1. Kiến trúc hạ tầng (Infrastructure)
- **Local Database:** PostgreSQL chạy qua Docker (`docker-compose.yml` ở cổng `5433`).
- **ORM:** Tích hợp `Prisma`. Đã định nghĩa toàn bộ Lược đồ Dữ liệu (User, Business, Article, Funding, Follow, Bookmark). (Xem chi tiết tại `DATABASE_SCHEMA.md`).
- **CI/CD & Docker:** Đã viết sẵn `Dockerfile` chuẩn và `deploy-backend.yml` (GitHub Actions -> AWS ECR / App Runner). (Chờ Frontend xong để test thực tế).

### 2. Module: Auth & Users (Phase 1)
- Lựa chọn giải pháp: **Local JWT + bcrypt** (Tạm hoãn AWS Cognito để ưu tiên MVP).
- `PrismaModule` & `PrismaService` khởi tạo toàn cục.
- `AuthModule` cung cấp API:
  - `POST /auth/register`: Đăng ký tài khoản.
  - `POST /auth/login`: Đăng nhập, trả về Access Token.
- `UsersModule` cung cấp API:
  - `GET /users/me`: Lấy thông tin cá nhân (Yêu cầu JWT Bearer Token).
- Đã thiết lập `JwtStrategy` và `JwtAuthGuard`.

### 3. Module: Business (Phase 2)
- Tạo Module quản lý Doanh nghiệp/Startup.
- Cấu hình Validate dữ liệu đầu vào với `class-validator` (DTOs).
- Đã viết các API:
  - `POST /businesses` (Protected): Tạo Startup (Lưu `ownerId` từ Token).
  - `GET /businesses`: Danh sách Startup.
  - `GET /businesses/:slug`: Xem chi tiết Startup bằng Slug.
  - `PUT /businesses/:id` (Protected - Phân quyền Owner): Cập nhật Startup.
  - `DELETE /businesses/:id` (Protected - Phân quyền Owner): Xóa Startup.

### 4. Module: Business Sub-models (Phase 3)
- API cho **Team Members**: Đã tạo các API (Lấy danh sách, Thêm, Sửa, Xóa).
- API cho **Funding Rounds**: Đã tạo các API (Lấy lịch sử gọi vốn, Thêm, Sửa, Xóa).
- API cho **Funding Opportunities**: Đã tạo các API (Đăng tin gọi vốn, Cập nhật trạng thái tin, Xóa).
- Thiết kế theo chuẩn **Nested Routing** (`/businesses/:businessId/...`).
- Logic **Authorization bảo vệ kép**: User phải đăng nhập (có Token JWT) và bắt buộc phải là `ownerId` của Startup đó thì mới được phép can thiệp Thêm/Sửa/Xóa.

### 5. Module: Articles & Blog (Phase 4)
- API **Quản lý Bài viết**: Khởi tạo Module `articles` (Tạo, Sửa, Xóa, Đọc).
- **Phân quyền Tác giả**: Chỉ có User tạo ra bài viết mới có quyền Cập nhật hoặc Xóa nó.
- **Phân quyền Công ty (PR)**: Nếu người dùng muốn gán bài viết đó vào một Startup (Truyền `businessId`), hệ thống sẽ kiểm tra bảo mật (Dò xem người dùng đó có phải là Owner của Startup không). Chặn đứng việc mạo danh.
- **Lượt xem**: Tự động tăng `viewCount` mỗi lần gọi API Xem chi tiết bài viết (`GET /articles/:slug`).

---

## 🟡 Những Phần Đang Chờ Triển Khai (To-Do)

### Phase 5: Tương tác Mạng xã hội (Social Features)
- API cho **Comments** (Bình luận & Trả lời bình luận lồng nhau).
- API cho **Bookmarks** (Lưu bài viết yêu thích).
- API cho **Follows** (Theo dõi User / Startup khác).

### Phase 6: Upload Hình ảnh (S3 Integration)
- Xử lý việc upload Avatar, Logo công ty, Cover ảnh lên AWS S3 và lưu lại URL vào Database thay vì chứa file cục bộ.

> [!NOTE]
> Bất cứ khi nào bạn tiếp tục làm việc, hãy yêu cầu AI: *"Hãy đọc file `docs/IMPLEMENTATION_STATUS.md` để biết tiến độ và làm tiếp Phase tiếp theo"* là hệ thống sẽ tự động bắt nhịp ngay lập tức!
