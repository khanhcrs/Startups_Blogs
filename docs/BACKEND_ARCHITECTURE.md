# BACKEND ARCHITECTURE — Startups Blogs

## 1. Mục tiêu và phạm vi

Tài liệu này định nghĩa kiến trúc backend cho MVP của **Startups Blogs** dựa trên `PROJECT_BRIEF.md`, `USER_STORIES.md` và `DATABASE_SCHEMA.md`.

Các quyết định nền tảng:

- `Business` là aggregate/domain trung tâm. `Startup` chỉ là một giá trị của `BusinessType`.
- Backend là REST API viết bằng Node.js, TypeScript và NestJS, prefix `/api/v1`.
- PostgreSQL là nguồn dữ liệu nghiệp vụ duy nhất; Prisma là ORM và migration tool.
- Amazon Cognito quản lý danh tính và mật khẩu; PostgreSQL quản lý hồ sơ, vai trò và quyền nghiệp vụ.
- S3 lưu file; database chỉ lưu object key và metadata, không lưu presigned URL.
- MVP triển khai theo modular monolith trên AWS App Runner. Module được tách theo domain để có thể tách service sau này nếu thực sự cần.

## 2. Kiến trúc tổng thể

```text
React/Vite (CloudFront + S3)
        |
        | HTTPS + Cognito access token
        v
AWS WAF / App Runner
        |
        v
NestJS REST API (modular monolith)
  |-- IAM/Auth: Cognito JWKS
  |-- Data: Prisma -> RDS PostgreSQL
  |-- Files: S3 presigned upload/download
  |-- Email: SES
  |-- Async: transactional outbox + scheduled worker
  `-- Observability: CloudWatch
```

App Runner là lựa chọn mặc định cho MVP theo Project Brief. ECS Fargate chỉ nên dùng khi cần worker độc lập, networking phức tạp hoặc kiểm soát tài nguyên sâu hơn.

## 3. Nguyên tắc thiết kế

1. **Modular monolith trước microservices**: một deployable, một database, transaction đơn giản; boundary vẫn rõ để tránh code phụ thuộc vòng.
2. **Feature/domain first**: tổ chức theo nghiệp vụ thay vì gom toàn bộ controller/service/repository toàn cục.
3. **Authorization ở backend**: role là điều kiện cần; ownership, membership, trạng thái và visibility mới quyết định quyền cuối cùng.
4. **Public read model tách khỏi owner/admin view**: DTO public không chứa field confidential, kể cả giá trị `null` hay object key.
5. **State transition có kiểm soát**: không cho client cập nhật trực tiếp status bất kỳ.
6. **Idempotency cho mutation nhạy cảm**: submit review, approve/reject, contact request và upload completion.
7. **Audit các hành động quan trọng**, nhưng không log token, secret, presigned URL hoặc nội dung tài liệu private.
8. **Pagination bắt buộc** trên mọi list API; filter/sort được thực thi trong database.

## 4. Cấu trúc source đề xuất

```text
backend/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/
│   │   ├── app.config.ts
│   │   ├── env.schema.ts
│   │   └── swagger.config.ts
│   ├── common/
│   │   ├── auth/              # JWT guard, principal, decorators
│   │   ├── authorization/     # policy/ownership checks
│   │   ├── database/          # Prisma module/service
│   │   ├── errors/            # domain -> HTTP error mapping
│   │   ├── filters/           # global exception filter
│   │   ├── interceptors/      # response envelope, request ID
│   │   ├── pagination/
│   │   ├── validation/
│   │   └── observability/
│   ├── modules/
│   │   ├── identity/
│   │   ├── users/
│   │   ├── taxonomy/
│   │   ├── businesses/
│   │   ├── funding-opportunities/
│   │   ├── investors/
│   │   ├── discovery/
│   │   ├── saved-items/
│   │   ├── contact-requests/
│   │   ├── uploads/
│   │   ├── content/
│   │   ├── moderation/
│   │   ├── featured-opportunities/
│   │   ├── notifications/
│   │   ├── support/
│   │   └── audit/
│   ├── jobs/
│   │   ├── outbox.processor.ts
│   │   └── orphan-upload-cleanup.job.ts
│   └── health/
├── test/
│   ├── integration/
│   ├── e2e/
│   └── factories/
└── Dockerfile
```

Mỗi domain module dùng cấu trúc nhất quán:

```text
businesses/
├── businesses.module.ts
├── api/              # controller, request/response DTO
├── application/      # use cases, commands, queries
├── domain/           # policy, state transition, domain errors
└── infrastructure/   # Prisma repository, external adapters
```

Controller chỉ parse request và gọi use case. Business rule không đặt trong controller hoặc Prisma repository.

## 5. Module boundaries

| Module | Trách nhiệm chính | Không chịu trách nhiệm |
|---|---|---|
| `identity` | Xác minh Cognito JWT, đồng bộ user lần đầu, tạo principal | Lưu password, quyết định ownership |
| `users` | User profile, status, role assignments, consent | Xác thực password |
| `taxonomy` | Industry, Business Type/Stage, Funding Purpose/Type, categories | Hard-delete taxonomy đang được dùng |
| `businesses` | Business profile, member, verification, financial snapshot | Funding opportunity workflow |
| `funding-opportunities` | Draft, revision, submit/review/publish/close, documents | Featured scheduling |
| `investors` | Investor/Enterprise Partner profile, criteria, verification | Business membership |
| `discovery` | Public search/filter/sort/read models | Trả dữ liệu private |
| `saved-items` | Save/unsave Business và Opportunity | Follow/notification P1 |
| `contact-requests` | Gửi, accept/decline/close, anti-spam | Direct messaging P1 |
| `uploads` | Presign, complete, download authorization, cleanup | Lưu URL có thời hạn |
| `content` | News, Blog, FAQ và legal content | Moderation chung |
| `moderation` | Review queue, reports, verification decisions | Toàn quyền admin mặc định |
| `featured-opportunities` | Banner selection, schedule, active fallback | Publish opportunity |
| `notifications` | In-app/email event delivery | Nghiệp vụ nguồn phát event |
| `support` | Ticket và support messages | User administration |
| `audit` | Append-only audit trail | Chứa secret hoặc raw private document |

Dependency rule chính:

```text
api -> application -> domain
                 `-> repository interface
infrastructure ------^ (implements interface)
```

Domain module không import controller/DTO của module khác. Giao tiếp chéo module qua application service hoặc domain event nội bộ.

## 6. Authentication và authorization

### 6.1 Authentication flow

1. Frontend đăng ký/đăng nhập trực tiếp với Cognito.
2. Frontend gửi `Authorization: Bearer <access_token>` tới API.
3. Backend xác minh chữ ký bằng Cognito JWKS và cache key; kiểm tra `iss`, `client_id`/audience, `token_use=access`, `exp`.
4. Backend dùng claim `sub` để tải `User` theo `cognitoSub`.
5. Lần đầu sau xác minh email, endpoint `POST /api/v1/auth/sync` upsert User theo `sub`; email chỉ được lấy từ claim tin cậy.
6. Backend tải role và status từ PostgreSQL, không tin role do frontend gửi lên.

### 6.2 Principal

```ts
type RequestPrincipal = {
  userId: string;
  cognitoSub: string;
  roles: RoleCode[];
  accountStatus: 'ACTIVE' | 'SUSPENDED' | 'DISABLED';
};
```

### 6.3 Policy checks

Guard toàn cục xử lý authentication; policy service xử lý authorization theo resource:

- `canEditBusiness`: `ADMIN`, hoặc BusinessMember `OWNER|EDITOR` còn active.
- `canManageMembers`: `ADMIN`, hoặc BusinessMember `OWNER`.
- `canSubmitOpportunity`: thành viên `OWNER|EDITOR`, business active, opportunity hợp lệ.
- `canModerateOpportunity`: `MODERATOR|ADMIN`; quyết định được audit.
- `canDownloadDocument`: owner/editor, moderator theo nhiệm vụ, hoặc visibility policy hợp lệ và access grant còn hạn.
- `canContactBusiness`: account active, role phù hợp, không bị block/rate-limit, business và opportunity nhận liên hệ.

Role và ownership phải cùng được kiểm tra; không dùng role đơn lẻ để thay ownership.

## 7. Domain model và aggregate

### 7.1 Aggregate roots

- `Business`: profile, memberships, operational data, verification state.
- `FundingOpportunity`: content, funding terms, revision, review/publish lifecycle, document metadata.
- `InvestorProfile`: criteria, public visibility, verification state.
- `ContactRequest`: sender, target business/opportunity, decision lifecycle.
- `Article`: News/Blog content lifecycle.
- `SupportTicket`: ticket status và message.

Các quan hệ nhiều-nhiều như Industry, Funding Type và role dùng join table, không lưu comma-separated string.

### 7.2 Tiền tệ

- Dùng `Decimal`/PostgreSQL `numeric`, không dùng floating point.
- Lưu `currency` theo ISO 4217 (`VND`, `USD`, ...).
- `fundingAmountMin >= 0`, `fundingAmountMax >= min`.
- API serialize Decimal thành string để không mất độ chính xác.

### 7.3 Slug

- Slug public là unique, dễ đọc, không dùng làm primary key.
- API owner/admin dùng UUID/CUID nội bộ; public detail chấp nhận slug.
- Khi đổi tên, giữ slug cũ trong bảng redirect nếu SEO là yêu cầu chính thức.

## 8. State machines

Không expose endpoint `PATCH status` tổng quát. Mỗi transition là một command endpoint có validation và audit.

### Business

```text
DRAFT -> PENDING_REVIEW -> PUBLISHED
                    |-> CHANGES_REQUESTED -> PENDING_REVIEW
                    `-> REJECTED -> DRAFT
PUBLISHED -> SUSPENDED | ARCHIVED
```

### Funding Opportunity

```text
DRAFT -> PENDING_REVIEW -> PUBLISHED
                    |-> CHANGES_REQUESTED -> DRAFT
                    `-> REJECTED -> DRAFT
PUBLISHED -> CLOSED | FUNDED | ARCHIVED | HIDDEN
```

Khi sửa nội dung nhạy cảm của opportunity đã publish, tạo `FundingOpportunityRevision` ở trạng thái pending; bản published hiện tại vẫn là public read model cho tới khi revision được duyệt.

### Contact Request

```text
PENDING -> ACCEPTED | DECLINED
ACCEPTED -> CLOSED
```

Decision lưu `decidedBy`, `decidedAt`; chỉ member được phép của Business đích mới xử lý.

## 9. API conventions

### 9.1 URL và versioning

- Prefix: `/api/v1`.
- Resource dùng danh từ số nhiều và kebab-case.
- Action có nghiệp vụ rõ ràng dùng sub-resource/command: `/funding-opportunities/:id/submit`, `/reviews/:id/approve`.
- Public detail ưu tiên slug: `/businesses/by-slug/:slug` hoặc thống nhất `/businesses/:slug`; tránh endpoint lúc dùng id lúc dùng slug mà không thể phân biệt.

### 9.2 Response envelope

```json
{
  "success": true,
  "message": "Funding opportunity created successfully",
  "data": {},
  "meta": {
    "requestId": "01J..."
  }
}
```

List response:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 128,
    "totalPages": 7,
    "requestId": "01J..."
  }
}
```

Error response:

```json
{
  "success": false,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "fundingAmountMin",
      "message": "Minimum amount must not exceed maximum amount"
    }
  ],
  "meta": {
    "requestId": "01J..."
  }
}
```

Không trả stack trace ở production. HTTP status phải đúng semantics: `400`, `401`, `403`, `404`, `409`, `422`, `429`, `500`.

### 9.3 Pagination, filter và sort

- MVP dùng `page` + `limit`; default 20, max 100.
- Whitelist filter và sort field, không đưa raw query vào Prisma.
- Sort luôn có tie-breaker ổn định, ví dụ `publishedAt desc, id desc`.
- Search/filter/sort chạy trước pagination.
- `Most Saved/Viewed/Discussed` chỉ bật khi có counter/read model đáng tin cậy.

### 9.4 Idempotency và concurrency

- Nhận `Idempotency-Key` cho contact request, submit/review và upload complete.
- Dùng `updatedAt` hoặc `version` cho optimistic concurrency; stale update trả `409 CONFLICT`.
- Unique constraint ngăn duplicate save: `(userId, businessId)` và `(userId, fundingOpportunityId)`.

## 10. API MVP tối thiểu

### Identity/User

- `POST /auth/sync`
- `GET /users/me`
- `PATCH /users/me`

### Taxonomy

- `GET /taxonomies/industries`
- `GET /taxonomies/business-types`
- `GET /taxonomies/business-stages`
- `GET /taxonomies/funding-purposes`
- `GET /taxonomies/funding-types`

### Businesses

- `GET /businesses`
- `POST /businesses`
- `GET /businesses/:slug`
- `GET /businesses/:id/management-view`
- `PATCH /businesses/:id`
- `POST /businesses/:id/submit`
- `GET|POST|PATCH|DELETE /businesses/:id/members`

### Funding Opportunities

- `GET /funding-opportunities`
- `POST /businesses/:businessId/funding-opportunities`
- `GET /funding-opportunities/:slug`
- `GET /funding-opportunities/:id/management-view`
- `PATCH /funding-opportunities/:id`
- `POST /funding-opportunities/:id/submit`
- `POST /funding-opportunities/:id/close`
- `POST /funding-opportunities/:id/fund`

### Investors

- `GET /investors`
- `POST /investors`
- `GET /investors/:slug`
- `PATCH /investors/:id`
- `POST /investors/:id/publish`

### Interaction

- `PUT /businesses/:id/save`
- `DELETE /businesses/:id/save`
- `GET /users/me/saved-businesses`
- `POST /contact-requests`
- `GET /contact-requests`
- `POST /contact-requests/:id/accept`
- `POST /contact-requests/:id/decline`
- `POST /contact-requests/:id/close`
- `POST /reports`

### Files

- `POST /uploads/presign`
- `POST /uploads/:uploadId/complete`
- `DELETE /uploads/:uploadId`
- `POST /documents/:id/download-url`

### Content/Admin

- `GET /news`, `GET /news/:slug`
- `GET /blogs`, `GET /blogs/:slug`
- CRUD editor `/admin/articles`
- `GET /admin/reviews/funding-opportunities`
- `POST /admin/reviews/funding-opportunities/:id/approve`
- `POST /admin/reviews/funding-opportunities/:id/reject`
- `POST /admin/reviews/funding-opportunities/:id/request-changes`
- CRUD `/admin/taxonomies/*`
- CRUD `/admin/featured-opportunities`

OpenAPI/Swagger phải được sinh từ DTO và chỉ public ở môi trường được phép; production có authentication hoặc bị tắt.

## 11. Data architecture và Prisma

### 11.1 Nhóm bảng MVP P0

- Identity: `User`, `Role`, `UserRole`, `UserConsent`.
- Taxonomy: `Industry`, `BusinessType`, `BusinessStage`, `FundingPurpose`, `FundingType`, `ContentCategory`.
- Business: `Business`, `BusinessMember`, `BusinessIndustry`.
- Funding: `FundingOpportunity`, `FundingOpportunityFundingType`, `FundingOpportunityRevision`, `FundingDocument`.
- Investor: `InvestorProfile`, `InvestorIndustry`, `InvestorFundingType`, `InvestorStage`.
- Interaction: `SavedBusiness`, `ContactRequest`, `Report`.
- Content: `Article`, `ArticleCategory`, `Tag`, `ArticleTag`.
- Operation: `FeaturedFundingOpportunity`, `AuditLog`, `OutboxEvent`, `UploadSession`.

P1 tables như verification, document access, follow, comments, notifications và support có thể thêm bằng migration độc lập nhưng boundary đã được giữ sẵn.

### 11.2 Constraint và index bắt buộc

- Unique: `User.cognitoSub`, normalized `User.email`, slug của Business/Opportunity/Investor/Article.
- Composite unique: role assignment, membership, saved item và các join taxonomy.
- Index public list: `(status, publishedAt desc)`, business type/stage, opportunity purpose, currency/amount range.
- Index review queue: `(status, submittedAt)`.
- Index contact inbox: `(businessId, status, createdAt desc)` và sender history.
- Index featured lookup: `(isActive, startAt, endAt)`.
- Search MVP: PostgreSQL full-text/trigram index cho business name, opportunity title/summary, product/service và location. Không thêm Elasticsearch trong MVP.

Mọi foreign key quan trọng có referential action được chọn rõ ràng. Dữ liệu nghiệp vụ/audit không cascade delete chỉ vì user bị disable.

### 11.3 Transaction boundaries

Dùng Prisma transaction cho:

- Tạo Business và Owner membership.
- Submit opportunity + snapshot/revision + audit + outbox event.
- Approve opportunity + publish fields + audit + notification event.
- Accept contact request + decision metadata + notification event.
- Complete upload + document metadata + upload session state.
- Save/unsave + counter nếu dùng denormalized counter.

## 12. Upload và document security

### 12.1 Upload flow

1. Client gọi `/uploads/presign` với `purpose`, owner resource, filename, MIME và size.
2. Backend xác thực user, ownership, allowlist MIME/extension, size limit và trạng thái resource.
3. Backend tạo `UploadSession` thời hạn ngắn và object key do server quyết định.
4. Client upload trực tiếp lên S3 bằng presigned URL.
5. Client gọi `/uploads/:id/complete`.
6. Backend `HeadObject`, đối chiếu size/content type/checksum rồi lưu metadata.
7. Job dọn object/session không complete sau TTL.

Object key mẫu:

```text
public/businesses/{businessId}/logos/{uuid}.{ext}
private/businesses/{businessId}/opportunities/{opportunityId}/{purpose}/{uuid}.{ext}
private/verifications/{resourceType}/{resourceId}/{uuid}.{ext}
```

Không dùng filename từ client làm object key. Bucket chặn public access; public asset được phân phối có kiểm soát qua CloudFront. Private download URL chỉ sinh sau authorization và có TTL ngắn.

### 12.2 Visibility matrix

| Visibility | Guest | Logged in | Verified investor | Approved grant | Owner/Admin policy |
|---|---:|---:|---:|---:|---:|
| `PUBLIC` | Yes | Yes | Yes | Yes | Yes |
| `AUTHENTICATED` | No | Yes | Yes | Yes | Yes |
| `VERIFIED_INVESTOR` | No | No | Yes | Yes | Yes |
| `APPROVED_ACCESS` | No | No | No | Yes | Yes |
| `PRIVATE` | No | No | No | No | Yes |

Public response mapper phải loại field trước khi serialize; không chỉ ẩn bằng frontend.

## 13. Events, email và background jobs

MVP dùng transactional outbox trong PostgreSQL để tránh mất notification sau khi transaction nghiệp vụ đã commit.

Event tiêu biểu:

- `FundingOpportunitySubmitted`
- `FundingOpportunityApproved`
- `FundingOpportunityChangesRequested`
- `ContactRequestCreated`
- `ContactRequestAccepted`
- `DocumentAccessChanged`
- `ArticlePublished`

Processor đọc `OutboxEvent`, gửi SES/tạo notification rồi đánh dấu processed; retry exponential backoff và có trạng thái dead-letter. Event handler phải idempotent.

Scheduled jobs:

- Dọn upload không hoàn tất.
- Activate/deactivate Featured Opportunity theo thời gian.
- Expire document grants (P1).
- Retry outbox thất bại.

Không đưa Redis/SQS vào MVP khi chưa có tải thực tế; có thể thay outbox processor bằng SQS sau mà không đổi domain event contract.

## 14. Validation và security controls

- Global `ValidationPipe`: whitelist field, reject unknown field, transform type có kiểm soát.
- DTO validation không thay thế domain invariant và database constraint.
- Sanitize rich text bằng allowlist; không render HTML tùy ý.
- Rate limit riêng cho contact, report, search nặng, upload presign và auth sync.
- CORS allowlist theo môi trường; Helmet/security headers; HTTPS only.
- Request body limit và multipart không đi xuyên backend cho file lớn.
- Không phân biệt thông báo nhạy cảm gây user enumeration.
- Admin/moderator endpoint yêu cầu role từ DB và audit.
- Không log authorization header, cookie, presigned URL, message private hoặc document content.
- Secrets lấy từ Secrets Manager; local dev dùng `.env` không commit.

## 15. Observability và vận hành

Mỗi request có `X-Request-Id`; nếu client không gửi thì server tạo. Structured JSON log tối thiểu gồm request ID, route template, method, status, latency, user ID đã pseudonymize và error code.

Health endpoints:

- `/health/live`: process hoạt động, không gọi dependency.
- `/health/ready`: kiểm tra PostgreSQL và cấu hình thiết yếu.

CloudWatch metrics/alerts:

- API 5xx rate, p95 latency, request count và throttling.
- App Runner CPU/memory và instance health.
- RDS CPU, connections, storage, slow query và replication/backup status.
- Outbox backlog/oldest age, failed jobs, email failures.
- S3 4xx/5xx bất thường.

Audit log là append-only ở application level, có actor, action, target type/id, timestamp, request ID, IP/user-agent ở mức policy cho phép và before/after đã redact.

## 16. Testing strategy

- **Unit**: policy, state transition, money validation, visibility và mapping public DTO.
- **Integration**: Prisma repository với PostgreSQL thật qua container/test database; transaction và constraint.
- **API/e2e**: auth guard mock/JWKS test, Business CRUD, submit/review/publish, search/filter/pagination, save, contact và upload completion.
- **Security tests**: IDOR/ownership, role escalation, private field leakage, expired grant, invalid JWT, malicious filename/MIME.
- **Contract tests**: OpenAPI response và frontend-generated client nếu dùng.

Không mock Prisma sâu trong mọi test; domain unit test không cần Prisma, repository test dùng database thật.

## 17. Environments và deployment

### Local

- NestJS container/process.
- PostgreSQL qua Docker Compose.
- Cognito dev pool hoặc JWT test issuer cho automated test.
- S3 dev bucket/LocalStack chỉ khi cần; adapter cho phép fake trong test.

### Staging/Production

- CloudFront + S3 cho frontend.
- WAF -> App Runner cho backend.
- RDS PostgreSQL private network, encryption at rest, automated backup/PITR.
- S3 public-assets/private-documents tách bucket hoặc prefix với IAM policy rõ ràng, versioning cho file quan trọng.
- SES cho transactional email.
- Secrets Manager và least-privilege App Runner role.
- CloudWatch logs/metrics/alarms.

Migration chạy như release step riêng trước khi chuyển traffic. Destructive migration dùng expand/migrate/contract, có backup và kiểm tra staging.

## 18. MVP delivery plan

### Milestone 0 — Foundation

- NestJS bootstrap, config validation, Prisma/PostgreSQL, Swagger.
- Request ID, response/error envelope, logging, health check.
- Cognito JWT guard, User sync, role/policy foundation.

### Milestone 1 — Core marketplace P0

- Taxonomy.
- Business CRUD và owner/editor authorization.
- Funding Opportunity draft multi-step, submit/review/publish.
- S3 upload presign/complete cho logo, images và pitch deck.
- Explore Businesses/search/filter/sort/pagination và detail public DTO.

### Milestone 2 — Connection and profiles P0

- Investor Profile/directory/detail.
- Saved Business.
- Contact Request và notification email.
- Report content.

### Milestone 3 — Content and operation P0

- News/Blogs editor workflow.
- Admin moderation, user management tối thiểu và taxonomy.
- Featured Investment Opportunity schedule/fallback.
- FAQ/legal pages data nếu cần CMS.
- Audit, alert, backup/restore verification và staging hardening.

P1/P2 chỉ bắt đầu sau khi P0 authorization, private file access và moderation tests đạt yêu cầu.

## 19. Quyết định hoãn có chủ đích

- Không microservices, Kafka, GraphQL, Elasticsearch hoặc Kubernetes trong MVP.
- Không DynamoDB cho domain chính.
- Không lưu JWT session/password trong PostgreSQL.
- Không direct messaging, comments, follow, recommendation hoặc advanced analytics trong P0 trừ khi phạm vi MVP thay đổi chính thức.
- Không generic repository/service base class che mất domain rule.
- Không trả Prisma model trực tiếp từ controller; luôn map sang response DTO.

## 20. Definition of Done cho backend

Một backend user story chỉ hoàn thành khi:

- API và OpenAPI contract khớp acceptance criteria.
- Authentication, role, ownership, state và visibility đều được kiểm tra phía server.
- Validation, constraint, index và transaction phù hợp đã có.
- Public DTO không rò rỉ field/object key private.
- Audit/outbox được ghi trong cùng transaction khi cần.
- Unit/integration/e2e và security regression quan trọng pass.
- Lint, typecheck, test, build và Prisma migration check pass.
- Log/metric không chứa secret; request ID truy vết được.
- Migration đã chạy trên staging và có kế hoạch rollback/forward fix.

