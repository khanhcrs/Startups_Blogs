# THIẾT KẾ API (API DESIGN)

Tài liệu này quy định các tiêu chuẩn khi giao tiếp giữa Frontend và Backend. Tất cả API đều theo chuẩn RESTful.

## 1. Thông tin chung
- **Prefix:** `/api/v1`
- **Content-Type mặc định:** `application/json`
- **Xác thực:** Dùng header `Authorization: Bearer <JWT_TOKEN>`. > **Note:** Mục tiêu dài hạn là sử dụng AWS Cognito để cấp Token. Tuy nhiên, trong giai đoạn MVP hiện tại, dự án đang dùng Local JWT + bcrypt (xử lý trực tiếp trên Backend Node.js) để tối ưu thời gian phát triển.

## 2. Tiêu chuẩn Response

Mọi phản hồi từ server (kể cả lỗi) đều trả về một cấu trúc JSON thống nhất để Frontend dễ dàng bắt lỗi.

### 2.1 Thành công (Success - 2xx)
```json
{
 "success": true,
 "data": { ... },
 "message": "Tùy chọn, mô tả kết quả trả về"
}
```

### 2.2 Thất bại (Error - 4xx, 5xx)
```json
{
 "success": false,
 "error": {
 "code": "ERROR_CODE",
 "message": "Mô tả lỗi dễ hiểu cho người dùng cuối",
 "details": [] // Dùng cho validation form
 }
}
```

## 3. Tiêu chuẩn Pagination & Filter (Phân trang và Lọc)

Đối với các API lấy danh sách (VD: `GET /businesses` hoặc `GET /articles`), Frontend truyền thông số qua Query String.

- `page`: Trang hiện tại (Mặc định: 1)
- `limit`: Số lượng kết quả mỗi trang (Mặc định: 10)
- `sort`: Trường cần sắp xếp (VD: `createdAt`, `viewCount`)
- `search`: Chuỗi tìm kiếm (Full-text hoặc ILIKE theo Title/Name)
- Các tham số lọc tùy chỉnh (Advanced Filters): Truyền trực tiếp dưới dạng query, ví dụ:
 - `category=Blogs`
 - `tag=Technology`
 - `startDate=2026-08-01` & `endDate=2026-08-31`

**Response cho danh sách có phân trang:**
```json
{
 "success": true,
 "data": [ ... ],
 "meta": {
 "total": 150,
 "page": 1,
 "limit": 10,
 "totalPages": 15
 }
}
```

## 4. Quản lý File & Upload (MinIO / S3)

Backend **không** trực tiếp nhận file qua form-data để lưu vào ổ cứng local nhằm dễ dàng scale.
Quy trình:
1. Frontend gọi `POST /upload` (body là multipart form-data).
 *(Lưu ý: Hệ thống đang dùng `POST /upload` upload file thông qua `UploadController` sử dụng `Multer` và AWS S3 SDK đẩy lên MinIO/S3)*.
2. Backend lưu file lên MinIO (S3 clone) và trả về URL trực tiếp của file.
3. Frontend dùng URL đó (`https://.../bucket/file.png`) để lưu vào Database.
