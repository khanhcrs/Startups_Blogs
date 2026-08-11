# KIẾN TRÚC HỆ THỐNG (SYSTEM ARCHITECTURE)

Dự án **Startups Blogs** được thiết kế theo kiến trúc Microservices-oriented, trong đó Frontend và Backend được tách biệt hoàn toàn, giao tiếp qua REST API. Toàn bộ hệ thống được triển khai trên hạ tầng AWS.

## 1. Thành phần hệ thống

### 1.1 Client (Frontend)
- **Công nghệ:** React 19, Vite, TypeScript.
- **Hosting:** AWS S3 kết hợp với Amazon CloudFront (CDN) để phân phối nội dung tĩnh (HTML, CSS, JS) với tốc độ cao, độ trễ thấp và hỗ trợ SSL/TLS.
- **Routing:** Client-side routing bằng React Router.

### 1.2 API Server (Backend)
- **Công nghệ:** Node.js, NestJS, TypeScript, Prisma ORM.
- **Hosting:** Amazon EC2 kết hợp API Gateway. NestJS backend được chạy trên EC2 thông qua PM2. API Gateway làm proxy đứng trước EC2 để tăng cường bảo mật và định tuyến.

### 1.3 Database & Storage
- **Object Storage:** Amazon S3. Lưu trữ logo, hình ảnh, pitch deck. Việc upload được xử lý qua **Backend Proxy** để kiểm soát luồng tải file và dữ liệu. *(Lưu ý: Ở bản MVP hiện tại, chúng ta đang dùng MinIO giả lập S3 chạy trên Docker và Backend xử lý upload file trực tiếp thông qua Multer)*.

### 1.4 Identity & Authentication
- **Dịch vụ (Mục tiêu):** Amazon Cognito User Pool.
- **Luồng hoạt động (Mục tiêu):** - Frontend gọi trực tiếp đến Cognito để Đăng ký / Đăng nhập.
 - Cognito trả về JWT Token.
 - Backend sử dụng JWT Guard để verify token, lấy `cognitoSub`.
- **MVP (Hiện hành):** Dự án đang tạm thời sử dụng **Local JWT + bcrypt** trên NestJS để mã hóa mật khẩu và cấp Token, nhằm đẩy nhanh tốc độ kiểm thử.

### 1.5 Dịch vụ phụ trợ
- **Email:** Amazon SES. Dùng để gửi các email giao dịch ngoài luồng auth (như thông báo hệ thống, Contact Request).
- **Log & Monitor:** Amazon CloudWatch (Logs, Metrics, Alerts cho API Gateway, EC2 và RDS).
- **Security:** AWS Secrets Manager để lưu trữ thông tin nhạy cảm (DB password, API keys).

## 2. Sơ đồ luồng dữ liệu (Data Flow Diagram)

```mermaid
graph TD
 Client[Browser / Frontend] -->|1. Auth Requests| Cognito(Amazon Cognito)
 Client -->|2. REST API & File Upload| API[API Gateway + EC2 NestJS]
 Cognito -.->|JWT Token| Client
 API -->|3. Verify Token| Cognito
 API -->|4. SQL Queries| RDS[(Amazon RDS PostgreSQL)]
 API -->|5. Send Email| SES(Amazon SES)
 API -->|6. Upload Object (PutObject)| S3[(Amazon S3)]
```
