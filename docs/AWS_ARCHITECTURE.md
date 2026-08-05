# Thiết kế Kiến trúc AWS (AWS Architecture & Solution)

Tài liệu này giải thích chi tiết **những dịch vụ AWS nào được sử dụng**, **vai trò của chúng là gì** trong hệ thống Startups Blogs, và **hướng dẫn cơ bản để bạn biết cách thiết lập (setup)** chúng trên AWS Console.

---

## 1. Tổng quan Kiến trúc (Architecture Overview)

Hệ thống của chúng ta sử dụng kiến trúc Serverless Container và Managed Services để giảm thiểu tối đa công sức vận hành (Ops), đồng thời có khả năng tự động mở rộng (Auto-scaling).

Các dịch vụ cốt lõi bao gồm:
- **AWS Cognito:** Quản lý danh tính (Authentication).
- **Amazon S3 & CloudFront:** Lưu trữ file tĩnh (Frontend, Ảnh, Tài liệu).
- **Amazon RDS (PostgreSQL):** Cơ sở dữ liệu chính.
- **Amazon ECR:** Kho chứa Docker Image của Backend.
- **AWS App Runner:** Chạy Backend (NestJS) từ Docker Image.

---

## 2. Chi tiết Từng Dịch Vụ & Hướng dẫn Setup

### 2.1. AWS Cognito (Xác thực người dùng)
* **Nhiệm vụ:** Đóng vai trò là hệ thống Đăng ký, Đăng nhập, Quên mật khẩu. Thay vì tự viết logic mã hóa mật khẩu cực kỳ phức tạp và rủi ro, Cognito lo hết. Khi user đăng nhập thành công, Cognito cấp một vé (JWT Token) để đi vào Backend.
* **Cần Setup thế nào?**
  1. Vào AWS Console -> Tìm **Cognito**.
  2. Tạo một **User Pool**.
  3. Cấu hình các thuộc tính bắt buộc: `Email`.
  4. Bật tính năng xác thực qua Email (Gửi mã OTP).
  5. Tạo một **App Client** (Tắt tính năng tạo Client Secret vì React Frontend không giữ được secret).
  6. Lấy `Pool ID` và `App Client ID` lưu vào biến môi trường (`.env`) của Frontend.

### 2.2. Amazon S3 (Lưu trữ File & Frontend)
* **Nhiệm vụ 1 (Lưu file Media):** Lưu trữ Avatar, Logo công ty, Cover image, Pitch deck. Backend sẽ tạo "Presigned URL" để Frontend đẩy file thẳng lên S3 mà không cần đi xuyên qua Backend (chống kẹt mạng cho server).
* **Nhiệm vụ 2 (Hosting Frontend):** Chứa bản build của React (Vite).
* **Cần Setup thế nào?**
  1. Vào S3, tạo 2 **Buckets**: `startups-blogs-media` và `startups-blogs-frontend`.
  2. Bucket Media: Bật CORS (để Frontend có thể upload), cấu hình chặn Public Access tùy theo mức độ bảo mật, tạo IAM User cho Backend có quyền `PutObject`.
  3. Bucket Frontend: Bật chế độ **Static Website Hosting**.

### 2.3. Amazon CloudFront (CDN)
* **Nhiệm vụ:** Là mạng lưới phân phối nội dung toàn cầu. Nó đứng trước S3 Frontend và S3 Media để cache dữ liệu, giúp website tải siêu tốc dù người dùng ở Việt Nam hay Mỹ. Cung cấp SSL/HTTPS miễn phí.
* **Cần Setup thế nào?**
  1. Tạo **Distribution**.
  2. Chọn Origin là S3 Bucket Frontend.
  3. Trỏ Tên miền (Domain) của bạn (ví dụ: `startupsblogs.com`) vào CloudFront.

### 2.4. Amazon RDS - Relational Database Service (Cơ sở dữ liệu)
* **Nhiệm vụ:** Là nơi chứa toàn bộ dữ liệu nghiệp vụ (User profiles, Business data, Articles).
* **Cần Setup thế nào?**
  1. Vào RDS -> Create database.
  2. Chọn **PostgreSQL**.
  3. Chọn Template `Free Tier` (cho giai đoạn Dev) hoặc `Production`.
  4. Setup Username / Password và Public Access (nếu bạn muốn kết nối từ máy local, lưu ý giới hạn IP).
  5. Lấy Connection String (Endpoint) dán vào `.env` của Backend (`DATABASE_URL`).

### 2.5. Amazon ECR - Elastic Container Registry (Kho Docker)
* **Nhiệm vụ:** Là nơi GitHub Actions sẽ đẩy Docker Image của Backend lên sau khi code được test và build thành công. Giống như DockerHub nhưng riêng tư và bảo mật trên AWS.
* **Cần Setup thế nào?**
  1. Vào ECR -> Create repository.
  2. Đặt tên: `startups-blogs-backend`.
  3. Lấy URI của repository này để cấu hình vào GitHub Actions.

### 2.6. AWS App Runner (Chạy Server Backend)
* **Nhiệm vụ:** Lấy Docker Image từ ECR và chạy nó. Tự động load balancer, tự động scale lên nhiều server khi đông khách và scale về 1 server khi vắng khách.
* **Cần Setup thế nào?**
  1. Vào App Runner -> Create service.
  2. Chọn Source là **Container registry** -> Trỏ tới ECR repository vừa tạo ở trên.
  3. Bật tính năng **Automatic deployment** (Mỗi khi GitHub đẩy Image mới lên ECR, App Runner tự động cập nhật).
  4. Cấu hình Biến môi trường (Environment Variables) như `DATABASE_URL` để nó biết đường kết nối tới RDS.
  5. Nhận URL của Backend API (ví dụ: `https://abcxyz.us-east-1.awsapprunner.com`) và dán vào Frontend.

---

## 3. Tóm tắt Luồng Hệ Thống (End-to-End Flow)

1. Người dùng gõ tên miền -> **CloudFront** phục vụ file React (Frontend) từ **S3**.
2. Người dùng Đăng nhập -> Frontend gọi tới **AWS Cognito** -> Lấy JWT Token.
3. Người dùng thao tác (Ví dụ: Tìm kiếm startup) -> Frontend gọi API tới **App Runner (Backend)** kèm JWT Token.
4. App Runner (NestJS) kiểm tra Token hợp lệ -> Truy vấn dữ liệu từ **RDS (PostgreSQL)** -> Trả kết quả về Frontend.
5. Người dùng upload Logo công ty -> Frontend xin quyền Backend -> Backend cấp S3 Presigned URL -> Frontend upload ảnh thẳng lên **S3 Bucket (Media)**.
