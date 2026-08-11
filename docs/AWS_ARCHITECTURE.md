# Thiết kế Kiến trúc AWS (Startups Blogs) - Phiên bản Hoàn chỉnh

Tài liệu này mô tả chi tiết **kiến trúc đám mây thực tế và hoàn chỉnh** của dự án Startups Blogs sau khi đã tích hợp đầy đủ các dịch vụ chuẩn Enterprise của AWS. Kiến trúc này đảm bảo tính mở rộng cao, bảo mật chặt chẽ và hiệu năng xuất sắc.

---

## 1. Tổng quan Kiến trúc (Architecture Overview)

Hệ thống được thiết kế theo chuẩn Microservices & Serverless kết hợp, tách biệt hoàn toàn giữa Frontend, Backend, Database và Hệ thống Xác thực. Toàn bộ hạ tầng được tự động hóa bằng **Terraform** (Infrastructure as Code).

Sơ đồ tổng quan:
`User -> CloudFront (CDN) -> S3 (Frontend)`
`User -> API Gateway -> EC2 (Backend) -> RDS (Database)`
`User <-> Cognito (Authentication)`

---

## 2. Chi tiết Từng Dịch vụ AWS & Vai trò

### 2.1. Tầng Hạ tầng Mạng & Bảo mật Cốt lõi (Networking & Core Security)
* **Amazon VPC (Virtual Private Cloud):** Là lớp áo giáp ngoài cùng. Tạo ra một mạng nội bộ riêng tư ảo trên AWS để bọc lấy EC2 và RDS. Nhờ VPC, Database RDS được giấu kín hoàn toàn khỏi Internet, không một hacker nào từ bên ngoài có thể dò ping hay truy cập trực tiếp được vào Database.
* **Security Groups:** Đóng vai trò là "Tường lửa" (Firewall) bảo vệ từng dịch vụ. Ví dụ: Security Group của RDS chỉ cho phép duy nhất máy chủ EC2 được kết nối vào cổng 5432, chặn toàn bộ mọi kết nối khác.

### 2.2. Tầng Quản lý Quyền truy cập (IAM - Identity & Access Management)
* **IAM Roles & Policies:** Đóng vai trò là "Bộ quy tắc ứng xử" ngầm bảo vệ toàn bộ hệ thống. Các dịch vụ AWS không được phép tùy tiện nói chuyện với nhau nếu không có quyền. Hệ thống sử dụng IAM Role để cấp quyền cho **EC2** được phép kết nối an toàn tới các dịch vụ khác, hoặc cấp quyền cho **API Gateway** được ghi log.

### 2.3. Tầng Giao diện (Frontend Hosting & CDN)
* **Amazon S3 (Simple Storage Service):** Đóng vai trò làm ổ cứng lưu trữ toàn bộ source code Frontend đã được biên dịch (HTML, CSS, JS tĩnh).
* **Amazon CloudFront:** Là mạng lưới phân phối nội dung (CDN) toàn cầu. Nó đứng trước S3, giúp lưu trữ bộ nhớ đệm (cache) trang web ở các máy chủ biên (Edge Locations) trên toàn thế giới. Nhờ đó, tốc độ tải trang chỉ diễn ra trong vài mili-giây.

### 2.4. Tầng Xác thực & Bảo mật (Authentication)
* **Amazon Cognito (User Pools):** Trái tim bảo mật của hệ thống. - Đảm nhận Đăng ký, Đăng nhập, Gửi email xác thực OTP.
 - Tự động sinh ra Access Token (JWT) an toàn để Frontend dùng giao tiếp với Backend.

### 2.5. Tầng Cửa ngõ API (API Gateway)
* **Amazon API Gateway:** Đóng vai trò là người gác cổng (Bouncer) cho Backend. - Giấu kín địa chỉ IP thật của máy chủ Backend EC2.
 - Nhận các Request từ Frontend và định tuyến (forward) an toàn vào trong máy chủ xử lý.

### 2.6. Tầng Xử lý Logic (Backend Compute)
* **Amazon EC2 (Elastic Compute Cloud):** Máy chủ ảo chạy hệ điều hành Linux (Ubuntu).
 - Chứa mã nguồn Backend (NestJS) và chạy liên tục 24/7 nhờ công cụ quản lý tiến trình **PM2**.
 - Xử lý nghiệp vụ kinh doanh và kết nối Database.

### 2.7. Tầng Cơ sở Dữ liệu (Database)
* **Amazon RDS (Relational Database Service) for PostgreSQL:** Trái tim dữ liệu của hệ thống.
 - Tự động sao lưu (backup), chống lỗi phần cứng và duy trì dữ liệu an toàn tuyệt đối, tách biệt hoàn toàn khỏi máy chủ EC2.

### 2.8. Tầng Giám sát & Tự động hóa (Monitoring & IaC)
* **Amazon CloudWatch:** Đóng vai trò là "Camera an ninh" giám sát 24/7.
 - Ghi chép toàn bộ Logs từ API Gateway, EC2. - Theo dõi sức khỏe hệ thống (CPU, RAM của EC2 và RDS) để cảnh báo khi quá tải.
* **Terraform (Infrastructure as Code - IaC):** Thay vì click chuột thủ công trên web AWS, toàn bộ 100% các kiến trúc trên (VPC, S3, RDS, EC2...) đều được lập trình bằng code trong thư mục `terraform/`. Code này giúp việc tạo mới hoặc sao chép toàn bộ hệ thống sang một tài khoản AWS khác chỉ tốn chưa tới 5 phút.

---

## 3. Tóm tắt Luồng Chạy Thực tế (End-to-End Flow)

1. **Vào web:** Người dùng gõ link trang web, **CloudFront** lập tức trả về giao diện siêu tốc từ **S3**.
2. **Đăng nhập:** Người dùng nhập Email/Mật khẩu. Giao diện gửi thẳng lên **Amazon Cognito**. Cognito kiểm tra đúng sẽ trả về "Thẻ bài" (JWT Token).
3. **Thao tác:** Người dùng thao tác trên web. Giao diện kẹp chiếc "Thẻ bài" đó gửi qua **API Gateway**.
4. **Xử lý:** API Gateway đẩy dữ liệu vào **EC2** nằm an toàn trong **VPC**. Backend trên EC2 kiểm tra Thẻ bài hợp lệ, kết nối tới **Amazon RDS** lấy dữ liệu và trả về.
5. **Giám sát:** Mọi diễn biến trên đều được **CloudWatch** ghi chép lại đầy đủ và rõ ràng.
