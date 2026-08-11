# Trạng Thái Triển Khai Backend (Implementation Status)

Tài liệu này đóng vai trò như một "bộ nhớ vĩnh cửu" (Permanent Memory) ghi lại chính xác tiến độ code Backend, để đảm bảo bất cứ khi nào khởi động lại dự án, hệ thống cũng biết chính xác chúng ta đang ở đâu và cần làm gì tiếp theo.

## 🟢 Những Phần Đã Hoàn Thành (Done)

### 1. Kiến trúc hạ tầng (Infrastructure)
- **Local Database:** PostgreSQL chạy qua Docker (`docker-compose.yml` ở cổng `5433`).
- **ORM:** Tích hợp `Prisma`. Đã định nghĩa toàn bộ Lược đồ Dữ liệu (User, Business, Article, Funding, Follow, Bookmark). (Xem chi tiết tại `DATABASE_SCHEMA.md`).
- **CI/CD & Docker:** Đã viết sẵn `Dockerfile` chuẩn và `deploy-backend.yml` (GitHub Actions -> EC2 via PM2). (Chờ Frontend xong để test thực tế).

### 2. Module: Auth & Users (Phase 1)
- Lựa chọn giải pháp: **AWS Cognito** (Đã tích hợp thành công, bao gồm Auto-login, đồng bộ Database tự động, Quản lý Token).
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

### 8. Kết nối Frontend (FE-BE Integration) (Phase 7)
- Khởi tạo thư viện Axios với interceptors để đính kèm Token.
- Quản lý Global State bằng Zustand (`authStore`).
- Kết nối thành công luồng Đăng nhập / Đăng ký.
- Tích hợp Load danh sách Doanh nghiệp (ExploreBusinesses) và chi tiết (BusinessDetail).
- Tích hợp Upload Flow cho ảnh.
- Tích hợp Articles Flow (load danh sách Blogs).
- Tích hợp tạo/sửa Bài viết từ giao diện Frontend.
- Tích hợp chức năng quản lý Profile doanh nghiệp trên giao diện.

---

### Phase 8: Blogs & News (Hoàn thiện)
- Viết API Quản lý Bài viết (Tạo, Sửa, Xóa, Đọc). Phân quyền Tác giả/Công ty.
- Tích hợp bộ lọc (Filter) tìm kiếm và ngày tháng nâng cao cho Blogs và News trên Frontend.
- Nâng cấp giao diện trang Blogs và News với phong cách chuyên nghiệp (Hero Section, Search bar).

### Phase 9: Contact Request & Admin Dashboard (Hoàn thiện)
- **Contact Request:** Tạo bảng `ContactRequest`. Bổ sung Modal liên hệ và tab Inbox cho Founder.
- **Admin Dashboard:** Cấu trúc lại trang Admin với giao diện Sidebar Layout chuyên nghiệp.
- Bổ sung các module quản trị:
 - **Overview**: Thống kê số lượng (Users, Businesses, Articles, Pending).
 - **Businesses**: Phê duyệt hoặc Từ chối Startup. Tích hợp giao diện `AdminViewBusiness` với đầy đủ các section (Funding History, Team, Analytics, Market, Updates). Bổ sung luồng API `GET /businesses/admin/:id` lấy chi tiết dữ liệu.
 - **Users**: Xem danh sách toàn hệ thống, cấp quyền (USER, MODERATOR, ADMIN).
 - **Articles**: Quản lý danh sách bài viết chuyên sâu:
 - Chuyển trạng thái (DRAFT/PUBLISHED) và xóa bài vi phạm.
 - Modal Xem trước chi tiết bài viết (Preview) tích hợp Biểu đồ Thống kê (Views/Likes) bằng `recharts`.
 - Tính năng bộ lọc nâng cao (Advanced Filters): Lọc theo Tag, Khoảng thời gian (From/To), Danh mục (Blogs/News), Tìm kiếm.
 - Quản trị Bình luận (Comment Moderation): Quyền tối thượng của Admin để xóa ngay bình luận rác/vi phạm trực tiếp từ Modal xem trước.
- Thiết lập Backend API cho các thao tác Admin bảo mật (Ví dụ: `DELETE /comments/admin/:id`, `GET /articles/tags`).
- Sửa lỗi crash Backend trên môi trường Windows liên quan đến tiến trình `taskkill` khi hot-reload.

### Phase 10: Admin Change Proposal (Hoàn thiện)
- **Database:** Bổ sung mô hình `ChangeProposal` để lưu lại những thay đổi dưới dạng JSON. (Đã xong)
- **Giao diện Admin:** Xây dựng Form chỉnh sửa toàn diện cho Business và Article, sử dụng phương thức "Tạo đề xuất thay đổi" thay vì lưu trực tiếp. (Đã xong)
- **Giao diện Owner:** Đã xây dựng màn hình Diff/Merge để Owner xem thay đổi và nhấn Approve/Reject. (Đã xong)
- **Backend API:** Hoàn thiện luồng duyệt tự động merge dữ liệu JSON vào bản ghi gốc. (Đã xong)

---

## 🟡 Những Phần Đang Chờ Triển Khai (To-Do)



### Phase 11: Hệ Thống Thông Báo (Notifications)
- Thay thế dữ liệu mock trên giao diện bằng hệ thống Notification thực tế.
- Khi Admin tạo ChangeProposal, tự động sinh ra một Notification nhắc nhở Owner vào phê duyệt.
- Xây dựng Notification schema trong cơ sở dữ liệu.
- Xây dựng API (Lấy danh sách thông báo, đánh dấu đã đọc).
- Cập nhật UI hiển thị Notification động (chuông thông báo, trang Notifications).

### Phase 12: Phê Duyệt Gọi Vốn & Các Tính Năng Phụ
- Xây dựng luồng phê duyệt tin đăng gọi vốn (Funding Opportunities) tương tự như duyệt Startup.
- Cải thiện quản lý trạng thái của nội dung.

### Phase 13: Kiểm thử & Tối ưu
- Viết Test (E2E hoặc Unit) cho các luồng quan trọng.

> [!NOTE]
> Bất cứ khi nào người dùng (User) trở lại với một AI mới, hãy yêu cầu AI: *"Hãy đọc file `docs/IMPLEMENTATION_STATUS.md` để nắm bối cảnh dự án!"*
