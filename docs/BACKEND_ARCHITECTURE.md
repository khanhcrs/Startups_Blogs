# KIẾN TRÚC BACKEND (BACKEND ARCHITECTURE)

Hệ thống Backend được xây dựng bằng **NestJS** với TypeScript và **Prisma ORM**.

## 1. Cấu trúc Module (Module-based Architecture)

NestJS sử dụng cấu trúc Module. Mỗi tính năng (Domain) sẽ nằm trong một module độc lập.

```text
src/
├── common/ # Dùng chung cho mọi module
│ ├── decorators/ # Custom decorators (vd: @CurrentUser)
│ ├── filters/ # Global Exception Filters
│ ├── guards/ # Auth, Roles guard
│ └── interceptors/ # Response formatting interceptors
├── config/ # Cấu hình môi trường (env, aws, db)
├── prisma/ # Prisma service, schema, migrations
├── modules/ # Chứa các feature module (được cấu trúc phẳng ở root thư mục src/)
│ ├── auth/ # Verify token Cognito/JWT, đăng nhập, đăng ký
│ ├── users/ # Quản lý User profile, role
│ ├── businesses/ # Quản lý Startup/Business profile, CRUD
│ ├── articles/ # Quản lý bài viết (Blogs, News), filter, view count
│ ├── comments/ # Quản lý bình luận lồng nhau
│ ├── upload/ # Tích hợp MinIO/S3 upload file
│ ├── admin/ # Quản trị viên xử lý duyệt, thống kê, thao tác bảo mật
│ ├── ... # Và các module phụ trợ khác (bookmarks, follows, notifications)
├── app.module.ts # Main module
└── main.ts # Bootstrapping (CORS, Swagger setup)
```

## 2. Quy trình xử lý Request

Mọi Request đi vào Controller sẽ được xử lý qua quy trình:
1. **Middleware / Guard:** Kiểm tra JWT qua Cognito Guard. Xác nhận quyền truy cập (Guest, Logged-in, Admin...).
2. **Pipes:** Xác thực (Validation) dữ liệu DTO bằng `class-validator` và `class-transformer`.
3. **Controller:** Nhận Request, trích xuất dữ liệu, gọi Service.
4. **Service:** Xử lý nghiệp vụ logic (Business Logic).
5. **Prisma Client:** Tương tác với PostgreSQL Database.
6. **Interceptor:** Format lại kết quả trả về đúng chuẩn (`{ success, data }`).
7. **Exception Filter:** Nếu có lỗi, chuyển về format lỗi chuẩn (`{ success: false, error }`).

## 3. Quản lý Prisma & Database

- Không sử dụng các câu query SQL thuần trừ trường hợp đặc biệt. Mọi truy vấn phải thông qua `PrismaClient`.
- Không truy vấn vòng lặp (N+1 query issue). Prisma hỗ trợ `include` để join bảng hiệu quả.
- Sử dụng Prisma Transactions khi cần cập nhật nhiều bảng liên quan (VD: Tạo Startup + Thêm Member).
