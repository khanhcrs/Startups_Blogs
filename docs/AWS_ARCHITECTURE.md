# Thiết kế Kiến trúc AWS (Startups Blogs)

Tài liệu này mô tả kiến trúc được khai báo trong repository và các giới hạn triển khai hiện còn phải xác minh trên tài khoản AWS thực tế.

---

## 1. Tổng quan Kiến trúc (Architecture Overview)

Hệ thống tách Frontend, Backend, Database và xác thực. Terraform quản lý phần hạ tầng có trong thư mục `terraform/`; App Runner và quy trình cập nhật backend EC2 hiện chưa được quản lý đầy đủ tại đây.

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
* **Amazon API Gateway:** Cung cấp public endpoint và chuyển tiếp request từ Frontend tới backend. Trong Terraform hiện tại, cổng EC2 `3000` vẫn mở public nên API Gateway chưa làm EC2 thành private hay ngăn truy cập trực tiếp; cần siết Security Group hoặc dùng private integration nếu đó là yêu cầu production.

### 2.6. Tầng Xử lý Logic (Backend Compute)
* **Amazon EC2 (Elastic Compute Cloud):** Máy chủ ảo chạy hệ điều hành Linux (Ubuntu).
 - Chứa mã nguồn Backend (NestJS) và chạy liên tục 24/7 nhờ công cụ quản lý tiến trình **PM2**.
 - Xử lý nghiệp vụ kinh doanh và kết nối Database.

### 2.7. Tầng Cơ sở Dữ liệu (Database)
* **Amazon RDS (Relational Database Service) for PostgreSQL:** Trái tim dữ liệu của hệ thống.
 - Tự động sao lưu (backup), chống lỗi phần cứng và duy trì dữ liệu an toàn tuyệt đối, tách biệt hoàn toàn khỏi máy chủ EC2.

### 2.8. Tầng Giám sát & Tự động hóa (Monitoring & IaC)
* **Amazon CloudWatch:** Terraform hiện khai báo một cảnh báo CPU cao cho EC2 gửi trạng thái qua SNS, cùng dashboard hiển thị CPU EC2 và CPU/số kết nối RDS. Repository chưa khai báo thu thập log cho API Gateway/EC2 hoặc metric RAM EC2; cấu hình live ngoài Terraform phải được kiểm tra riêng.
* **Terraform (Infrastructure as Code - IaC):** Khai báo VPC, S3/CloudFront, RDS, EC2, API Gateway, Cognito và các IAM policy trong thư mục `terraform/`. App Runner, biến môi trường runtime và bước triển khai/restart tiến trình backend trên EC2 chưa được tự động hóa trong repository.

---

## 3. Tóm tắt Luồng Chạy Thực tế (End-to-End Flow)

1. **Vào web:** Người dùng gõ link trang web, **CloudFront** lập tức trả về giao diện siêu tốc từ **S3**.
2. **Đăng nhập:** Người dùng nhập Email/Mật khẩu. Giao diện gửi thẳng lên **Amazon Cognito**. Cognito kiểm tra đúng sẽ trả về "Thẻ bài" (JWT Token).
3. **Thao tác:** Người dùng thao tác trên web. Giao diện kẹp chiếc "Thẻ bài" đó gửi qua **API Gateway**.
4. **Xử lý theo topology Terraform:** API Gateway proxy vào **EC2:3000**. Cần đối chiếu integration của Gateway production trên AWS trước khi khẳng định URL hardcode của frontend đang trỏ đúng instance Terraform này.
5. **Giám sát:** Terraform hiện cảnh báo CPU EC2 và hiển thị metric EC2/RDS; log ứng dụng và API Gateway phải được xác minh/cấu hình riêng.

---

## 4. Hợp đồng triển khai Production hiện tại

Hai đường compute đang cùng tồn tại trong repository và **không phải cùng một đích đến**:

- Terraform cấu hình một đường `API Gateway -> EC2:3000`; frontend production gọi một URL API Gateway cố định. Endpoint đó đã trả về đúng lỗi 401 của backend cho `/admin/stats`, nhưng repository không đủ bằng chứng để khẳng định integration production chính là EC2 do state Terraform này quản lý.
- `.github/workflows/deploy-backend.yml` build và push image lên ECR cho App Runner. Workflow này không cập nhật tiến trình backend trên EC2.

Vì vậy, trước khi phát hành phải kiểm tra integration thật của Gateway production, rồi triển khai backend vào đúng compute target đó. Không được xem việc push image ECR/App Runner là bằng chứng API Gateway đã cập nhật.

### 4.1. Cấu hình Cognito cho backend runtime

Runtime phải khai báo cùng một User Pool với frontend:

- `COGNITO_USER_POOL_ID`
- `COGNITO_CLIENT_ID`
- `COGNITO_REGION` (tùy chọn; backend suy ra từ prefix của `COGNITO_USER_POOL_ID` khi không khai báo, thay vì mặc định theo region ECR hay EC2)

Terraform xuất `backend_cognito_user_pool_id`, `backend_cognito_region` và `backend_cognito_client_id`. Nếu production dùng User Pool bên ngoài Terraform, phải truyền đồng thời ARN chính xác qua `backend_cognito_user_pool_arn` và App Client ID thuộc chính pool đó qua `backend_cognito_client_id`; Terraform chặn cấu hình chỉ có một trong hai. Các output không tự inject biến môi trường hoặc restart backend.

EC2 instance role chỉ được cấp `cognito-idp:AdminListGroupsForUser`, `cognito-idp:AdminAddUserToGroup`, `cognito-idp:AdminRemoveUserFromGroup` và `cognito-idp:AdminUserGlobalSignOut` trên ARN User Pool này. Backend dùng chúng để xác minh membership hiện thời, đổi role và thu hồi phiên cũ sau khi đổi role; không cấp wildcard Cognito. `GetUser` được ủy quyền bằng access token của chính user nên không cần IAM action. Group `ADMIN` phải tồn tại trong chính User Pool đó.

Nếu chọn App Runner là topology chính, cần chuyển API Gateway/frontend sang App Runner và gắn policy Cognito tương đương cho **App Runner instance role**. Repository hiện chưa quản lý App Runner service/instance role bằng Terraform, nên không tự động suy diễn hay thay đổi topology này.
