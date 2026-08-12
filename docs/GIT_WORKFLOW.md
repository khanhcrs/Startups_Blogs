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

### 2.2. Luồng publish backend hiện tại
1. Push vào `main` có thay đổi `backend/**` sẽ kích hoạt workflow publish riêng. Workflow này tự chạy lại lint, unit test và build trước khi push image; hiện nó không chờ job trong workflow `CI` bằng dependency `needs` hay `workflow_run`.
2. GitHub Actions tiến hành đọc file `Dockerfile` trong source code của bạn và thực hiện lệnh `docker build`.
3. Sau khi "gói" mã nguồn thành công vào Docker Image, GitHub Actions đăng nhập vào tài khoản AWS của bạn (thông qua cặp key bảo mật được cung cấp).
4. Đẩy (Push) Docker Image lên kho **Amazon ECR**.
5. **AWS App Runner** có thể phát hiện image `latest` nếu service đã bật Automatic Deployment ngoài repository.

> **Giới hạn hiện tại:** Frontend production gọi một URL API Gateway cố định, còn Terraform mô tả runtime API Gateway -> EC2:3000 với backend chạy bằng PM2. Workflow hiện chỉ publish image lên ECR; App Runner chỉ có thể tự deploy nếu service được cấu hình ngoài repository. Vì workflow không cập nhật EC2, workflow xanh chưa chứng minh backend mà frontend gọi đã được cập nhật. Cần xác minh integration live và chọn một compute target duy nhất trước khi gọi đây là CD end-to-end.

---

## 3. Cách Cấu Hình Thực Tế (Implementation)

### Bước 1: Tạo IAM User trên AWS
Để GitHub Actions có thể kết nối với AWS , cần tạo một "người dùng máy" (IAM User) trên AWS với quyền giới hạn (chỉ được phép đẩy file lên ECR).
- Vào AWS IAM -> Create User (ví dụ tên: `github-actions-bot`).
- Cấp một policy tùy chỉnh chỉ cho phép các thao tác ECR mà workflow cần trên đúng repository; tránh policy quản trị rộng nếu không cần.
- Lấy `AWS_ACCESS_KEY_ID` và `AWS_SECRET_ACCESS_KEY`.

### Bước 2: Khai báo Secrets trên GitHub
- Vào trang Repo trên GitHub -> **Settings** -> **Secrets and variables** -> **Actions**.
- Thêm các biến môi trường bảo mật:
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - Workflow hiện đặt trực tiếp `AWS_REGION: us-east-1` và `ECR_REPOSITORY: startups-blogs-backend`; `AWS_REGION`/`ECR_REPOSITORY_URL` hiện không được đọc từ secrets. Nếu muốn cấu hình theo môi trường, hãy chuyển chúng sang GitHub Actions Variables rồi cập nhật workflow.

### Bước 3: File Cấu Hình (Workflow File)
Workflow backend hiện nằm tại `.github/workflows/deploy-backend.yml`; nó chạy lint/test/build rồi publish image lên ECR và không cập nhật tiến trình PM2 trên EC2. Sau khi xác minh API Gateway integration, vẫn phải triển khai phiên bản mới vào đúng compute target thực tế mà Gateway đang gọi.
