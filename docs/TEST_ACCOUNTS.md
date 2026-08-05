# Danh sách Tài khoản Kiểm thử (Test Accounts)

Dưới đây là các tài khoản mẫu (Mock Accounts) được khởi tạo tự động trong Database (thông qua `seed.ts`). Tất cả tài khoản đều sử dụng chung một mật khẩu để tiện lợi cho việc kiểm thử.

**Mật khẩu chung cho tất cả tài khoản:** `password123`

## 1. Tài khoản Quản trị (Admin)
Tài khoản có quyền cao nhất hệ thống, truy cập được trang Admin Dashboard để duyệt Startup, xóa bài viết, xóa bình luận rác và thống kê toàn cục.

- **Email:** `admin@startups.vn`
- **Họ và tên:** Quản Trị Viên
- **Vai trò:** `ADMIN`

## 2. Tài khoản Độc giả / Nhà đầu tư (User)
Tài khoản người dùng thông thường dùng để đọc tin tức, thích (like), bình luận (comment), lưu bài (bookmark) và theo dõi (follow).

- **Email:** `user@startups.vn`
- **Họ và tên:** Nhà Đầu Tư Angel
- **Vai trò:** `USER`

## 3. Tài khoản Người sáng lập (Founders / Business Owners)
Có tổng cộng 12 tài khoản Founder. Mỗi tài khoản này là chủ sở hữu (Owner) của một Startup cụ thể trong hệ thống. Dùng để đăng bài viết PR (Blogs/News), đăng tin gọi vốn, quản lý Team Members, v.v.

- **Email:** `founder1@startups.vn` (Tương tự từ `founder1` đến `founder12`)
- **Họ và tên:** Founder 1 (đến Founder 12)
- **Vai trò:** `USER` (Tuy nhiên họ đóng vai trò là Chủ sở hữu của các Business tương ứng)

---
*Lưu ý: Nếu bạn vô tình làm hỏng dữ liệu hoặc quên tài khoản, bạn có thể chạy lệnh `npm run db:seed` ở thư mục Backend để khôi phục toàn bộ dữ liệu mẫu này lại từ đầu.*
