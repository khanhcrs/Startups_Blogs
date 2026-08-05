# Business Context & User Flows (Startups Blogs)

Tài liệu này tổng hợp bối cảnh kinh doanh, các luồng tương tác (Flows) và mô hình hoạt động của nền tảng **Startups Blogs**. Tài liệu đóng vai trò là "Kim chỉ nam" để tra cứu nhanh khi phát triển các tính năng mới hoặc onboarding thành viên mới.

- **Articles & News (Bài viết & Tin tức)**:
  - `User` có thể viết và đăng các Blog / Phân tích chuyên sâu (Category = Blog, Technology, v.v.).
  - Các bài viết `News` (Tin tức) được thiết kế đặc thù chỉ cho phép các `User` mang role `ADMIN` đăng để đảm bảo tính xác thực.
  - Mỗi bài viết có thể gắn `businessId` nếu bài viết đại diện cho doanh nghiệp (ví dụ như bài PR hoặc thông cáo báo chí).
  - Khách truy cập hoặc User khác có thể đọc (View), thích (Like), bình luận (Comment), chia sẻ, và đánh dấu (Bookmark) bài viết.
  - Bình luận hỗ trợ lồng nhau (Replies).

---

## 1. Bối cảnh Kinh doanh (Business Context)

### 1.1 Mục tiêu nền tảng
**Startups Blogs** là một nền tảng kết nối đầu tư và kinh doanh (Business Investment Connection Platform). Nền tảng được định hình như một **"Mạng xã hội thu nhỏ (Social Network Lite) dành cho Startup và Nhà đầu tư"**.
Thay vì chỉ là một danh bạ công ty khô khan, Startups Blogs tập trung vào **sự tương tác**: cho phép người dùng theo dõi (Follow), xem các cập nhật mới nhất (Updates/Blogs), tìm hiểu đội ngũ (Team) và khám phá các cơ hội gọi vốn (Funding Opportunities).

### 1.2 Thực thể trung tâm (Central Entity)
- **Business (Doanh nghiệp/Startup):** Đây là lõi của hệ thống. Mọi hoạt động (gọi vốn, viết blog cập nhật, thông tin đội ngũ) đều xoay quanh Business.
- **User (Người dùng/Nhà đầu tư/Founder):** Các cá nhân tham gia vào nền tảng để quản lý Business của họ hoặc tìm kiếm các Business khác để đầu tư/hợp tác.

### 1.3 Giá trị cốt lõi
- **Với Founder (Người khởi nghiệp):** Có không gian chuyên nghiệp để giới thiệu startup, công bố các vòng gọi vốn (Funding Rounds), cập nhật tiến độ (Updates) và thu hút nhân tài/nhà đầu tư mà không cần công khai thông tin liên lạc cá nhân bừa bãi.
- **Với Investor/User (Nhà đầu tư/Người dùng):** Dễ dàng tìm kiếm startup theo bộ lọc (Ngành nghề, Giai đoạn, Nhu cầu vốn), theo dõi (Follow) các startup tiềm năng và liên hệ (Contact) trực tiếp qua nền tảng.

---

## 2. Các Luồng Người Dùng Chính (Core User Flows)

### Flow 1: Đăng ký & Xác thực (Registration & Authentication)
*Dựa trên kiến trúc AWS Cognito.*
1. Người dùng truy cập trang Đăng ký/Đăng nhập.
2. Nhập Email, Password (và thông tin cơ bản).
3. Hệ thống gửi mã OTP/Link xác thực qua Email (via AWS SES/Cognito).
4. Sau khi xác thực, Cognito trả về JWT Token.
5. Lần đăng nhập sau, Frontend gửi JWT Token trong Header (`Authorization: Bearer <token>`) cho mọi Request tới Backend (NestJS). Backend kiểm tra tính hợp lệ của Token trước khi trả về dữ liệu.

### Flow 2: Khám phá Doanh nghiệp (Explore & Browse)
1. Khách (Guest) hoặc Người dùng (User) vào trang `/explore`.
2. Trình duyệt hiển thị danh sách các Startup (Business Cards).
3. Người dùng sử dụng thanh Sidebar bên trái để **Filter** (Lọc) theo: Industry (Ngành), Stage (Giai đoạn), Funding Needs (Nhu cầu vốn).
4. Người dùng dùng thanh **Sort** để sắp xếp theo Trending, Mới nhất (Recent) hoặc đang theo dõi (Following).
5. FE gọi API `GET /api/v1/businesses` kèm theo các Query Parameters. BE xử lý phân trang (Pagination) và trả về dữ liệu.

### Flow 3: Trải nghiệm Chi tiết Doanh nghiệp (Business Profile - Social Lite)
1. Người dùng bấm vào một Business Card, chuyển hướng đến `/businesses/:id`.
2. Giao diện tải **Business Detail** với cấu trúc 3 Tabs:
   - **Overview:** Thông tin chung, Mô hình kinh doanh, Lịch sử gọi vốn (Funding History), Doanh thu.
   - **Updates:** Các bài Blog/Tin tức cập nhật do chính Business này đăng tải. Giúp nhà đầu tư theo dõi "nhịp sống" của startup.
   - **Team:** Lưới thông tin các Co-founder và nhân sự cốt cán (Avatar, Chức vụ, Bio).
3. **Tương tác:** Người dùng có thể bấm nút **Follow (Theo dõi)** màu cam nổi bật. Khi có Updates mới từ Business, hệ thống sẽ ưu tiên hiển thị trên Feed của người dùng này. Hoặc bấm **Message/Contact** để gửi yêu cầu liên hệ nội bộ.

### Flow 4: Quản lý Cá nhân (User Profile)
1. Người dùng truy cập trang cá nhân (Profile).
2. Tương tự Business Profile, trang cá nhân cũng có giao diện Header chuyên nghiệp (Avatar, Bio, Social Links, Location).
3. Các Tabs bao gồm:
   - **Posts/Updates:** Các bài viết cá nhân.
   - **Saved:** Các cơ hội đầu tư hoặc Business đã lưu (Bookmark).
   - **Settings:** Nơi thiết lập thông tin cá nhân, cập nhật mật khẩu, và tùy chỉnh thông báo.

### Flow 5: Đăng tin Gọi vốn (Funding Opportunities)
1. Founder vào trang quản lý Business của mình.
2. Chọn "Tạo cơ hội gọi vốn mới" (Post your Idea/Opportunity).
3. Điền thông tin chi tiết qua nhiều bước (Multi-step form): Nhu cầu vốn, Mục đích sử dụng vốn (Use of Funds), Kế hoạch tăng trưởng (Growth Plan).
4. Đính kèm tài liệu (Pitch Deck). Hệ thống lấy Presigned URL từ AWS S3, FE đẩy file trực tiếp lên S3.
5. Sau khi submit, cơ hội gọi vốn chuyển sang trạng thái `Pending Review`.
6. Moderator (Admin) duyệt. Nếu được duyệt, trạng thái chuyển sang `Published` và hiển thị công khai trên hồ sơ của Business.

### Flow 6: Quy trình Đề xuất Thay đổi (Change Proposals & Moderation)
Để bảo vệ tính xác thực của nền tảng, hệ thống áp dụng cơ chế "Đề xuất thay đổi" thay vì cho phép sửa trực tiếp.
1. Founder chỉnh sửa thông tin Doanh nghiệp (Business) hoặc Tác giả sửa Bài viết (Article).
2. Dữ liệu mới thay vì ghi đè thẳng vào Database, sẽ được lưu vào bảng `ChangeProposal` dưới định dạng JSON với trạng thái `PENDING`.
3. Admin nhận được thông báo, vào trang Admin Dashboard để xem xét sự khác biệt (Diff) giữa bản cũ và bản mới.
4. Nếu Admin chọn **Approve (Phê duyệt)**, JSON mới được hợp nhất (Merge) vào dữ liệu gốc và cập nhật trạng thái. Nếu **Reject**, bản nháp bị hủy bỏ.
5. Xuyên suốt quá trình này, bản gốc đang chạy Live (Published) vẫn không bị ảnh hưởng cho đến khi có quyết định cuối cùng từ Admin.

---

## 3. Quản lý Trạng thái & Dữ liệu (Data Flow & Logic)

*   **Tính xác thực (Verification):** Các Funding Rounds và Startups có thể có cờ `isVerified: boolean`. Backend/Admin sẽ cấp cờ này sau khi xác minh giấy tờ, giúp tăng uy tín trong mắt nhà đầu tư.
*   **Quản trị Nội dung (Moderation):** Admin có "quyền tối thượng" (Root privilege) trong việc kiểm duyệt không chỉ Startup/Bài viết mà còn ở cấp độ vi mô như Xóa trực tiếp mọi **Bình luận rác (Spam Comments)** hoặc thay đổi trạng thái ẩn/hiện mà không cần thông qua người dùng.
*   **Bộ đếm (Counters):** Lượt View (viewCount), Follow (followersCount), và Saved (savedCount) được cập nhật liên tục thông qua các API tương tác. Để tránh quá tải Database, có thể dùng Redis Cache để debounce lượt view trước khi ghi vào PostgreSQL.
*   **Phân quyền (RBAC):** Backend (NestJS) áp dụng Guards/Interceptors để chặn quyền truy cập. FE (React) sẽ ẩn các nút Edit/Delete nếu `isOwner === false` hoặc `role !== ADMIN`. Mọi quyết định cuối cùng về dữ liệu phải nằm ở Backend.
