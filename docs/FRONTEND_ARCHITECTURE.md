# KIẾN TRÚC FRONTEND (FRONTEND ARCHITECTURE)

Dự án Frontend được setup bằng React 19, TypeScript, và Vite. 

## 1. Cấu trúc thư mục (Folder Structure)

```text
src/
├── assets/          # Hình ảnh tĩnh, SVG, font chữ
├── components/      # Các component tái sử dụng được chia theo tính năng
│   ├── ui/          # Các component nhỏ gọn (Button, Input, Modal, Badge...)
│   ├── layout/      # Header, Footer, Sidebar, Layout chính
│   └── [feature]/   # Component dành riêng cho một tính năng (vd: business, idea)
├── hooks/           # Custom React hooks (vd: useAuth, useDebounce)
├── pages/           # Các trang tương ứng với Route (Home, BusinessDetail, ...)
├── services/        # Các file gọi API Backend (axios, fetch fetchers)
├── store/           # Quản lý Global State (TanStack Query context, Zustand/Context API)
├── styles/          # File CSS toàn cục (variables.css, reset.css)
├── types/           # Các Interface, Type dùng chung toàn dự án
├── utils/           # Các hàm hỗ trợ (formatDate, formatCurrency, validation...)
├── App.tsx          # Định nghĩa Routes
└── main.tsx         # Entry point
```

## 2. Quy chuẩn CSS & Styling

Vì dự án **KHÔNG** sử dụng Tailwind, Bootstrap hay Material UI, chúng ta sử dụng **CSS Modules + CSS Variables**.

### 2.1 CSS Variables
Tất cả mã màu, spacing, font-size phải được lấy từ file `src/styles/variables.css`. 
Ví dụ: `color: var(--primary-500);` thay vì dùng mã HEX hardcode.

### 2.2 CSS Modules
Mọi component/page đều có file `.module.css` riêng để tránh trùng lặp class.
- Tên class sử dụng chuẩn camelCase (vd: `className={styles.submitBtn}`).
- Hạn chế nesting quá sâu trong CSS để tối ưu render.

## 3. Data Fetching & State Management

- **Server State (Dữ liệu từ API):** Sử dụng **TanStack Query (React Query)**. Bắt buộc dùng để quản lý loading, error, cache, và pagination.
- **Client State (Trạng thái UI):** Sử dụng `useState` cho trạng thái cục bộ, hoặc React Context cho trạng thái toàn cục (ví dụ: Auth context, Theme).
- **Form State:** Sử dụng **React Hook Form** kết hợp với **Zod** để validate phía Frontend. Zod schema phải đồng bộ (match) với DTO validation dưới Backend.
