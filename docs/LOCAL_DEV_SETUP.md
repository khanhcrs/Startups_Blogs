# Hướng dẫn Thiết lập Môi trường Backend (Local Development)

Tài liệu này ghi chú lại cách hệ thống Backend (NestJS), Database (PostgreSQL) và Docker được cấu hình để chạy trên máy cá nhân (Local) phục vụ cho giai đoạn phát triển MVP - PoC.

---

## 1. Cấu trúc Thư mục Backend
Toàn bộ mã nguồn Backend nằm trong thư mục `/backend`.
- **Framework:** NestJS (Node.js).
- **Ngôn ngữ:** TypeScript.
- **ORM:** Prisma (`/backend/prisma/schema.prisma`).

---

## 2. Docker & Database (PostgreSQL)

Thay vì cài đặt PostgreSQL trực tiếp lên Windows (dễ gây xung đột và khó xóa sạch), chúng ta sử dụng **Docker Compose** để giả lập một máy chủ Database ảo.

### 2.1. File cấu hình: `docker-compose.yml`
- Sử dụng Image: `postgres:15-alpine` (Rất nhẹ).
- Port Mapping: `5433:5432`. 
  - *Lý do dùng cổng 5433:* Để tránh xung đột với bất kỳ dịch vụ PostgreSQL nào khác có thể đang chạy ngầm trên máy của bạn ở cổng 5432 mặc định.
- Volume: Dữ liệu được lưu vào volume `postgres_data`, đảm bảo không bị mất data khi tắt máy hoặc tắt Docker.

### 2.2. MinIO (S3 Storage)
Bên cạnh PostgreSQL, file `docker-compose.yml` cũng tích hợp sẵn **MinIO**, đóng vai trò làm máy chủ lưu trữ Object Storage (giả lập AWS S3) để xử lý việc upload Logo, Cover và tài liệu (Pitch Deck).
- MinIO chạy ở cổng `9000` (API) và `9001` (Giao diện quản lý).
- Giao diện quản lý (Console) có thể truy cập tại `http://localhost:9001` (User: `minioadmin`, Pass: `minioadmin`).

### 2.3. Khởi động các dịch vụ (Database & Storage)
Mở Terminal/PowerShell, di chuyển vào thư mục `/backend` và chạy:
```bash
docker-compose up -d
```
*(Lệnh này sẽ chạy Database và MinIO ngầm. Để tắt, dùng `docker-compose down`).*

---

## 3. Kết nối Prisma & Đồng bộ Schema

### 3.1. File Biến Môi Trường (`.env`)
Backend cần biết Database nằm ở đâu thông qua file `.env`.
```env
DATABASE_URL="postgresql://admin:secretpassword@127.0.0.1:5433/startups_blogs?schema=public"
```
*(Lưu ý địa chỉ là `127.0.0.1:5433` thay vì `localhost` để tránh lỗi IPv6 trên Windows).*

### 3.2. Cấu hình Prisma (`prisma.config.ts`)
Từ bản Prisma v7, đường dẫn kết nối không nằm trong `schema.prisma` nữa mà được khai báo tại `prisma.config.ts`. File này đã được setup để tự động đọc biến `DATABASE_URL` từ file `.env`.

### 3.3. Các Lệnh Prisma Quan Trọng
Mỗi khi bạn thay đổi cấu trúc bảng trong file `schema.prisma` (ví dụ: thêm cột mới), bạn cần chạy lệnh sau để đồng bộ vào Database:
```bash
npx prisma db push
```

Để xem và quản lý dữ liệu trong Database trực quan (như phpMyAdmin), bạn có thể dùng công cụ tích hợp sẵn của Prisma:
```bash
npx prisma studio
```
*(Lệnh này sẽ mở ra một trang web ở cổng 5555 cho phép bạn xem toàn bộ data).*

---

## 4. Chạy Backend (NestJS)

Sau khi Database đã chạy, bạn khởi động API Server bằng lệnh:
```bash
npm run start:dev
```
Server sẽ chạy ở `http://localhost:3000`. Cấu trúc code NestJS hỗ trợ "Hot-reload", nghĩa là bạn cứ viết code, server sẽ tự khởi động lại để áp dụng thay đổi.
