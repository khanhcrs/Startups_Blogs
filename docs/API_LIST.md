# Danh sách API (API Endpoints)

Dưới đây là danh sách toàn bộ các API hiện tại của hệ thống, được tạo tự động từ mã nguồn.


### Module: ADMIN
| HTTP Method | API Endpoint | Mục đích (Purpose) | Role yêu cầu |
|---|---|---|---|
| **GET** | `/api/v1/admin/stats` | Get Stats | Admin |
| **POST** | `/api/v1/admin/proposals/business/:id` | Propose Business Change | Admin |
| **POST** | `/api/v1/admin/proposals/article/:id` | Propose Article Change | Admin |

### Module: APP
| HTTP Method | API Endpoint | Mục đích (Purpose) | Role yêu cầu |
|---|---|---|---|
| **GET** | `/api/v1/` | Get Hello | Public |

### Module: ARTICLES
| HTTP Method | API Endpoint | Mục đích (Purpose) | Role yêu cầu |
|---|---|---|---|
| **POST** | `/api/v1/articles` | Tạo mới bản ghi | User/Owner |
| **GET** | `/api/v1/articles/me` | Find My Articles | User/Owner |
| **GET** | `/api/v1/articles` | Lấy danh sách (có phân trang) | Public |
| **GET** | `/api/v1/articles/tags` | Get All Tags | Public |
| **GET** | `/api/v1/articles/admin/all` | Get All Articles | Admin |
| **PUT** | `/api/v1/articles/admin/:id/status` | Update Article Status | Admin |
| **DELETE** | `/api/v1/articles/admin/:id` | Delete Article Admin | Admin |
| **GET** | `/api/v1/articles/:idOrSlug` | Lấy chi tiết một bản ghi | Public |
| **PUT** | `/api/v1/articles/:id` | Cập nhật bản ghi | User/Owner |
| **DELETE** | `/api/v1/articles/:id` | Xóa bản ghi | User/Owner |

### Module: AUTH
| HTTP Method | API Endpoint | Mục đích (Purpose) | Role yêu cầu |
|---|---|---|---|
| **POST** | `/api/v1/auth/register` | Đăng ký tài khoản | User/Owner |
| **POST** | `/api/v1/auth/login` | Đăng nhập hệ thống | User/Owner |

### Module: BOOKMARKS
| HTTP Method | API Endpoint | Mục đích (Purpose) | Role yêu cầu |
|---|---|---|---|
| **POST** | `/api/v1/bookmarks/:articleId` | Tạo mới bản ghi | User/Owner |
| **DELETE** | `/api/v1/bookmarks/:articleId` | Xóa bản ghi | User/Owner |
| **GET** | `/api/v1/bookmarks` | Lấy danh sách (có phân trang) | User/Owner |

### Module: BUSINESSES
| HTTP Method | API Endpoint | Mục đích (Purpose) | Role yêu cầu |
|---|---|---|---|
| **POST** | `/api/v1/businesses` | Tạo mới bản ghi | User/Owner |
| **GET** | `/api/v1/businesses` | Lấy danh sách (có phân trang) | Public |
| **GET** | `/api/v1/businesses/admin/all` | Admin lấy toàn bộ danh sách | Admin |
| **GET** | `/api/v1/businesses/admin/:id` | Admin lấy chi tiết bản ghi nguyên vẹn | Admin |
| **PUT** | `/api/v1/businesses/admin/:id/status` | Cập nhật trạng thái (Duyệt/Từ chối/Khóa) | Admin |
| **GET** | `/api/v1/businesses/:slug` | Lấy chi tiết một bản ghi | Public |
| **PUT** | `/api/v1/businesses/:id` | Cập nhật bản ghi | User/Owner |
| **DELETE** | `/api/v1/businesses/:id` | Xóa bản ghi | User/Owner |

### Module: COMMENTS
| HTTP Method | API Endpoint | Mục đích (Purpose) | Role yêu cầu |
|---|---|---|---|
| **POST** | `/api/v1/articles/:articleId/comments` | Tạo mới bản ghi | User/Owner |
| **GET** | `/api/v1/articles/:articleId/comments` | Lấy danh sách (có phân trang) | Public |
| **DELETE** | `/api/v1/articles/:articleId/comments/admin/:id` | Remove Admin | Admin |
| **PUT** | `/api/v1/articles/:articleId/comments/:id` | Cập nhật bản ghi | User/Owner |
| **DELETE** | `/api/v1/articles/:articleId/comments/:id` | Xóa bản ghi | User/Owner |

### Module: CONTACT-REQUESTS
| HTTP Method | API Endpoint | Mục đích (Purpose) | Role yêu cầu |
|---|---|---|---|
| **POST** | `/api/v1/businesses/:businessId/contact-requests` | Create Contact Request | User/Owner |
| **GET** | `/api/v1/businesses/:businessId/contact-requests` | Get Contact Requests | User/Owner |

### Module: FOLLOWS
| HTTP Method | API Endpoint | Mục đích (Purpose) | Role yêu cầu |
|---|---|---|---|
| **POST** | `/api/v1/follows/:userId` | Tạo mới bản ghi | User/Owner |
| **DELETE** | `/api/v1/follows/:userId` | Xóa bản ghi | User/Owner |
| **GET** | `/api/v1/follows/followers` | Get Followers | User/Owner |
| **GET** | `/api/v1/follows/following` | Get Following | User/Owner |

### Module: FUNDING-OPPORTUNITIES
| HTTP Method | API Endpoint | Mục đích (Purpose) | Role yêu cầu |
|---|---|---|---|
| **POST** | `/api/v1/businesses/:businessId/funding-opportunities` | Tạo mới bản ghi | User/Owner |
| **GET** | `/api/v1/businesses/:businessId/funding-opportunities` | Lấy danh sách (có phân trang) | Public |
| **PUT** | `/api/v1/businesses/:businessId/funding-opportunities/:id` | Cập nhật bản ghi | User/Owner |
| **DELETE** | `/api/v1/businesses/:businessId/funding-opportunities/:id` | Xóa bản ghi | User/Owner |

### Module: FUNDING-ROUNDS
| HTTP Method | API Endpoint | Mục đích (Purpose) | Role yêu cầu |
|---|---|---|---|
| **POST** | `/api/v1/businesses/:businessId/funding-rounds` | Tạo mới bản ghi | User/Owner |
| **GET** | `/api/v1/businesses/:businessId/funding-rounds` | Lấy danh sách (có phân trang) | Public |
| **PUT** | `/api/v1/businesses/:businessId/funding-rounds/:id` | Cập nhật bản ghi | User/Owner |
| **DELETE** | `/api/v1/businesses/:businessId/funding-rounds/:id` | Xóa bản ghi | User/Owner |

### Module: NOTIFICATIONS
| HTTP Method | API Endpoint | Mục đích (Purpose) | Role yêu cầu |
|---|---|---|---|
| **GET** | `/api/v1/notifications` | Get My Notifications | User/Owner |
| **PUT** | `/api/v1/notifications/read-all` | Đánh dấu tất cả là đã đọc | User/Owner |
| **PUT** | `/api/v1/notifications/:id/read` | Đánh dấu 1 thông báo là đã đọc | User/Owner |

### Module: PROPOSALS
| HTTP Method | API Endpoint | Mục đích (Purpose) | Role yêu cầu |
|---|---|---|---|
| **GET** | `/api/v1/proposals/me` | Lấy danh sách đề xuất của tôi | User/Owner |
| **GET** | `/api/v1/proposals/:id` | Lấy chi tiết đề xuất | User/Owner |
| **POST** | `/api/v1/proposals/:id/approve` | Phê duyệt đề xuất thay đổi | User/Owner |
| **POST** | `/api/v1/proposals/:id/reject` | Từ chối đề xuất thay đổi | User/Owner |

### Module: TEAM-MEMBERS
| HTTP Method | API Endpoint | Mục đích (Purpose) | Role yêu cầu |
|---|---|---|---|
| **POST** | `/api/v1/businesses/:businessId/team-members` | Tạo mới bản ghi | User/Owner |
| **GET** | `/api/v1/businesses/:businessId/team-members` | Lấy danh sách (có phân trang) | Public |
| **PUT** | `/api/v1/businesses/:businessId/team-members/:id` | Cập nhật bản ghi | User/Owner |
| **DELETE** | `/api/v1/businesses/:businessId/team-members/:id` | Xóa bản ghi | User/Owner |

### Module: UPLOAD
| HTTP Method | API Endpoint | Mục đích (Purpose) | Role yêu cầu |
|---|---|---|---|

### Module: USERS
| HTTP Method | API Endpoint | Mục đích (Purpose) | Role yêu cầu |
|---|---|---|---|
| **GET** | `/api/v1/users/admin/all` | Get All Users | Admin |
| **PUT** | `/api/v1/users/admin/:id/role` | Update User Role | Admin |
| **GET** | `/api/v1/users/me` | Lấy thông tin cá nhân (Profile) | User/Owner |
| **GET** | `/api/v1/users/:id` | Get Public Profile | Public |
| **PUT** | `/api/v1/users/me` | Cập nhật thông tin cá nhân | User/Owner |