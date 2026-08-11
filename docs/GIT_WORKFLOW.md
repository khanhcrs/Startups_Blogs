# Chiến lược Quản lý Mã nguồn (Git) & CI/CD Pipeline

Tài liệu này hướng dẫn cách tổ chức Git Branching và cách thiết lập luồng CI/CD (Continuous Integration & Continuous Deployment) thông qua GitHub Actions và AWS.

---

## 1. Chiến lược Nhánh (Git Branching Strategy)

Dự án áp dụng mô hình **Trunk-Based Development** (hoặc GitHub Flow rút gọn) để tăng tốc độ phát triển.
- **`main`**: Nhánh duy nhất phản ánh trạng thái Production (đang chạy trên thực tế). Code trên nhánh này LUÔN PHẢI CHẠY ĐƯỢC.
- **`feature/<tên-chức-năng>`**: Khi làm một chức năng mới (ví dụ: `feature/business-profile`), tạo nhánh này từ `main`. Sau khi xong, tạo Pull Request (PR) ghép vào `main`.
- **`hotfix/<tên-lỗi>`**: Dành cho việc sửa lỗi khẩn cấp đang bị hỏng trên `main`.

---

## 2. CI/CD: Tại sao cần và Hoạt động ra sao?

**CI/CD là gì?**
Thay vì người dùng phải gõ lệnh build thủ công trên máy tính của mình, sau đó copy file đẩy lên server (rất dễ sai sót và mất thời gian), CI/CD giống như một "con robot" chạy trên nền tảng GitHub. Nó sẽ làm việc này thay người dùng.

### 2.1. Luồng Continuous Integration (CI - Tích hợp liên tục)
1. Lập trình viên đẩy code (push) lên nhánh `main` (hoặc mở Pull Request).
2. **GitHub Actions** tự động cấp phát một máy chủ ảo chạy quy trình CI.
3. Chạy `npm install` để cài đặt thư viện.
4. Chạy `npm run lint` để kiểm tra lỗi cú pháp (oxlint).
5. (Nếu có) Chạy `npm run test` để chạy các bài unit test.
6. **Mục đích:** Nếu bước 3, 4, hoặc 5 thất bại, "robot" sẽ báo đèn đỏ và dừng toàn bộ quá trình lại, báo cho người dùng biết code đang lỗi, không được phép đưa lên server.

### 2.2. Luồng Continuous Deployment (CD - Triển khai liên tục)
1. Khi quy trình CI "đèn xanh" (thành công), bước CD sẽ bắt đầu.
2. GitHub Actions tiến hành đọc file `Dockerfile` trong source code và thực hiện lệnh `docker build`.
3. Sau khi "gói" mã nguồn thành công vào Docker Image, GitHub Actions đăng nhập vào tài khoản AWS (thông qua cặp key bảo mật được cung cấp).
4. Đẩy (Push) Docker Image lên kho **Amazon ECR**.
5. **AWS App Runner** (đã được cấu hình tự động) sẽ phát hiện có Image mới, tự tải về và chạy thay thế cho server cũ. Mọi thứ hoàn toàn tự động trong khoảng 5-10 phút.

---

## 3. Cách Cấu Hình Thực Tế (Implementation)

### Bước 1: Tạo IAM User trên AWS
Để GitHub Actions có thể kết nối với AWS , cần tạo một "người dùng máy" (IAM User) trên AWS với quyền giới hạn (chỉ được phép đẩy file lên ECR).
- Vào AWS IAM -> Create User (ví dụ tên: `github-actions-bot`).
- Cấp quyền `AmazonEC2ContainerRegistryPowerUser`.
- Lấy `AWS_ACCESS_KEY_ID` và `AWS_SECRET_ACCESS_KEY`.

### Bước 2: Khai báo Secrets trên GitHub
- Vào trang Repo trên GitHub -> **Settings** -> **Secrets and variables** -> **Actions**.
- Thêm các biến môi trường bảo mật:
 - `AWS_ACCESS_KEY_ID`
 - `AWS_SECRET_ACCESS_KEY`
 - `AWS_REGION` (ví dụ: `us-east-1`)
 - `ECR_REPOSITORY_URL` (URL của repo ECR tạo ở phần AWS).

### Bước 3: File Cấu Hình (Workflow File)
Người đọc sẽ tạo một file tại đường dẫn `.github/workflows/deploy.yml` ngay trong code Backend . Nội dung file sẽ là các chỉ thị (chạy lệnh docker build, aws ecr get-login-password...) để nói cho GitHub biết phải làm gì. Khi Backend được khởi tạo, file này sẽ được sinh ra tự động.
