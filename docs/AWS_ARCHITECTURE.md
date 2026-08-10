# Thiết kế Kiến trúc AWS (Startups Blogs)

Tài liệu này mô tả chi tiết **kiến trúc đám mây thực tế** của dự án Startups Blogs dựa trên mã nguồn (source code) hiện tại. Kiến trúc này được thiết kế theo hướng **đơn giản, dễ bảo trì và tiết kiệm chi phí nhất** dành cho giai đoạn đầu của Startup.

---

## 1. Tổng quan Kiến trúc (Architecture Overview)

Hệ thống của chúng ta hiện tại KHÔNG sử dụng các dịch vụ quá phức tạp như Cognito hay App Runner. Thay vào đó, toàn bộ sức mạnh xử lý và dữ liệu được gom gọn vào **một máy chủ ảo duy nhất (EC2)**, đứng sau một cánh cổng bảo vệ là **API Gateway**.


## 2. Chi tiết Từng Thành phần & Vai trò

### 2.1. Tầng Xác thực nội bộ (Local Authentication)
* **Thực trạng mã nguồn:** Thay vì dùng AWS Cognito, hệ thống của bạn tự tay quản lý việc Đăng ký / Đăng nhập.
* **Cách hoạt động:** 
  - Mật khẩu của người dùng được băm (hash) và bảo mật bằng thư viện `bcrypt`.
  - Khi Đăng nhập đúng, Backend sử dụng thư viện `@nestjs/jwt` để tự tạo ra một vé thông hành (JWT Token) và gửi về cho Frontend. Frontend dùng vé này để chứng minh danh tính cho các lần gọi API sau.

### 2.2. Amazon API Gateway (Tầng Cửa ngõ)
* **Nhiệm vụ:** Là điểm tiếp xúc duy nhất giữa thế giới bên ngoài và máy chủ của bạn.
* **Cách hoạt động:** Mọi yêu cầu (request) từ Frontend gửi lên mạng đều phải đi qua API Gateway. Dịch vụ này nhận yêu cầu và chuyển tiếp (forward) y hệt nguyên bản tới địa chỉ IP của máy chủ EC2 thông qua cơ chế định tuyến `ANY /{proxy+}`. Việc này giúp giấu đi địa chỉ IP thật của máy chủ.

### 2.3. Amazon EC2 - t2.micro (Tầng Xử lý & Dữ liệu)
* **Nhiệm vụ:** Trái tim của toàn bộ hệ thống, chịu trách nhiệm cả tính toán logic và lưu trữ dữ liệu.
* **Phần Backend (NestJS):** Được biên dịch (build) thành Javascript và chạy ngầm liên tục 24/7 nhờ công cụ quản lý tiến trình **PM2**. Mở cửa giao tiếp ở cổng `3000`.
* **Phần Database (PostgreSQL):** Chạy bên trong một bộ chứa **Docker** nằm ngay trong EC2. Điều này giúp bạn tiết kiệm được tiền thuê dịch vụ Amazon RDS đắt đỏ ở giai đoạn đầu, nhưng vẫn đảm bảo Database chạy ổn định và tách biệt ở cổng `5432` nội bộ.

---

## 3. Tóm tắt Luồng Chạy Thực tế (End-to-End Flow)

1. Người dùng thao tác trên giao diện web (hiện tại là `http://localhost:5173`).
2. Giao diện (React) gửi một request Đăng nhập (hoặc lấy dữ liệu) lên đường link của **API Gateway**.
3. **API Gateway** nhận được, lập tức ném thẳng request đó sang cổng 3000 của máy chủ **EC2**.
4. **Backend (NestJS)** nằm trong EC2 đón lấy request, xử lý logic (ví dụ kiểm tra mật khẩu bằng `bcrypt`), sau đó quay sang hỏi chuyện **Database (PostgreSQL Docker)** cũng nằm chung trong EC2.
5. Database trả kết quả -> Backend tạo Token -> Trả về qua API Gateway -> Giao diện hiển thị thành công!

*(Kiến trúc này rất gọn nhẹ, phù hợp hoàn hảo với mã nguồn hiện tại của bạn và chi phí duy trì trên AWS là rẻ nhất!)*
