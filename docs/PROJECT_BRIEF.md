PROJECT BRIEF — Startups Blogs

1. Tầm nhìn sản phẩm

## Product Identity

- **Product name:** Startups Blogs
- **Product type:** Business Investment Connection Platform
- **Central entity:** Business
- **Startup:** A Business Type, not the central entity

2. Giá trị chính

Dành cho startup

Tạo hồ sơ startup chuyên nghiệp.

Đăng ý tưởng hoặc dự án.

Tăng khả năng được nhà đầu tư và doanh nghiệp phát hiện.

Nhận yêu cầu liên hệ mà không phải công khai email cá nhân.

Dành cho người dùng (Khách/Thành viên)

Duyệt startup theo lĩnh vực, giai đoạn và nhu cầu vốn.

Lưu startup quan tâm.

Xem hồ sơ và ý tưởng chi tiết.

Gửi yêu cầu liên hệ có kiểm soát.

3. Nhóm người dùng

Guest: người chưa đăng nhập.

Founder: quản lý startup và ý tưởng.

User (Đã đăng nhập): tìm kiếm, lưu và liên hệ startup.

Editor: quản lý News và Blogs.

Moderator: duyệt ý tưởng, xử lý báo cáo.

Admin: quản trị toàn bộ hệ thống.

4. MVP

Bắt buộc

Trang Home theo mockup.

Browse Startups, search, filter, sort, pagination.

Startup Detail.

News và Blogs.

Đăng ký/đăng nhập bằng Cognito.

Startup Profile CRUD.

Post Your Idea theo nhiều bước.

Upload logo, ảnh, pitch deck bằng S3 presigned URL.

Save Startup.

Contact Request.

Featured Startup Spotlight Banner.

Admin duyệt ý tưởng và quản lý Featured Startup.

FAQ, Support, About, Terms, Privacy.

Sau MVP

Direct messaging.

Comments và replies.

Follow startup.

Verification badge.

Notification nâng cao.

Analytics cho founder.

Recommendation engine.

Trả phí để quảng bá startup.

5. Ngoài phạm vi MVP

Thanh toán/subscription.

Video call trực tiếp.

AI chấm điểm startup.

Multi-region active-active.

Native mobile app.

6. Công nghệ đã chốt

Frontend

React, TypeScript, Vite.

React Router.

TanStack Query.

React Hook Form + Zod.

CSS Modules + CSS Variables.

Không dùng Tailwind, Bootstrap hoặc Material UI.

Backend

Node.js, TypeScript, NestJS.

REST API, prefix /api/v1.

Prisma ORM.

PostgreSQL.

OpenAPI/Swagger.

AWS

Cognito User Pool: identity, email verification, forgot password và JWT.

RDS PostgreSQL: dữ liệu nghiệp vụ.

S3: logo, ảnh, pitch deck và tài liệu.

Presigned URL: upload/download có thời hạn.

CloudFront + S3: frontend.

App Runner: backend MVP.

SES: email giao dịch ngoài email auth Cognito.

CloudWatch: logs, metrics và alerts.

Secrets Manager: secret backend.

7. Nguyên tắc kiến trúc

Cognito xác định người dùng là ai; backend quyết định người dùng được làm gì.

PostgreSQL là nguồn dữ liệu nghiệp vụ.

Không lưu password trong PostgreSQL.

Không lưu presigned URL lâu dài; chỉ lưu S3 object key và metadata.

Frontend không được quyết định quyền truy cập.

Mọi list API phải có pagination.

Mọi form phải có validation frontend và backend.

Mọi data section phải có loading, empty, error và success states.

8. Chỉ số thành công MVP

Người dùng hoàn thành hồ sơ startup.

Founder đăng và gửi duyệt ý tưởng.

Người dùng đăng nhập tìm và lưu startup.

Người dùng gửi contact request.

Moderator xử lý ý tưởng chờ duyệt.

Không có lỗi phân quyền nghiêm trọng.
