# KIẾN TRÚC FRONTEND (FRONTEND ARCHITECTURE)

Dự án Frontend được setup bằng React 19, TypeScript, và Vite. 

## 1. Cấu trúc thư mục (Folder Structure)

```text
src/
├── assets/          # Hình ảnh tĩnh, SVG, font chữ
├── components/      # Các component dùng chung toàn cục (UI cơ bản, Layout)
├── features/        # Phân chia theo module/tính năng (Admin, Auth, Articles, Businesses...)
│   └── [feature]/   # Mỗi feature sẽ có riêng components, hooks, api, types của nó
├── hooks/           # Custom React hooks dùng chung (useDebounce, useClickOutside)
├── lib/             # Các cấu hình thư viện bên thứ 3 (axios interceptors, etc.)
├── pages/           # Các trang cấp cao (để map với React Router)
├── store/           # Quản lý Global State (Zustand)
├── styles/          # File CSS toàn cục (variables.css, global.css)
├── types/           # Interface dùng chung toàn dự án (không thuộc feature cụ thể)
├── utils/           # Các hàm tiện ích thuần túy (formatDate, formatCurrency)
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

## 4. Admin UI Architecture (Multi-Tab)

Giao diện quản trị viên (Admin Panel) được thiết kế theo kiến trúc **Multi-Tab (nhiều tab hoạt động song song)** để giữ nguyên trạng thái (state) khi chuyển đổi qua lại giữa các tính năng (VD: không mất bộ lọc khi chuyển từ trang danh sách sang trang chỉnh sửa).

### 4.1. Quy tắc hoạt động của Admin Multi-Tab
- **State Tabs:** Quản lý bằng `adminTabsStore.ts` (Zustand), lưu giữ các tab đang mở thay vì chỉ rely hoàn toàn vào React Router.
- **Render Cơ chế ẩn/hiện:** Thay vì unmount component cũ khi route thay đổi (như `<Outlet />`), hệ thống render tất cả các tab đang mở và dùng `display: none` cho những tab không active.
- **Điều hướng bên ngoài:** Nếu ở trong giao diện Admin mà user click vào một đường link dẫn ra trang ngoài (VD: Trang chủ, Business Detail public, Article Detail public), bắt buộc phải sử dụng `target="_blank" rel="noopener noreferrer"` để mở ở tab trình duyệt mới, giữ nguyên Workspace của Admin.
