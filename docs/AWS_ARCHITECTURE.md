# Thiết kế Kiến trúc AWS (Startups Blogs) - Phiên bản Hoàn chỉnh

Tài liệu này mô tả chi tiết **kiến trúc đám mây thực tế và hoàn chỉnh** của dự án Startups Blogs sau khi đã tích hợp đầy đủ các dịch vụ chuẩn Enterprise của AWS. Kiến trúc này đảm bảo tính mở rộng cao, bảo mật chặt chẽ và hiệu năng xuất sắc.

---

## 1. Tổng quan Kiến trúc (Architecture Overview)

Hệ thống được thiết kế theo chuẩn Microservices & Serverless kết hợp, tách biệt hoàn toàn giữa Frontend, Backend, Database và Hệ thống Xác thực. 

Sơ đồ tổng quan:
`User -> CloudFront (CDN) -> S3 (Frontend)`
`User -> API Gateway -> EC2 (Backend) -> RDS (Database)`
`User <-> Cognito (Authentication)`

---

## 2. Chi tiết Từng Dịch vụ AWS & Vai trò

### 2.1. Tầng Giao diện (Frontend Hosting & CDN)
* **Amazon S3 (Simple Storage Service):** Đóng vai trò làm ổ cứng lưu trữ toàn bộ source code Frontend đã được biên dịch (HTML, CSS, JS tĩnh).
* **Amazon CloudFront:** Là mạng lưới phân phối nội dung (CDN) toàn cầu. Nó đứng trước S3, giúp lưu trữ bộ nhớ đệm (cache) trang web ở các máy chủ biên (Edge Locations) trên toàn thế giới. Nhờ đó, người dùng ở bất kỳ đâu truy cập web cũng có tốc độ tải trang chớp nhoáng (chỉ vài mili-giây).

### 2.2. Tầng Xác thực & Bảo mật (Authentication)
* **Amazon Cognito (User Pools):** Trái tim bảo mật của hệ thống. 
  - Đảm nhận toàn bộ việc Đăng ký, Đăng nhập, Gửi email xác thực OTP (6 số).
  - Lưu trữ mật khẩu người dùng theo tiêu chuẩn bảo mật quân đội (không ai, kể cả Admin, có thể xem được mật khẩu).
  - Tự động sinh ra Access Token (JWT) an toàn để Frontend dùng đi nói chuyện với Backend.

### 2.3. Tầng Cửa ngõ API (API Gateway)
* **Amazon API Gateway:** Đóng vai trò là người gác cổng (Bouncer) cho Backend. 
  - Giấu kín địa chỉ IP thật của máy chủ Backend.
  - Nhận các Request từ Frontend và định tuyến (forward) an toàn vào trong máy chủ xử lý.

### 2.4. Tầng Xử lý Logic (Backend Compute)
* **Amazon EC2 (Elastic Compute Cloud):** Máy chủ ảo chạy hệ điều hành Linux (Ubuntu).
  - Chứa mã nguồn Backend (NestJS) và chạy liên tục 24/7 nhờ công cụ quản lý tiến trình **PM2**.
  - Nó có nhiệm vụ nhận Token từ giao diện, giải mã Token để lấy `cognitoSub` (ID của Cognito), sau đó xử lý các nghiệp vụ kinh doanh (đăng bài, bình luận, v.v.).

### 2.5. Tầng Cơ sở Dữ liệu (Database)
* **Amazon RDS (Relational Database Service) for PostgreSQL:** Trái tim dữ liệu của hệ thống.
  - Thay vì chạy Database thủ công dễ mất dữ liệu, hệ thống sử dụng RDS là dịch vụ Database chuẩn doanh nghiệp do AWS quản lý hoàn toàn.
  - Đảm bảo dữ liệu Startups, Articles, Users được lưu trữ an toàn, tự động backup (sao lưu) và sẵn sàng mở rộng (scale) khi lượng người dùng tăng vọt.

### 2.6. Tầng Quản lý Quyền truy cập (IAM - Identity & Access Management)
* **IAM Roles & Policies:** Đóng vai trò là "Bộ quy tắc ứng xử" ngầm bảo vệ toàn bộ hệ thống.
  - Các dịch vụ AWS không được phép tùy tiện nói chuyện với nhau nếu không có quyền. Hệ thống của bạn sử dụng IAM Role để cấp quyền cho **EC2** được phép kết nối an toàn tới các dịch vụ khác (như ghi Log, v.v.).
  - GitHub Actions cũng dùng tài khoản IAM để tự động đẩy code lên S3 một cách an toàn mà không bị lộ mật khẩu cấp cao.

### 2.7. Tầng Giám sát & Ghi log (Amazon CloudWatch)
* **Amazon CloudWatch:** Đóng vai trò là "Camera an ninh" giám sát toàn bộ hoạt động 24/7.
  - Tự động thu thập logs (nhật ký) lỗi từ API Gateway, Cognito và EC2. Nếu Backend bị sập hoặc có lỗi 500, bạn có thể vào CloudWatch để truy vết chính xác dòng code gây lỗi.
  - Theo dõi sức khỏe hệ thống (Metrics): Đo lường CPU của EC2, lượng RAM tiêu thụ của RDS PostgreSQL để cảnh báo nếu máy chủ bị quá tải.

---

## 3. Tóm tắt Luồng Chạy Thực tế (End-to-End Flow)

1. **Vào web:** Người dùng gõ link trang web, **CloudFront** lập tức trả về giao diện siêu tốc từ **S3**.
2. **Đăng nhập:** Người dùng nhập Email/Mật khẩu. Giao diện gửi thẳng lên **Amazon Cognito**. Cognito kiểm tra đúng sẽ trả về một chiếc "Thẻ bài" (JWT Token).
3. **Thao tác:** Người dùng lướt xem danh sách Startup. Giao diện kẹp chiếc "Thẻ bài" đó gửi qua **API Gateway**.
4. **Xử lý:** API Gateway đẩy dữ liệu vào **EC2**. Backend trên EC2 kiểm tra Thẻ bài hợp lệ, kết nối tới **Amazon RDS** lấy dữ liệu và trả ngược về cho người dùng.

*(Kiến trúc này biến dự án của bạn từ một đồ án nhỏ thành một hệ thống chuẩn mực có thể phục vụ hàng ngàn người dùng thực tế!)*
