# QUYẾT ĐỊNH VỀ CƠ SỞ DỮ LIỆU (DATABASE DECISIONS)

Tài liệu này ghi lại các quyết định kỹ thuật liên quan đến việc lưu trữ dữ liệu cho hệ thống Startups Blogs.

## 1. Chọn Relational DB (PostgreSQL) thay vì NoSQL

Mặc dù NoSQL (MongoDB, DynamoDB) có tốc độ phát triển nhanh, Startups Blogs sử dụng **PostgreSQL** vì:
- **Tính quan hệ phức tạp:** Một User có thể tham gia nhiều Startup, một Startup có nhiều Idea. Việc phân quyền và duyệt qua các mối quan hệ (Joins) rất quan trọng và phù hợp với SQL.
- **Tính nhất quán dữ liệu (ACID):** Rất cần thiết cho các hành động thay đổi trạng thái như duyệt Idea, lưu Startup.
- **Hỗ trợ từ Prisma:** Prisma ORM làm việc cực kỳ xuất sắc với PostgreSQL, tạo ra các type-safety tự động cho TypeScript.

## 2. Xử lý File Storage (Không lưu file vào Database)

Tất cả các tệp đính kèm (Hình ảnh logo, pitch deck, document) đều KHÔNG được lưu dưới dạng BLOB hoặc base64 trong cơ sở dữ liệu.

**Quyết định:**
- File được lưu vào **Amazon S3**.
- Backend gen ra một **S3 Presigned URL** và gửi cho Frontend để Frontend tự upload trực tiếp lên S3.
- Database chỉ lưu `fileUrl` hoặc `objectKey` của S3. Điều này giúp database nhẹ, giảm băng thông đi qua backend và tối ưu chi phí.

## 3. Quản lý Secret và Password

**Quyết định:**
- Tuyệt đối **KHÔNG** lưu password hoặc hash password của người dùng trong PostgreSQL.
- Toàn bộ Identity Management được giao cho **Amazon Cognito**. Cognito quản lý password, OTP, xác thực email một cách an toàn nhất.
- Database chỉ lưu `cognitoSub` (ID định danh trả về từ Cognito) làm UUID để liên kết Profile.

## 4. Cache và Indexing

- PostgreSQL được thiết lập Index trên các trường truy xuất nhiều: `slug` của Startup/Idea/Article, `email` và `cognitoSub` của User.
- Ở giai đoạn MVP, chưa sử dụng Redis để cache dữ liệu API. Nếu request quá tải ở các trang công cộng (Public view), có thể cân nhắc tích hợp sau hoặc cấu hình cache HTTP ở CloudFront CDN.
