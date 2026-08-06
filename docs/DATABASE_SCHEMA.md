# Cơ sở Dữ liệu Hệ thống (Database Schema)

Tài liệu này ghi chú lại cấu trúc cơ sở dữ liệu hiện tại (dựa trên Prisma Schema) phục vụ cho dự án **Startups & Blogs**.

## 1. Bảng `User`
Lưu trữ thông tin người dùng (Investor, Founder, hoặc Người đọc bình thường).
- `id` (UUID - Khóa chính)
- `email` (String - Unique)
- `password` (String - Đã mã hóa bằng bcrypt)
- `name` (String)
- `bio` (String - Tùy chọn)
- `location` (String - Tùy chọn)
- `avatarUrl` (String - Tùy chọn)
- `role` (Enum: `USER`, `ADMIN`, `MODERATOR`)

**Liên kết (Relations):**
- 1 User có thể sở hữu nhiều `Business` (ownedBusinesses).
- 1 User có thể viết nhiều `Article` (articles).
- 1 User có thể viết nhiều `Comment` (comments).
- Quan hệ Follow: 1 User có thể theo dõi nhiều User khác, và được theo dõi bởi nhiều User khác (`Follow`).

## 2. Bảng `Business` (Startup)
Lưu trữ thông tin cốt lõi của một Doanh nghiệp.
- `id` (UUID - Khóa chính)
- `slug` (String - Unique - Dùng cho URL thân thiện, VD: `/startup/open-ai`)
- `name` (String - Tên hiển thị)
- `legalName` (String - Tên pháp lý)
- `description` (String - Mô tả ngắn)
- `detailedOverview` (String - Bài giới thiệu chi tiết)
- `businessType` (String - VD: B2B, B2C...)
- `businessStage` (String - VD: Seed, Series A...)
- `industry` (String - Ngành nghề: AI, Fintech...)
- `location` (String - Trụ sở)
- `status` (Enum: `PENDING`, `APPROVED`, `REJECTED` - Trạng thái duyệt của Admin)
- `website`, `logoUrl`, `coverUrl` (String - Tùy chọn)
- `ownerId` (String - Trỏ về người tạo ra Startup này)
- `viewCount`, `savedCount`, `commentCount` (Int - Thống kê tự động)

**Liên kết (Relations):**
- Chứa nhiều `TeamMember` (Thành viên đội ngũ).
- Chứa nhiều `FundingRound` (Lịch sử gọi vốn).
- Chứa nhiều `FundingOpportunity` (Cơ hội đầu tư đang mở).
- Có thể đăng nhiều `Article` dưới danh nghĩa công ty.

## 3. Các Bảng Phụ của Business
### a. `TeamMember`
- `name`, `role`, `bio`, `avatarUrl`
- `userId` (Trỏ về tài khoản `User` của hệ thống - Tùy chọn)
- `businessId` (Khóa ngoại trỏ về `Business`)

### b. `FundingRound` (Lịch sử)
- `roundName`, `amount`, `currency`, `date`, `investors`
- `isVerified` (Boolean)
- `businessId` (Khóa ngoại)

### c. `FundingOpportunity` (Đang gọi vốn)
- `title`, `shortDescription`, `detailedOverview`, `fundingAmountMin`, `fundingAmountMax`, `currency`
- `fundingPurpose`, `fundingType` (Cổ phần, Khoản vay...)
- `status` (Draft, Pending Review, Published)
- `businessId` (Khóa ngoại)

## 4. Bảng Bài viết & Tương tác
### a. `Article` (Bài đăng/Blog/News)
- `title`, `summary`, `content`, `category`, `status`, `tags` (Mảng String)
- `likesCount`, `viewCount` (Thống kê số liệu)
- `authorId` (Trỏ về `User`)
- `businessId` (Tùy chọn - nếu bài viết này đại diện cho công ty)

### b. `Comment` (Bình luận lồng nhau)
- `content`, `authorId`, `articleId`
- `parentId` (Khóa ngoại tự trỏ về chính bảng Comment để làm chức năng Reply)

### c. `Bookmark` & `Follow`
- Các bảng trung gian lưu giữ trạng thái Lưu bài viết (`Bookmark`) và Theo dõi người dùng (`Follow`).

## 5. Bảng Quản trị & Nghiệp vụ (Mới thêm)
### a. `ContactRequest`
- Lưu trữ các yêu cầu liên hệ từ Người dùng gửi đến Doanh nghiệp (Inbox cho Founder).
- `senderId` (Người gửi), `businessId` (Doanh nghiệp nhận).
- `subject`, `message`, `status` (PENDING, REPLIED, ARCHIVED).

### b. `ChangeProposal`
- Lưu trữ các đề xuất thay đổi nội dung (Draft/Merge Workflow) cho Admin duyệt trước khi áp dụng.
- `entityType` (BUSINESS, ARTICLE), `entityId` (Khóa ngoại).
- `proposedData` (JSON - Dữ liệu muốn thay đổi).
- `status` (PENDING, APPROVED, REJECTED), `submittedById` (Người nộp đề xuất).
