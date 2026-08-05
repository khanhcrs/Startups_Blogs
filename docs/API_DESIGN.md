# THIẾT KẾ API (API DESIGN)

Tài liệu này quy định các tiêu chuẩn khi giao tiếp giữa Frontend và Backend. Tất cả API đều theo chuẩn RESTful.

## 1. Thông tin chung
- **Prefix:** `/api/v1`
- **Content-Type mặc định:** `application/json`
- **Xác thực:** Dùng header `Authorization: Bearer <JWT_TOKEN>` (Token lấy từ AWS Cognito).

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

## 3. Tiêu chuẩn Pagination & Filter

Đối với các API lấy danh sách (`GET /api/v1/startups`), Frontend truyền thông số qua Query String.

- `page`: Trang hiện tại (Mặc định: 1)
- `limit`: Số lượng kết quả mỗi trang (Mặc định: 10, Tối đa: 50)
- `sort`: Trường cần sắp xếp, thêm prefix `-` để xếp giảm dần (VD: `-createdAt`)
- `search`: Chuỗi tìm kiếm (Full-text hoặc ILIKE)
- `filter[field]`: Lọc theo trường cụ thể (VD: `filter[industry]=Technology`)

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

## 4. Quản lý File & Upload (Presigned URL)

Backend **không** trực tiếp nhận file qua form-data.
Quy trình:
1. Frontend gọi `POST /api/v1/storage/upload-url` truyền `fileName`, `fileType`.
2. Backend gọi S3 SDK tạo Presigned URL và trả về cho Frontend.
3. Frontend dùng phương thức `PUT` upload trực tiếp file lên URL đó.
4. Frontend gửi `S3 Object Key` lại cho Backend để lưu vào database (trong bảng Profile, Idea...).
