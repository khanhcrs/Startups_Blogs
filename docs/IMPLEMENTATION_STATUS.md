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

### 6. Module: Social Features (Phase 5)
- **Bình luận (Comments)**: Đã tích hợp API đăng bình luận. Hỗ trợ hệ thống "Bình luận lồng nhau" (Truyền `parentId` để Reply). Khi truy xuất sẽ lấy luôn danh sách Replies của từng bình luận gốc.
- **Lưu bài viết (Bookmarks)**: Áp dụng phương án Tách rời 2 API (`POST` để lưu và `DELETE` để hủy). Thiết kế chuẩn RESTful, đảm bảo tính Idempotent chống Race-condition.
- **Theo dõi (Follows)**: Cho phép Theo dõi (`POST`) và Bỏ theo dõi (`DELETE`) giữa các người dùng với nhau.
- Tất cả API đều được bảo mật kép (User phải Đăng nhập và chỉ có thể tự xóa Bình luận / Bookmark / Follow của chính mình, không được xóa hộ người khác).

---

### 7. Module: Image Upload (Phase 6)
- **Kiến trúc MinIO (S3 Giả lập)**: Cài đặt và khởi chạy MinIO qua Docker (`docker-compose.yml`) tại cổng 9000. Cung cấp API tương thích 100% với AWS S3.
- **Tích hợp AWS SDK**: Cài đặt `@aws-sdk/client-s3`. Tự động khởi tạo bucket `startups-blogs-bucket` và cấp quyền truy cập Public Read thông qua `PutBucketPolicyCommand`.
- **API Upload (`POST /upload`)**: Chặn kích thước file (tối đa 5MB) và chỉ cho phép định dạng ảnh (jpg, png, gif, webp). Trả về URL trực tiếp tới ảnh trên MinIO S3.
- Rất dễ dàng chuyển sang AWS thật trên môi trường Production bằng cách thay thế biến môi trường trong `.env`.

---

## 🟡 Những Phần Đang Chờ Triển Khai (To-Do)

### Phase 7: Kết nối Frontend (FE-BE Integration)
- Khởi tạo thư viện Axios và quản lý Global State.
- Kết nối luồng Đăng nhập / Đăng ký.
- Kết nối các luồng Đăng bài, Quản lý Startup.
- **[LƯU Ý DÀNH CHO AI TIẾP THEO]**: Hãy đọc kỹ file `docs/PHASE_7_PLAN.md` (Kế hoạch kết nối FE-BE). Trong đó có 2 câu hỏi chờ User chốt (Về cách lưu Token và thư viện State Management).
- **AI mới hãy chào User và yêu cầu User trả lời 2 câu hỏi trong file Kế Hoạch trước khi bắt đầu code nhé!**

> [!NOTE]
> Bất cứ khi nào bạn (User) trở lại với một AI mới, hãy yêu cầu AI: *"Hãy đọc file `docs/IMPLEMENTATION_STATUS.md` và `docs/PHASE_7_PLAN.md` để nắm bối cảnh dự án!"*
