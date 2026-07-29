DATABASE SCHEMA — PostgreSQL + Prisma

Schema khởi đầu nằm tại prisma/schema.prisma.

Vì sao dùng PostgreSQL cho MVP

Startups Blogs có nhiều quan hệ và truy vấn linh hoạt:

User sở hữu/tham gia nhiều startup.

Startup có nhiều idea và member.

Investor lưu nhiều startup.

Contact request liên quan user, startup và có thể liên quan idea.

Admin cần filter, sort, report và audit.

Mô hình quan hệ giúp biểu diễn và truy vấn các quan hệ này trực tiếp, đồng thời Prisma tạo type-safe client cho Node.js/TypeScript.

Core entities

User
├── owned Startups
├── StartupMemberships
├── InvestorProfile
├── AuthoredIdeas
├── SavedStartups
├── ContactRequests
├── Articles
└── Notifications

Startup
├── Members
├── Categories
├── Ideas
├── Saves
├── ContactRequests
└── FeaturedStartup records

Idea
├── Startup
├── Author
├── Media
├── ContactRequests
└── Moderator review metadata

Source of identity

Cognito sub lưu ở User.cognitoSub và unique.

PostgreSQL lưu profile và quyền nghiệp vụ.

Không lưu password/hash Cognito trong database.

Migration rules

Mọi thay đổi schema đi qua Prisma migration.

Không sửa production DB thủ công.

Migration destructive cần review và backup.

Seed data chỉ dùng category, demo dev và admin bootstrap có kiểm soát.

Indexing ưu tiên

User.cognitoSub, User.email unique.

Startup.slug, Idea.slug, Article.slug, InvestorProfile.slug unique.

Index cho status/publishedAt/createdAt.

Index cho Startup.stage, Idea.status, Article.type + status.

Composite key cho SavedStartup và StartupMember.

DynamoDB note

DynamoDB có thể được dùng cho một số workload sau này như notification stream, chat presence hoặc event counters. Không dùng DynamoDB làm database chính của MVP trừ khi đội ngũ chấp nhận thiết kế access-pattern-first, denormalization và tự quản lý quan hệ trong code.
