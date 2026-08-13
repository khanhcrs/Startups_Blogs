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

### 2.2. Trạng thái triển khai backend hiện tại
1. Push hoặc Pull Request vào `main` kích hoạt workflow `CI`.
2. Backend được cài dependencies, tạo Prisma Client, lint, chạy unit test và build.
3. Dự án production sử dụng đường API Gateway -> EC2 và không dùng ECR/App Runner.
4. Repository chưa tự động triển khai hoặc restart backend trên EC2.

> **Giới hạn hiện tại:** CI xanh chứng minh mã vượt qua quality gate, không chứng minh backend production đã được cập nhật. Chỉ xây dựng CD EC2 sau khi xác minh integration live, cách chạy tiến trình, biến môi trường, health check và rollback.

---

## 3. Cách Cấu Hình Thực Tế (Implementation)

### Bước tiếp theo để có CD EC2 an toàn
1. Xác minh API Gateway production đang trỏ tới EC2 nào.
2. Ghi lại cách backend chạy trên EC2 và vị trí cấu hình runtime.
3. Bổ sung health check, backup và quy trình rollback.
4. Cấp quyền triển khai tối thiểu, ưu tiên OIDC hoặc AWS Systems Manager thay cho access key/SSH dài hạn.
5. Chỉ thêm workflow deploy sau khi thử nghiệm runbook trên môi trường staging.
