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
- File được lưu vào S3 (Sử dụng **MinIO** giả lập trên môi trường Dev/MVP).
- Database chỉ lưu chuỗi URL (`logoUrl`, `coverUrl`, `avatarUrl`). Điều này giúp database nhẹ, giảm băng thông tải dữ liệu từ DB và tối ưu chi phí.
- *(Lưu ý: Thay vì dùng Presigned URL phức tạp, MVP đang thiết lập UploadController dùng Multer nhận tệp trực tiếp và đẩy lên MinIO cho nhanh gọn)*.

## 3. Quản lý Secret và Password (MVP vs Production)

**Quyết định:**
- **Mục tiêu dài hạn (Production):** Tuyệt đối KHÔNG lưu password. Giao toàn quyền Identity Management cho **Amazon Cognito** (Quản lý password, OTP, xác thực email). Database chỉ lưu `cognitoSub`.
- **Hiện tại (MVP):** Để tiết kiệm thời gian phát triển và không phụ thuộc tài khoản AWS, chúng ta dùng cơ chế **Local JWT + bcrypt**. Mật khẩu được hash an toàn bằng bcrypt trước khi lưu vào bảng `User`.

## 4. Bảo vệ Dữ liệu (Change Proposals)

**Quyết định:**
- Vì hệ thống mang tính chất tài chính và thương hiệu, không cho phép Users (kể cả Founder) ghi đè (Overwrite) dữ liệu trực tiếp lên các bản ghi Business / Article đã được phê duyệt (Published).
- Mọi thao tác sửa đổi đều phải sinh ra một bản ghi trong bảng `ChangeProposal` (định dạng JSON). Chỉ khi Admin ấn "Approve", dữ liệu mới được merge vào cơ sở dữ liệu chính. 

## 5. Cache và Indexing

- PostgreSQL được thiết lập Index trên các trường truy xuất nhiều: `slug` của Startup/Article, `email` của User.
- Ở giai đoạn MVP, chưa sử dụng Redis để cache dữ liệu API. Nếu request quá tải ở các trang công cộng (Public view), có thể cân nhắc tích hợp sau hoặc cấu hình cache HTTP ở CloudFront CDN.
