# Chiến lược Kiểm Thử (Testing Strategy) - Phase 8

Tài liệu này ghi nhận lại chiến lược và các kịch bản kiểm thử cho các tính năng thuộc Phase 8.

## 1. Unit Tests (Backend)

**Mục tiêu:** Đảm bảo các logic nghiệp vụ quan trọng trong Service hoạt động chính xác và an toàn.

### `ArticlesService` (`articles.service.spec.ts`)
- **Tạo bài viết (`create`)**:
  - `Trường hợp hợp lệ`: Tạo bài viết mới thành công với đầy đủ các trường `title`, `summary`, `content`, `category`.
  - `Trường hợp lỗi bảo mật`: Khi user truyền lên `businessId` không thuộc về họ, hệ thống phải ném ra lỗi `ForbiddenException`.
- **Lấy bài viết của chính mình (`findMyArticles`)**:
  - `Trường hợp hợp lệ`: Chỉ trả về danh sách các bài viết mà `authorId` khớp với ID của user hiện tại.
- **Xóa bài viết (`remove`)**:
  - `Trường hợp không tìm thấy`: Ném lỗi `NotFoundException` nếu bài viết không tồn tại.
  - `Trường hợp lỗi bảo mật`: Ném lỗi `ForbiddenException` nếu user không phải là tác giả của bài viết.
  - `Trường hợp hợp lệ`: Xóa thành công nếu thỏa mãn tất cả điều kiện.

## 2. Integration / E2E Tests (Luồng User - Frontend)

**Mục tiêu:** Đảm bảo giao diện người dùng giao tiếp đúng với các API backend.

### Cập nhật Profile (Settings)
1. User vào trang `/user/me`.
2. Mở tab **Settings**.
3. Sửa `Name`, `Bio`, `Location` và bấm **Save Changes**.
4. **Kỳ vọng:** Thông tin cập nhật hiển thị ngay lập tức, dữ liệu trên Header / Bio thay đổi. (API `PUT /users/me` trả về 200).

### Đăng bài (Create Blog)
1. User vào trang `/create-blog`.
2. Gắn ảnh bìa bằng component `<ImageUploader />` (MinIO upload).
3. Nhập Tiêu đề, Nội dung.
4. Bấm **Lưu Nháp**.
5. **Kỳ vọng:** API `POST /articles` được gọi, thông báo lưu nháp thành công, User được chuyển về trang cá nhân.
6. Tại trang cá nhân, bài viết mới tạo hiển thị trong tab **Posts Management** với trạng thái là `DRAFT`.
7. User có thể bấm vào nút **Xóa (Thùng rác)** và bài viết biến mất sau khi xác nhận. (API `DELETE /articles/:id` được gọi).
