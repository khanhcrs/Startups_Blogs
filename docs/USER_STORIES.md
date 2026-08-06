Định vị sản phẩm: Nền tảng kết nối doanh nghiệp nhỏ, doanh nghiệp vừa và startup đang tìm kiếm vốn hoặc đối tác phát triển với nhà đầu tư, quỹ đầu tư và doanh nghiệp đối tác.Trong tài liệu này, Business là thực thể trung tâm. Startup chỉ là một loại hình doanh nghiệp (Business Type: Startup). Mỗi doanh nghiệp có thể tạo một hoặc nhiều Funding Opportunity để kêu gọi vốn hoặc tìm kiếm hình thức hợp tác phù hợp.

> The official product name is Startups Blogs.
> Business is the central domain entity.
> Startup is one valid Business Type.

1. Phạm vi và vai trò người dùng

1.1. Các vai trò chính

Vai trò

Mô tả

Guest

Người chưa đăng nhập.

Business Owner

Chủ doanh nghiệp hoặc thành viên được ủy quyền quản lý doanh nghiệp nhỏ, doanh nghiệp vừa hoặc startup.

User



User

Doanh nghiệp lớn tìm kiếm cơ hội đầu tư, hợp tác, mua giải pháp, liên doanh hoặc M&A.

Content Editor

Người quản lý News, Blogs và nội dung kiến thức.

Support Agent

Người xử lý yêu cầu hỗ trợ của người dùng.

Moderator

Người kiểm duyệt hồ sơ, cơ hội gọi vốn, bình luận và báo cáo vi phạm.

Admin

Người quản trị toàn bộ hệ thống, cấu hình danh mục và phân quyền.

Một tài khoản có thể mang nhiều vai trò. Ví dụ: một Business Owner đồng thời có thể tạo User Profile nếu được hệ thống cho phép.

1.2. Loại hình doanh nghiệp

Small Business

Startup

Family Business

Online Business

Franchise

Cooperative

Social User

Other — do Admin quản lý

1.3. Quy ước độ ưu tiên

Mức

Ý nghĩa

P0

Bắt buộc phải có trong MVP.

P1

Nên có sau khi hoàn thiện các chức năng cốt lõi.

P2

Có thể phát triển trong giai đoạn mở rộng.

2. Epic: Home Page

US-HOME-01 — Xem trang chủ

Là khách truy cập, tôi muốn xem trang chủ và hiểu rõ mục đích của Startups Blogs để biết nền tảng phù hợp với doanh nghiệp cần vốn hay nhà đầu tư.

Acceptance Criteria

Hiển thị Hero Section với thông điệp kết nối doanh nghiệp cần vốn và nhà đầu tư.

Có nút Explore Businesses.

Có nút Raise Capital.

Có thanh tìm kiếm doanh nghiệp, cơ hội đầu tư, ngành nghề hoặc địa điểm.

Có nội dung hướng dẫn ngắn cho Business Owner và User.

Hiển thị tốt trên desktop, tablet và mobile.

Priority: P0

US-HOME-02 — Tìm kiếm từ trang chủ

Là người dùng, tôi muốn tìm doanh nghiệp hoặc cơ hội đầu tư ngay trên Home để nhanh chóng đến đúng nội dung quan tâm.

Acceptance Criteria

Tìm theo tên doanh nghiệp.

Tìm theo tên Funding Opportunity.

Tìm theo ngành nghề, sản phẩm/dịch vụ hoặc địa điểm.

Khi nhấn Search hoặc Enter, chuyển đến /businesses và giữ nguyên từ khóa trong URL.

Kết quả tìm kiếm kết hợp được với bộ lọc tại trang Explore Businesses.

Priority: P0

US-HOME-03 — Featured Investment Opportunity Banner

Là khách truy cập, tôi muốn xem một cơ hội đầu tư nổi bật để nhanh chóng khám phá doanh nghiệp tiềm năng.

Acceptance Criteria

Banner hiển thị logo, tên doanh nghiệp và tiêu đề cơ hội gọi vốn.

Hiển thị ngành nghề, loại hình doanh nghiệp, giai đoạn hoạt động, địa điểm và khoảng vốn cần gọi.

Hiển thị mô tả ngắn và mục đích sử dụng vốn.

Có nút View Opportunity và Contact Business.

Chỉ hiển thị cơ hội đã được duyệt và đang ở trạng thái Published.

Admin có thể chọn banner, cấu hình ngày bắt đầu/kết thúc và xem trước.

Nếu không có banner đang hoạt động, hệ thống hiển thị cơ hội mới nhất phù hợp hoặc ẩn section.

Priority: P0

US-HOME-04 — Latest Businesses Seeking Investment

Là nhà đầu tư, tôi muốn xem các doanh nghiệp mới đăng cơ hội gọi vốn để khám phá các cơ hội mới.

Acceptance Criteria

Hiển thị từ 4 đến 8 doanh nghiệp hoặc Funding Opportunity mới nhất.

Mỗi card có logo, tên doanh nghiệp, ngành, loại hình, địa điểm, số vốn cần gọi và mục đích gọi vốn.

Nhấn card mở trang chi tiết cơ hội hoặc hồ sơ doanh nghiệp theo cấu hình.

Có nút View All Businesses.

Priority: P0

US-HOME-05 — Browse by Industry

Là người dùng, tôi muốn duyệt doanh nghiệp theo ngành nghề để tìm đúng nhóm cơ hội quan tâm.

Acceptance Criteria

Hiển thị các ngành phổ biến như Food & Beverage, Retail, Manufacturing, Agriculture, Technology, Education, Healthcare, Logistics, Hospitality và Services.

Danh mục lấy từ dữ liệu do Admin quản lý.

Nhấn vào một ngành sẽ chuyển đến /businesses?industry=....

Không hiển thị danh mục đã bị vô hiệu hóa.

Priority: P0

US-HOME-06 — How It Works

Là người dùng mới, tôi muốn xem cách Startups Blogs hoạt động để biết các bước cần thực hiện.

Acceptance Criteria

Phần For Businesses gồm: tạo hồ sơ, đăng Funding Opportunity, kết nối nhà đầu tư.

Phần For Users gồm: khám phá, đánh giá/lưu, gửi yêu cầu liên hệ.

Có CTA phù hợp với từng nhóm người dùng.

Nội dung không ngụ ý Startups Blogs trực tiếp bảo đảm hoặc thực hiện giao dịch đầu tư.

Priority: P1

US-HOME-07 — Featured Users

Là Business Owner, tôi muốn xem các nhà đầu tư tiêu biểu để biết những nhà đầu tư nào đang tham gia nền tảng.

Acceptance Criteria

Hiển thị tên, logo/ảnh đại diện, loại investor, lĩnh vực quan tâm, khu vực và khoảng vốn đầu tư.

Chỉ hiển thị hồ sơ đang hoạt động và được phép công khai.

Nhấn card mở User Profile.

Có nút View All Users.

Priority: P1

US-HOME-08 — Latest News and Blogs

Là người dùng, tôi muốn xem nội dung mới nhất về doanh nghiệp và đầu tư để cập nhật kiến thức và thị trường.

Acceptance Criteria

Hiển thị một số News mới nhất và Blog nổi bật hoặc mới nhất.

Card có ảnh, tiêu đề, chuyên mục, ngày đăng và thời gian đọc.

Có liên kết xem toàn bộ News và Blogs.

Không để khu vực nội dung lấn át mục tiêu chính là khám phá doanh nghiệp và gọi vốn.

Priority: P1

3. Epic: Đăng ký, đăng nhập và tài khoản

US-AUTH-01 — Đăng ký tài khoản

Là người dùng mới, tôi muốn đăng ký tài khoản để sử dụng các chức năng cá nhân hóa.

Acceptance Criteria

Người dùng nhập họ tên, email và mật khẩu.

Người dùng chọn mục đích ban đầu: Business Owner, User hoặc User.

Email không được trùng với tài khoản đã tồn tại.

Mật khẩu phải đáp ứng chính sách bảo mật của Amazon Cognito.

Người dùng phải đồng ý Terms of Service và Privacy Policy.

Hệ thống hiển thị lỗi rõ ràng, không làm lộ việc một tài khoản nhạy cảm có tồn tại hay không ngoài phạm vi cần thiết.

Priority: P0

US-AUTH-02 — Xác minh email

Là người dùng mới, tôi muốn xác minh email để kích hoạt tài khoản an toàn.

Acceptance Criteria

Amazon Cognito gửi mã hoặc liên kết xác minh.

Mã/liên kết có thời hạn.

Người dùng có thể yêu cầu gửi lại theo giới hạn chống spam.

Sau khi xác minh, tài khoản được kích hoạt và hệ thống tạo hoặc đồng bộ User record trong PostgreSQL.

Priority: P0

US-AUTH-03 — Đăng nhập

Là người dùng đã đăng ký, tôi muốn đăng nhập để truy cập hồ sơ và chức năng riêng tư.

Acceptance Criteria

Đăng nhập bằng email và mật khẩu thông qua Amazon Cognito (Note: Giai đoạn MVP hiện tại dùng Local JWT + bcrypt).

Thông báo lỗi an toàn khi đăng nhập thất bại.

Hỗ trợ duy trì phiên đăng nhập theo cấu hình ứng dụng.

Sau đăng nhập, người dùng được chuyển về trang trước đó hoặc Dashboard phù hợp.

Backend xác thực JWT và tải quyền ứng dụng từ PostgreSQL.

Priority: P0

US-AUTH-04 — Đăng xuất

Là người dùng, tôi muốn đăng xuất để bảo vệ tài khoản khi không sử dụng.

Acceptance Criteria

Token phiên được xóa hoặc thu hồi theo cơ chế Cognito đang dùng.

Người dùng được chuyển về Home hoặc trang công khai.

Các route riêng tư không còn truy cập được bằng phiên cũ.

Priority: P0

US-AUTH-05 — Quên và đặt lại mật khẩu

Là người dùng, tôi muốn đặt lại mật khẩu khi quên để khôi phục quyền truy cập.

Acceptance Criteria

Người dùng nhập email.

Cognito gửi mã hoặc liên kết đặt lại mật khẩu.

Mã/liên kết có thời hạn và giới hạn số lần yêu cầu.

Mật khẩu mới phải đạt chính sách bảo mật.

Sau khi đặt lại thành công, người dùng có thể đăng nhập.

Priority: P0

US-AUTH-06 — Phân quyền

Là Admin, tôi muốn kiểm soát quyền truy cập theo vai trò và quyền sở hữu để bảo vệ dữ liệu và chức năng.

Acceptance Criteria

Guest chỉ xem nội dung công khai.

Business Owner chỉ quản lý doanh nghiệp mà họ sở hữu hoặc được cấp quyền.

User có thể lưu, theo dõi, yêu cầu liên hệ và yêu cầu quyền xem tài liệu theo chính sách.

Content Editor quản lý News và Blogs.

Support Agent chỉ truy cập ticket được phân công hoặc theo quyền.

Moderator kiểm duyệt nội dung nhưng không mặc nhiên có toàn quyền Admin.

Admin có quyền quản trị theo policy.

Backend luôn kiểm tra authorization; không tin vào role gửi từ frontend.

Priority: P0

US-AUTH-07 — Vô hiệu hóa tài khoản

Là người dùng, tôi muốn vô hiệu hóa tài khoản để ngừng sử dụng nền tảng.

Acceptance Criteria

Người dùng phải xác nhận lại hành động.

Hệ thống giải thích ảnh hưởng đến Business Profile, Funding Opportunity và tin nhắn.

Tài khoản chuyển sang trạng thái Disabled hoặc Pending Deletion theo chính sách.

Admin có thể xem lịch sử trạng thái và hỗ trợ khôi phục khi hợp lệ.

Priority: P1

4. Epic: Business Profile

US-BUSINESS-01 — Tạo hồ sơ doanh nghiệp

Là Business Owner, tôi muốn tạo Business Profile để giới thiệu doanh nghiệp với nhà đầu tư.

Acceptance Criteria

Nhập tên thương mại và tên pháp lý nếu có.

Chọn Business Type và Industry.

Nhập mô tả ngắn, mô tả chi tiết, năm thành lập, địa điểm, website và thông tin liên hệ.

Nhập sản phẩm/dịch vụ chính, thị trường phục vụ, quy mô nhân sự và khu vực hoạt động.

Upload logo và cover image qua S3 Presigned URL.

Có thể lưu Draft trước khi công khai.

Một người dùng có thể quản lý nhiều doanh nghiệp nếu được phép.

Priority: P0

US-BUSINESS-02 — Chỉnh sửa hồ sơ doanh nghiệp

Là Business Owner, tôi muốn cập nhật Business Profile để đảm bảo thông tin luôn chính xác.

Acceptance Criteria

Chỉ owner hoặc thành viên có quyền Editor mới được chỉnh sửa.

Dữ liệu được validate ở frontend và backend.

Có thông báo lưu thành công hoặc lỗi rõ ràng.

Thay đổi nhạy cảm như tên pháp lý hoặc giấy tờ xác minh có thể yêu cầu kiểm duyệt lại.

Hệ thống lưu updatedAt và người thực hiện thay đổi.

Priority: P0

US-BUSINESS-03 — Quản lý thành viên doanh nghiệp

Là Business Owner, tôi muốn mời và phân quyền thành viên để cùng quản lý hồ sơ doanh nghiệp.

Acceptance Criteria

Mời thành viên bằng email.

Các quyền tối thiểu gồm Owner, Editor và Viewer.

Owner có thể thay đổi hoặc thu hồi quyền.

Không được xóa Owner cuối cùng nếu chưa chuyển quyền sở hữu.

Thành viên có thể thêm tên, chức vụ, ảnh và phần giới thiệu đội ngũ công khai.

Priority: P1

US-BUSINESS-04 — Xem trước và công khai hồ sơ

Là Business Owner, tôi muốn xem trước Business Profile để kiểm tra trước khi công khai.

Acceptance Criteria

Preview hiển thị gần giống trang public.

Các trường thiếu hoặc chưa hợp lệ được đánh dấu.

Có thể quay lại chỉnh sửa.

Có nút Publish hoặc Submit for Review tùy chính sách kiểm duyệt.

Draft không xuất hiện trong Explore Businesses.

Priority: P1

US-BUSINESS-05 — Xác minh doanh nghiệp

Là Business Owner, tôi muốn gửi yêu cầu xác minh để tăng độ tin cậy với nhà đầu tư.

Acceptance Criteria

Có thể tải giấy đăng ký kinh doanh hoặc tài liệu phù hợp qua S3 private bucket.

Yêu cầu có trạng thái Not Submitted, Pending, Approved hoặc Rejected.

Moderator/Admin có thể duyệt, từ chối hoặc yêu cầu bổ sung.

Doanh nghiệp được duyệt có Verified Badge.

Tài liệu xác minh không hiển thị công khai và chỉ người có quyền mới truy cập.

Priority: P1

US-BUSINESS-06 — Khai báo thông tin hoạt động

Là Business Owner, tôi muốn cung cấp thông tin vận hành để giúp nhà đầu tư hiểu mức độ trưởng thành của doanh nghiệp.

Acceptance Criteria

Nhập số năm hoạt động, quy mô nhân sự, số địa điểm/cửa hàng và khu vực phục vụ.

Nhập mô hình kinh doanh và nguồn doanh thu chính.

Có thể nhập các chỉ số như số khách hàng, đơn hàng hoặc công suất nếu phù hợp.

Có thể đánh dấu từng trường là Public, Logged-in Users Only hoặc Private theo policy.

Priority: P1

US-BUSINESS-07 — Quản lý thông tin tài chính tổng quan

Là Business Owner, tôi muốn khai báo financial highlights để cung cấp dữ liệu đánh giá ban đầu cho nhà đầu tư.

Acceptance Criteria

Có thể nhập khoảng doanh thu năm, tăng trưởng, lợi nhuận/lỗ và kỳ dữ liệu.

Không bắt buộc công khai giá trị chính xác trong MVP; có thể dùng khoảng.

Mỗi trường có mức visibility phù hợp.

Hệ thống ghi rõ dữ liệu do doanh nghiệp tự khai báo hay đã được xác minh.

Không hiển thị tài liệu gốc nếu chưa được cấp quyền.

Priority: P1

US-BUSINESS-08 — Xem thống kê hồ sơ

Là Business Owner, tôi muốn xem mức độ quan tâm đến doanh nghiệp để đánh giá hiệu quả hồ sơ.

Acceptance Criteria

Xem lượt xem Business Profile.

Xem lượt lưu và theo dõi.

Xem số Contact Request và Document Access Request.

Xem Funding Opportunity được quan tâm nhiều nhất.

Không hiển thị danh tính chi tiết của người xem nếu chưa có cơ sở và quyền phù hợp.

Priority: P2

5. Epic: Raise Capital và Funding Opportunity

US-FUNDING-01 — Tạo bản nháp Funding Opportunity

Là Business Owner, tôi muốn tạo bản nháp một cơ hội gọi vốn để hoàn thiện dần trước khi công khai.

Acceptance Criteria

Một Business có thể có nhiều Funding Opportunity.

Mỗi opportunity thuộc đúng một Business.

Có Save Draft và có thể tiếp tục sau.

Draft không hiển thị công khai.

Chỉ thành viên có quyền mới được tạo hoặc sửa.

Priority: P0

US-FUNDING-02 — Nhập thông tin cơ bản

Là Business Owner, tôi muốn mô tả tổng quan Funding Opportunity để nhà đầu tư hiểu cơ hội đang được đề xuất.

Acceptance Criteria

Nhập tiêu đề, mô tả ngắn và mô tả chi tiết.

Chọn Industry, Business Stage và Funding Purpose.

Chọn địa điểm/khu vực áp dụng.

Liên kết opportunity với Business Profile.

Có thể nhập thời hạn gọi vốn dự kiến.

Priority: P0

US-FUNDING-03 — Trình bày nhu cầu và kế hoạch phát triển

Là Business Owner, tôi muốn mô tả lý do cần vốn và kế hoạch phát triển để thuyết phục nhà đầu tư về tính hợp lý của cơ hội.

Acceptance Criteria

Mô tả bối cảnh kinh doanh hiện tại.

Mô tả vấn đề hoặc cơ hội tăng trưởng.

Mô tả kế hoạch sử dụng vốn và kết quả kỳ vọng.

Mô tả lợi thế cạnh tranh và rủi ro chính.

Nội dung phải rõ ràng, không được dùng thông tin gian dối theo Terms.

Priority: P0

US-FUNDING-04 — Cung cấp thông tin thị trường và khách hàng

Là Business Owner, tôi muốn mô tả thị trường và khách hàng để giúp nhà đầu tư đánh giá tiềm năng.

Acceptance Criteria

Nhập khách hàng mục tiêu.

Nhập khu vực thị trường, quy mô hoặc ước tính thị trường nếu có.

Nhập đối thủ cạnh tranh và điểm khác biệt.

Nhập chiến lược tăng trưởng hoặc mở rộng.

Cho phép đánh dấu nguồn dữ liệu hoặc tài liệu tham khảo.

Priority: P1

US-FUNDING-05 — Cung cấp financial highlights

Là Business Owner, tôi muốn cung cấp thông tin tài chính liên quan cơ hội gọi vốn để nhà đầu tư có cơ sở đánh giá ban đầu.

Acceptance Criteria

Có thể nhập doanh thu, tăng trưởng, lợi nhuận/lỗ, dòng tiền hoặc các chỉ số phù hợp theo kỳ.

Cho phép dùng khoảng giá trị trong MVP.

Cho phép phân loại Public Summary và Confidential Details.

Hệ thống hiển thị kỳ dữ liệu và đơn vị tiền tệ.

Không được đặt presigned URL hết hạn vào database; chỉ lưu object key và metadata.

Priority: P1

US-FUNDING-06 — Khai báo số vốn và mục đích sử dụng vốn

Là Business Owner, tôi muốn khai báo nhu cầu vốn để nhà đầu tư biết doanh nghiệp đang tìm kiếm điều gì.

Acceptance Criteria

Nhập fundingAmountMin và fundingAmountMax hoặc một số tiền mục tiêu.

Chọn currency.

Chọn Funding Purpose như Working Capital, Expansion, Equipment, New Location, Product Development, Marketing, Digital Transformation hoặc Export.

Mô tả phân bổ Use of Funds.

Nhập funding timeline dự kiến.

Hệ thống validate số tiền và không cho giá trị âm hoặc min lớn hơn max.

Priority: P0

US-FUNDING-07 — Chọn hình thức đầu tư hoặc hợp tác

Là Business Owner, tôi muốn chọn hình thức tài trợ mong muốn để tiếp cận đúng nhóm nhà đầu tư.

Acceptance Criteria

Hỗ trợ danh mục như Equity Investment, Business Loan, Revenue Sharing, Strategic Partnership, Joint Venture, Convertible Investment hoặc Asset Financing theo cấu hình Admin.

Cho phép chọn một hoặc nhiều hình thức nếu policy cho phép.

Có trường mô tả điều kiện hoặc kỳ vọng hợp tác.

Startups Blogs hiển thị disclaimer rằng các bên tự thẩm định và thương lượng trực tiếp.

Priority: P0

US-FUNDING-08 — Upload ảnh và tài liệu

Là Business Owner, tôi muốn tải tài liệu hỗ trợ để trình bày cơ hội rõ ràng hơn.

Acceptance Criteria

Có thể upload ảnh sản phẩm, brochure, pitch deck PDF và tài liệu tài chính theo quyền.

React xin S3 Presigned URL từ backend và upload trực tiếp lên S3.

Backend kiểm tra purpose, MIME type, kích thước, quyền sở hữu và object key.

Tài liệu confidential nằm trong private bucket hoặc private prefix.

Có thể xóa, thay thế và xem trạng thái upload.

File không hoàn tất phải được dọn dẹp theo quy trình định kỳ.

Priority: P0

US-FUNDING-09 — Thiết lập quyền xem thông tin

Là Business Owner, tôi muốn thiết lập visibility cho thông tin và tài liệu để bảo vệ dữ liệu nhạy cảm.

Acceptance Criteria

Các mức tối thiểu: Public, Logged-in Users, Logged-in Users, Approved Access và Private.

Quyền xem được thực thi ở backend.

Frontend không được nhận URL hoặc dữ liệu private khi chưa đủ quyền.

Thay đổi visibility được ghi audit log đối với tài liệu nhạy cảm.

Priority: P1

US-FUNDING-10 — Xem trước Funding Opportunity

Là Business Owner, tôi muốn xem trước cơ hội gọi vốn để kiểm tra trước khi gửi duyệt.

Acceptance Criteria

Preview hiển thị giống trang chi tiết công khai theo mức quyền của owner.

Các trường bắt buộc còn thiếu được đánh dấu.

Không thể submit nếu dữ liệu không hợp lệ.

Có thể quay lại từng bước form mà không mất dữ liệu đã lưu.

Priority: P0

US-FUNDING-11 — Gửi kiểm duyệt

Là Business Owner, tôi muốn gửi Funding Opportunity để kiểm duyệt để được xuất bản trên nền tảng.

Acceptance Criteria

Trạng thái chuyển từ Draft sang Pending Review.

Moderator nhận thông báo.

Moderator có thể Approve, Reject hoặc Request Changes.

Owner nhận thông báo và lý do khi bị từ chối/yêu cầu sửa.

Chỉ opportunity Approved mới có thể Published.

Priority: P0

US-FUNDING-12 — Chỉnh sửa Funding Opportunity đã xuất bản

Là Business Owner, tôi muốn cập nhật opportunity đang công khai để phản ánh đúng tình trạng kinh doanh.

Acceptance Criteria

Các thay đổi nhỏ có thể cập nhật theo policy.

Thay đổi nhạy cảm như số vốn, điều khoản, tài chính hoặc tài liệu có thể phải kiểm duyệt lại.

Nội dung cũ có thể tiếp tục hiển thị trong lúc bản sửa chờ duyệt.

Có lịch sử revision và người thực hiện.

Priority: P1

US-FUNDING-13 — Đóng hoặc lưu trữ đợt gọi vốn

Là Business Owner, tôi muốn đóng Funding Opportunity để ngừng nhận liên hệ cho cơ hội không còn hoạt động.

Acceptance Criteria

Owner có thể chọn Closed, Funded hoặc Archived theo trạng thái được hỗ trợ.

Có hộp thoại xác nhận.

Opportunity không còn xuất hiện trong kết quả active mặc định.

Trang chi tiết hiển thị trạng thái rõ ràng nếu vẫn được phép truy cập.

Dữ liệu lịch sử vẫn tồn tại trong Dashboard.

Priority: P1

6. Epic: Explore Businesses

US-EXPLORE-01 — Xem danh sách doanh nghiệp

Là người dùng, tôi muốn xem doanh nghiệp và cơ hội đang tìm vốn để khám phá cơ hội đầu tư hoặc hợp tác.

Acceptance Criteria

Hiển thị Business Card hoặc Opportunity Card theo thiết kế được duyệt.

Card tối thiểu có logo, tên doanh nghiệp, Industry, Business Type, Business Stage, địa điểm, funding amount và Funding Purpose.

Có Verified Badge nếu được duyệt.

Có CTA View Opportunity hoặc View Business.

Không hiển thị dữ liệu confidential trên card.

Priority: P0

US-EXPLORE-02 — Tìm kiếm doanh nghiệp

Là người dùng, tôi muốn tìm doanh nghiệp bằng từ khóa để nhanh chóng tìm đúng cơ hội.

Acceptance Criteria

Tìm theo tên doanh nghiệp, tiêu đề opportunity, mô tả, ngành, sản phẩm/dịch vụ và địa điểm.

Không phân biệt chữ hoa/chữ thường.

Có debounce khi gọi REST API.

Có trạng thái không tìm thấy kết quả.

Từ khóa được đồng bộ với URL query parameter.

Priority: P0

US-EXPLORE-03 — Lọc doanh nghiệp

Là User, tôi muốn lọc kết quả theo tiêu chí để tìm cơ hội phù hợp với chiến lược đầu tư.

Acceptance Criteria

Lọc theo Industry.

Lọc theo Business Type.

Lọc theo Business Stage.

Lọc theo Funding Purpose và Funding Type.

Lọc theo Funding Amount range.

Lọc theo Location, Years in Operation, Verified Status và Time Posted.

Các filter kết hợp theo AND logic.

Filter được đồng bộ URL và giữ khi refresh/back/forward.

Priority: P0

US-EXPLORE-04 — Sắp xếp kết quả

Là người dùng, tôi muốn sắp xếp doanh nghiệp để xem kết quả theo thứ tự phù hợp.

Acceptance Criteria

Hỗ trợ Newest, Oldest, Most Saved, Most Viewed hoặc Most Discussed khi dữ liệu tồn tại.

Có thể hỗ trợ Funding Amount Low-to-High/High-to-Low nếu phù hợp.

Sort được thực hiện sau filter và trước pagination.

Sort được đồng bộ URL.

Priority: P1

US-EXPLORE-05 — Phân trang

Là người dùng, tôi muốn xem nhiều kết quả mà trang vẫn tải nhanh để duyệt dữ liệu hiệu quả.

Acceptance Criteria

REST API hỗ trợ page, limit, total và totalPages.

Không tải toàn bộ database rồi lọc trong trình duyệt.

Giữ nguyên search/filter/sort khi chuyển trang.

Reset về page 1 khi điều kiện tìm kiếm thay đổi.

Có loading skeleton, empty state và error state.

Priority: P0

US-EXPLORE-06 — Xem Business Profile và Funding Opportunity Detail

Là User, tôi muốn xem thông tin chi tiết để đánh giá cơ hội trước khi liên hệ.

Acceptance Criteria

Business Profile hiển thị tổng quan, hoạt động, sản phẩm/dịch vụ, đội ngũ, verification và các opportunity đang public.

Opportunity Detail hiển thị nhu cầu vốn, mục đích, use of funds, thị trường, financial highlights public và tài liệu được phép xem.

Có Save, Follow, Contact và Request Access phù hợp.

Thông tin private không được trả về khi chưa đủ quyền.

Trang hiển thị disclaimer về trách nhiệm thẩm định của các bên.

Priority: P0

US-EXPLORE-07 — Xem cơ hội liên quan

Là người dùng, tôi muốn xem các Funding Opportunity tương tự để có thêm lựa chọn.

Acceptance Criteria

Ưu tiên cùng Industry, Funding Purpose, Location hoặc Funding Amount range.

Không lặp opportunity hiện tại.

Không hiển thị opportunity Draft, Rejected, Closed hoặc Hidden trong kết quả active.

Nhấn card mở trang chi tiết tương ứng.

Priority: P1

US-EXPLORE-08 — Chia sẻ doanh nghiệp hoặc cơ hội

Là người dùng, tôi muốn chia sẻ nội dung để gửi cơ hội cho người khác.

Acceptance Criteria

Có thể copy link.

URL dùng slug dễ đọc và định danh ổn định.

Open Graph metadata có tiêu đề, mô tả và ảnh phù hợp.

Không đưa dữ liệu confidential vào metadata hoặc preview mạng xã hội.

Priority: P1

7. Epic: Tương tác, quyền xem và kết nối

US-INTERACT-01 — Lưu doanh nghiệp

Là User, tôi muốn lưu Business Profile để xem lại sau.

Acceptance Criteria

Chỉ người đăng nhập mới lưu được.

Nhấn lại để bỏ lưu.

Doanh nghiệp đã lưu xuất hiện trong Dashboard.

Save count cập nhật theo cơ chế nhất quán.

Priority: P0

US-INTERACT-02 — Lưu Funding Opportunity

Là User, tôi muốn lưu một cơ hội gọi vốn cụ thể để theo dõi đúng đợt gọi vốn quan tâm.

Acceptance Criteria

Saved Opportunity tách biệt với Saved Business.

Opportunity đã lưu xuất hiện trong Dashboard.

Không mất bản ghi lưu nếu opportunity tạm đóng; UI hiển thị trạng thái hiện tại.

Có thể bỏ lưu.

Priority: P1

US-INTERACT-03 — Theo dõi doanh nghiệp

Là người dùng, tôi muốn Follow Business để nhận cập nhật mới.

Acceptance Criteria

Có Follow/Unfollow.

Follower nhận thông báo khi có Funding Opportunity mới hoặc cập nhật quan trọng theo cài đặt.

Business không được xem dữ liệu riêng tư ngoài thông tin follower được phép công khai.

Priority: P1

US-INTERACT-04 — Bình luận trên Funding Opportunity

Là người dùng đã đăng nhập, tôi muốn bình luận hoặc đặt câu hỏi để trao đổi công khai với doanh nghiệp.

Acceptance Criteria

Có thể tạo, sửa và xóa bình luận của mình.

Business Owner có thể trả lời.

Có giới hạn spam và moderation.

Không cho đăng dữ liệu nhạy cảm hoặc nội dung vi phạm.

Admin/Moderator có thể ẩn nội dung theo policy.

Priority: P1

US-INTERACT-05 — Báo cáo nội dung

Là người dùng, tôi muốn báo cáo nội dung hoặc tài khoản vi phạm để giúp cộng đồng an toàn.

Acceptance Criteria

Có thể báo cáo Business, Funding Opportunity, User Profile, Comment, Message và User.

Người dùng chọn lý do và có thể thêm mô tả.

Một người dùng không thể spam cùng một report không giới hạn.

Report có trạng thái và lịch sử xử lý.

Priority: P0

US-CONTACT-01 — Gửi Contact Request

Là User hoặc User, tôi muốn gửi yêu cầu liên hệ tới doanh nghiệp để thảo luận về đầu tư hoặc hợp tác.

Acceptance Criteria

Chọn Business và Funding Opportunity liên quan nếu có.

Nhập tiêu đề, mục đích liên hệ và lời nhắn.

Business Owner nhận thông báo.

Trạng thái Pending, Accepted, Declined hoặc Closed.

Không công khai email/phone private trước khi được chấp nhận.

Có rate limit và chống spam.

Priority: P0

US-CONTACT-02 — Phản hồi Contact Request

Là Business Owner, tôi muốn chấp nhận hoặc từ chối yêu cầu liên hệ để kiểm soát người có thể trao đổi.

Acceptance Criteria

Owner xem hồ sơ người gửi và nội dung request.

Có Accept, Decline và Report.

Người gửi nhận thông báo kết quả.

Sau khi Accept, hệ thống có thể tạo Conversation.

Decision được ghi thời gian và người xử lý.

Priority: P0

US-ACCESS-01 — Yêu cầu xem tài liệu confidential

Là Logged-in User, tôi muốn gửi Document Access Request để xem dữ liệu cần thiết để đánh giá sâu hơn.

Acceptance Criteria

Chỉ áp dụng cho tài liệu được cấu hình Approved Access.

Người gửi chọn lý do và opportunity liên quan.

Business Owner nhận thông báo.

Trạng thái Pending, Approved, Rejected, Revoked hoặc Expired.

Backend kiểm tra verified status và quyền truy cập.

Priority: P1

US-ACCESS-02 — Cấp hoặc thu hồi quyền xem tài liệu

Là Business Owner, tôi muốn quản lý Document Access Request để bảo vệ thông tin nhạy cảm.

Acceptance Criteria

Owner có thể Approve, Reject hoặc Revoke.

Có thể cấu hình thời hạn truy cập nếu sản phẩm hỗ trợ.

Download URL được tạo ngắn hạn qua backend sau khi kiểm tra quyền.

Mọi lần cấp/thu hồi và tải tài liệu quan trọng được audit log.

Người dùng nhận thông báo khi quyền thay đổi.

Priority: P1

US-MESSAGE-01 — Nhắn tin trực tiếp

Là Business Owner, User hoặc User, tôi muốn nhắn tin trong hệ thống để trao đổi mà không cần công khai thông tin cá nhân.

Acceptance Criteria

Chỉ các bên được phép mới tham gia Conversation.

Tin nhắn có thời gian gửi và trạng thái đọc/chưa đọc.

Có thể gửi attachment theo chính sách và kiểm tra file.

Có thể chặn người dùng và report cuộc trò chuyện.

Không log nội dung nhạy cảm ở application logs.

Priority: P1

8. Epic: News

US-NEWS-01 — Xem danh sách News

Là người dùng, tôi muốn xem tin tức về doanh nghiệp, đầu tư và thị trường để cập nhật thông tin mới.

Acceptance Criteria

News sắp xếp theo ngày đăng.

Có ảnh, tiêu đề, mô tả ngắn, chuyên mục và tác giả.

Có Featured News, search, filter và pagination.

Chỉ bài Published mới hiển thị công khai.

Priority: P0

US-NEWS-02 — Xem chi tiết News

Là người dùng, tôi muốn đọc toàn bộ bài News để hiểu sự kiện hoặc thay đổi thị trường.

Acceptance Criteria

Có tiêu đề, ảnh đại diện, tác giả, ngày đăng và nội dung.

Có category, tags, related articles và share action.

Có metadata SEO.

Không tự động coi News là khuyến nghị đầu tư.

Priority: P0

US-NEWS-03 — Phân loại News

Là người dùng, tôi muốn lọc News theo chủ đề để xem nội dung phù hợp.

Acceptance Criteria

Danh mục có thể gồm Funding, SME Programs, Events, Partnerships, Policy, Market News, Business Expansion và Product Updates.

Category do Admin quản lý.

URL lưu filter đang chọn.

Priority: P1

9. Epic: Blogs và kiến thức

US-BLOG-01 — Xem danh sách Blog

Là người dùng, tôi muốn xem bài hướng dẫn và phân tích để học kinh nghiệm kinh doanh và gọi vốn.

Acceptance Criteria

Có Featured Blog, Latest, Most Popular, search và category filter.

Card có ảnh, tiêu đề, mô tả, tác giả và thời gian đọc.

Có pagination hoặc load more.

Priority: P0

US-BLOG-02 — Phân loại Blog

Là người dùng, tôi muốn lọc Blog theo mục tiêu để tìm nội dung phù hợp.

Acceptance Criteria

Danh mục có thể gồm Business Guide, Funding, Financial Management, Growth, Marketing, Operations, Digital Transformation, User Insights và Business Stories.

Category do Admin quản lý.

Không giới hạn nội dung chỉ dành cho startup công nghệ.

Priority: P1

US-BLOG-03 — Xem chi tiết Blog

Là người dùng, tôi muốn đọc bài Blog để tiếp thu nội dung chuyên sâu.

Acceptance Criteria

Có tiêu đề, tác giả, ngày đăng, thời gian đọc và nội dung.

Có mục lục cho bài dài.

Có tags, related articles và share action.

Có thể hiển thị disclaimer khi bài viết liên quan pháp lý, tài chính hoặc đầu tư.

Priority: P0

US-CONTENT-01 — Quản lý News và Blogs

Là Content Editor, tôi muốn tạo và quản lý bài viết để duy trì nội dung nền tảng.

Acceptance Criteria

Tạo, lưu Draft, preview, schedule, publish, edit và unpublish.

Chọn thumbnail, category, tags và Featured status.

Editor chỉ được thao tác theo quyền.

Nội dung có createdBy, updatedBy, publishedAt và revision history khi cần.

Upload ảnh qua S3 theo flow chuẩn.

Priority: P0

10. Epic: Footer và trang thông tin

US-FAQ-01 — Xem FAQ

Là người dùng, tôi muốn xem câu hỏi thường gặp để tự giải quyết vấn đề.

Acceptance Criteria

FAQ chia theo nhóm Business, User, Funding Opportunity, Account, Privacy và Support.

Có search và accordion.

Admin có thể tạo, sửa, xóa, sắp xếp và publish FAQ.

Priority: P1

US-SUPPORT-01 — Gửi yêu cầu hỗ trợ

Là người dùng, tôi muốn tạo support ticket để được trợ giúp khi gặp sự cố.

Acceptance Criteria

Chọn loại vấn đề, nhập tiêu đề và mô tả.

Có thể đính kèm ảnh/file theo policy.

Ticket có mã theo dõi.

Trạng thái Open, In Progress, Waiting for User, Resolved hoặc Closed.

Người dùng nhận thông báo khi có phản hồi.

Priority: P1

US-ABOUT-01 — Xem About

Là khách truy cập, tôi muốn xem thông tin về Startups Blogs để hiểu sứ mệnh và phạm vi nền tảng.

Acceptance Criteria

Hiển thị sứ mệnh, tầm nhìn, giá trị và nhóm người dùng phục vụ.

Nêu rõ Startups Blogs kết nối các bên, không bảo đảm kết quả đầu tư.

Có thông tin liên hệ hoặc kênh support.

Priority: P1

US-LEGAL-01 — Xem Terms và Privacy

Là người dùng, tôi muốn xem điều khoản và chính sách riêng tư để hiểu cách hệ thống xử lý dữ liệu.

Acceptance Criteria

Có Terms of Service và Privacy Policy.

Có ngày cập nhật và version.

Lưu version người dùng đã đồng ý khi cần.

Thông báo thay đổi quan trọng.

Mô tả xử lý dữ liệu hồ sơ, tài liệu private, Cognito, S3 và hoạt động liên hệ ở mức phù hợp.

Priority: P0

US-LEGAL-02 — Xem Investment Disclaimer

Là người dùng, tôi muốn xem tuyên bố miễn trừ liên quan đầu tư để hiểu vai trò và giới hạn trách nhiệm của nền tảng.

Acceptance Criteria

Nêu rõ Startups Blogs là nền tảng kết nối và hiển thị thông tin.

Nêu rõ người dùng phải tự thẩm định trước khi đầu tư hoặc ký thỏa thuận.

Không mô tả nội dung trên nền tảng là tư vấn đầu tư mặc định.

Hiển thị liên kết disclaimer ở Footer và các trang Funding Opportunity phù hợp.

Priority: P0

12. Epic: Thông báo

US-NOTIFICATION-01 — Nhận thông báo trong website

Là người dùng, tôi muốn nhận thông báo về hoạt động quan trọng để không bỏ lỡ tương tác.

Acceptance Criteria

Thông báo khi Business/Funding Opportunity được duyệt, từ chối hoặc yêu cầu sửa.

Thông báo khi có Contact Request và kết quả phản hồi.

Thông báo khi có Document Access Request hoặc quyền bị thay đổi.

Thông báo khi có message, comment hoặc reply mới.

Thông báo khi Business đang follow có Funding Opportunity mới hoặc thay đổi trạng thái.

Priority: P1

US-NOTIFICATION-02 — Quản lý trạng thái đã đọc

Là người dùng, tôi muốn đánh dấu thông báo để quản lý inbox thông báo.

Acceptance Criteria

Có unread count.

Đánh dấu từng thông báo hoặc tất cả là đã đọc.

Nhấn thông báo mở đúng nội dung liên quan.

Thông báo liên quan tài nguyên private vẫn kiểm tra quyền khi mở.

Priority: P1

US-NOTIFICATION-03 — Cài đặt thông báo

Là người dùng, tôi muốn chọn loại thông báo nhận để giảm thông báo không cần thiết.

Acceptance Criteria

Bật/tắt email theo nhóm thông báo.

Bật/tắt in-app notification khi policy cho phép.

Thông báo bảo mật và thay đổi quyền quan trọng không thể tắt hoàn toàn.

Cài đặt được lưu theo user.

Priority: P2

13. Epic: Admin, kiểm duyệt và vận hành

US-ADMIN-01 — Admin Dashboard

Là Admin, tôi muốn xem tổng quan hệ thống để theo dõi hoạt động và rủi ro.

Acceptance Criteria

Hiển thị tổng User, Business, User và User.

Hiển thị Funding Opportunity theo trạng thái.

Hiển thị verification request, report và support ticket chưa xử lý.

Hiển thị chỉ số truy cập/tương tác ở mức tổng hợp.

Không để dữ liệu nhạy cảm xuất hiện trên dashboard không cần thiết.

Priority: P0

US-ADMIN-02 — Duyệt Funding Opportunity

Là Moderator, tôi muốn kiểm duyệt cơ hội gọi vốn để đảm bảo chất lượng và tuân thủ nội dung.

Acceptance Criteria

Xem toàn bộ nội dung và tài liệu được phép kiểm duyệt.

Approve, Reject hoặc Request Changes.

Nhập lý do và ghi chú nội bộ.

Xem revision history.

Quyết định được audit log.

Priority: P0

US-ADMIN-03 — Duyệt Business và User Verification

Là Moderator hoặc Admin, tôi muốn xử lý yêu cầu xác minh để tăng độ tin cậy của nền tảng.

Acceptance Criteria

Xem hồ sơ và tài liệu verification theo quyền.

Approve, Reject hoặc Request More Information.

Không tải tài liệu private nếu không cần thiết ngoài quy trình.

Ghi thời gian, người xử lý và lý do.

Thông báo kết quả cho người dùng.

Priority: P1

US-ADMIN-04 — Quản lý người dùng

Là Admin, tôi muốn quản lý tài khoản để xử lý vi phạm và hỗ trợ vận hành.

Acceptance Criteria

Search user và xem thông tin cần thiết.

Suspend, Disable, Restore hoặc thay đổi role theo quyền.

Xem trạng thái Business/User Profile liên quan.

Xem lịch sử vi phạm và audit log.

Không chỉnh sửa Cognito password trực tiếp trong application database.

Priority: P0

US-ADMIN-05 — Quản lý báo cáo

Là Moderator, tôi muốn xử lý report để duy trì môi trường an toàn.

Acceptance Criteria

Xem nội dung bị report, lý do và bằng chứng liên quan.

Dismiss, Hide, Remove, Warn hoặc Escalate theo quyền.

Có trạng thái và người phụ trách.

Quyết định được audit log.

Người report không nhất thiết được xem toàn bộ chi tiết xử lý nội bộ.

Priority: P0

US-ADMIN-06 — Quản lý Featured Opportunity

Là Admin, tôi muốn chọn cơ hội hiển thị trên Home để tạo điểm nhấn nội dung.

Acceptance Criteria

Chỉ chọn Funding Opportunity Published và Business active.

Chọn ảnh/banner, tiêu đề phụ và CTA.

Thiết lập startAt/endAt.

Preview trước khi activate.

Ngăn nhiều banner xung đột nếu chỉ hỗ trợ một banner chính.

Priority: P0

US-ADMIN-07 — Quản lý danh mục

Là Admin, tôi muốn quản lý taxonomy để giữ dữ liệu thống nhất.

Acceptance Criteria

Quản lý Industry, Business Type, Business Stage, Funding Purpose, Funding Type, User Type, News Category, Blog Category và Report Reason.

Có active/inactive và sort order.

Không xóa cứng danh mục đang được dữ liệu sử dụng nếu gây mất toàn vẹn.

Thay đổi quan trọng được audit log.

Priority: P0

US-ADMIN-08 — Audit Log

Là Admin, tôi muốn xem lịch sử hành động quan trọng để truy vết thay đổi và sự cố.

Acceptance Criteria

Lưu actor, action, target, timestamp và request ID.

Lưu before/after cho thay đổi phù hợp nhưng không ghi secret/token/password.

Cho phép filter theo actor, action, target và date range.

Audit log chỉ người có quyền mới truy cập.

Priority: P1

14. User Stories phi chức năng

US-NFR-01 — Responsive

Là người dùng, tôi muốn sử dụng website trên nhiều thiết bị để có trải nghiệm nhất quán.

Acceptance Criteria

Hỗ trợ desktop, tablet và mobile.

Navbar chuyển thành mobile menu.

Card grid tự điều chỉnh số cột.

Form Raise Capital chuyển một cột trên mobile.

Không có horizontal overflow ngoài khu vực được thiết kế.

Priority: P0

US-NFR-02 — Hiệu năng

Là người dùng, tôi muốn tải trang nhanh để không phải chờ lâu.

Acceptance Criteria

Ảnh được resize/compress và phục vụ qua CDN phù hợp.

Có lazy loading và loading skeleton.

REST API có pagination và index database cho truy vấn phổ biến.

Frontend tránh request trùng và cache dữ liệu hợp lý.

Các trang chính có mục tiêu hiệu năng được đo trên staging.

Priority: P0

US-NFR-03 — Bảo mật

Là người dùng, tôi muốn bảo vệ tài khoản và dữ liệu để an tâm sử dụng nền tảng.

Acceptance Criteria

Toàn bộ traffic dùng HTTPS.

Authentication qua Cognito; backend verify JWT đúng issuer, audience/client và expiration.

Authorization kiểm tra role và ownership.

Validate input ở frontend và backend.

Rate limit auth, search nặng, contact, comment, report và upload endpoints.

Secret nằm trong AWS Secrets Manager hoặc cơ chế tương đương.

Không log password, token, presigned URL đầy đủ hoặc tài liệu private.

Priority: P0

US-NFR-04 — Bảo mật file và tài liệu confidential

Là Business Owner, tôi muốn kiểm soát file nhạy cảm để tránh truy cập trái phép.

Acceptance Criteria

Upload dùng S3 Presigned URL có thời hạn ngắn.

Private files không public-read.

Download URL chỉ được tạo sau authorization.

Validate MIME type, extension, size và purpose.

Lưu object key thay vì presigned URL.

Có audit cho quyền truy cập tài liệu quan trọng.

Priority: P0

US-NFR-05 — Khả năng truy cập

Là người dùng có nhu cầu hỗ trợ, tôi muốn dùng website bằng bàn phím và công cụ hỗ trợ để tiếp cận đầy đủ chức năng.

Acceptance Criteria

Dùng semantic HTML.

Form có label và error message liên kết đúng.

Ảnh có alt text phù hợp.

Có focus state và keyboard navigation.

Màu có độ tương phản phù hợp.

Trạng thái không chỉ thể hiện bằng màu.

Priority: P1

US-NFR-06 — Sao lưu và phục hồi

Là Admin, tôi muốn sao lưu dữ liệu để giảm rủi ro mất dữ liệu.

Acceptance Criteria

RDS PostgreSQL có backup theo cấu hình môi trường.

S3 bật versioning hoặc backup phù hợp cho file quan trọng.

Có quy trình restore được tài liệu hóa và kiểm thử định kỳ.

Xóa dữ liệu quan trọng có xác nhận và policy retention.

Priority: P0

US-NFR-07 — Monitoring và logging

Là Admin kỹ thuật, tôi muốn giám sát hệ thống để phát hiện lỗi sớm.

Acceptance Criteria

Theo dõi API error rate, latency, CPU/memory và database connections.

CloudWatch hoặc công cụ tương đương có alert.

Mỗi request có request ID/correlation ID.

Log không chứa dữ liệu bí mật.

Có dashboard cho health checks và job thất bại.

Priority: P0

US-NFR-08 — Tính toàn vẹn và nhất quán dữ liệu

Là Admin kỹ thuật, tôi muốn duy trì dữ liệu nhất quán để tránh lỗi nghiệp vụ.

Acceptance Criteria

PostgreSQL constraints và Prisma schema phản ánh quan hệ chính.

Dùng transaction cho thao tác nhiều bước.

Không để Funding Opportunity tồn tại mà không có Business hợp lệ.

Không để quyền document access tồn tại sau khi user/business bị vô hiệu hóa mà không được đánh giá lại.

Migration được review và chạy qua môi trường staging trước production.

Priority: P0

15. Trạng thái chính trong hệ thống

15.1. Business Profile

Draft → Pending Review → Published
↘ Rejected / Changes Requested
Published → Suspended / Archived

15.2. Funding Opportunity

Draft → Pending Review → Published
↘ Changes Requested / Rejected
Published → Closed / Funded / Archived / Hidden by Moderator

15.3. Contact Request

Pending → Accepted / Declined → Closed

15.4. Verification

Not Submitted → Pending → Approved / Rejected / More Information Required

15.5. Document Access Request

Pending → Approved / Rejected
Approved → Revoked / Expired

15.6. Support Ticket

Open → In Progress → Waiting for User → Resolved → Closed

16. Các entity chính cho backend

User
Role
UserRole
Business
BusinessMember
BusinessVerification
BusinessFinancialSnapshot
Industry
FundingOpportunity
FundingOpportunityRevision
FundingDocument
UserProfile
UserVerification
SavedBusiness
SavedFundingOpportunity
Follow
Comment
ContactRequest
DocumentAccessRequest
Conversation
ConversationParticipant
Message
Notification
NewsArticle
BlogArticle
SupportTicket
SupportMessage
Report
FeaturedFundingOpportunity
AuditLog

16.1. Quan hệ cơ bản

User
├── owns or joins Businesses through BusinessMember
├── may have UserProfile
├── saves Businesses and Funding Opportunities
├── follows Businesses
├── creates ContactRequests and DocumentAccessRequests
└── participates in Conversations

Business
├── has many BusinessMembers
├── has many FundingOpportunities
├── has verification records
├── receives ContactRequests
└── may appear in FeaturedFundingOpportunity through an opportunity

FundingOpportunity
├── belongs to Business
├── has many revisions and documents
├── has comments
├── receives saves and contact requests
└── may require DocumentAccessRequest for confidential files

17. Module backend Node.js và REST API

17.1. Module đề xuất

/auth
/users
/businesses
/business-members
/business-verifications
/funding-opportunities
/investors
/search
/saved-items
/follows
/comments
/contact-requests
/document-access
/messages
/notifications
/news
/blogs
/uploads
/support
/reports
/admin
/audit-logs

17.2. Route chính

/api/v1/auth
/api/v1/users
/api/v1/businesses
/api/v1/businesses/:businessId/members
/api/v1/businesses/:businessId/verification
/api/v1/funding-opportunities
/api/v1/funding-opportunities/:id
/api/v1/investors
/api/v1/contact-requests
/api/v1/document-access-requests
/api/v1/messages
/api/v1/notifications
/api/v1/news
/api/v1/blogs
/api/v1/uploads/presign
/api/v1/uploads/complete
/api/v1/support-tickets
/api/v1/reports
/api/v1/admin

17.3. Response chuẩn

{
"success": true,
"message": "Funding opportunity created successfully",
"data": {},
"meta": {}
}

{
"success": false,
"message": "Validation failed",
"errors": [
{
"field": "fundingAmountMin",
"message": "Minimum amount must not exceed maximum amount"
}
]
}

18. Cấu trúc frontend React

src/
├── components/
│ ├── common/
│ ├── business/
│ ├── funding/
│ ├── investor/
│ ├── article/
│ └── forms/
├── pages/
│ ├── Home/
│ ├── ExploreBusinesses/
│ ├── BusinessDetail/
│ ├── FundingOpportunityDetail/
│ ├── Users/
│ ├── UserDetail/
│ ├── RaiseCapital/
│ ├── News/
│ ├── Blogs/
│ ├── Messages/
│ ├── Profile/
│ ├── Dashboard/
│ └── Admin/
├── layouts/
├── routes/
├── services/
├── hooks/
├── contexts/
├── store/
├── utils/
├── styles/
└── assets/

18.1. Route frontend chính

/
/businesses
/businesses/:slug
/funding-opportunities/:slug
/raise-capital
/investors
/investors/:slug
/news
/news/:slug
/blogs
/blogs/:slug
/messages
/dashboard
/profile
/faq
/support
/about
/terms
/privacy
/investment-disclaimer
/admin

19. Kiến trúc AWS dự kiến

React Frontend
↓
Amazon S3 + CloudFront
↓
Node.js REST API
↓
Amazon ECS Fargate hoặc Elastic Beanstalk
↓
Amazon RDS PostgreSQL + Prisma

Nhu cầu

Dịch vụ

Hosting React

Amazon S3 + CloudFront

Chạy Node.js API

ECS Fargate hoặc Elastic Beanstalk

Database

Amazon RDS PostgreSQL

ORM

Prisma

Authentication

Amazon Cognito User Pool

Logo, ảnh, pitch deck, tài liệu

Amazon S3

Upload trực tiếp

S3 Presigned URL

Email giao dịch

Amazon SES

Log và monitoring

Amazon CloudWatch

Secrets

AWS Secrets Manager

SSL

AWS Certificate Manager

Domain

Route 53

Web protection

AWS WAF

19.1. Luồng authentication

React ↔ Cognito User Pool
React → Cognito access token → Node.js API
Node.js API → verify JWT → load User and permissions from PostgreSQL

19.2. Luồng upload

React → Node.js xin Presigned URL
Node.js kiểm tra quyền và metadata
React → upload trực tiếp lên S3
React → Node.js xác nhận hoàn tất
Node.js → lưu object key và metadata vào PostgreSQL

20. Phạm vi MVP

20.1. Giai đoạn 1 — MVP bắt buộc

Đăng ký, đăng nhập, xác minh email và phân quyền bằng Cognito.

Business Profile và quản lý owner/editor cơ bản.

User Profile.

Raise Capital và Funding Opportunity Draft/Submit/Review/Publish.

Upload logo, ảnh và pitch deck bằng S3 Presigned URL.

Explore Businesses với search, filter, sort và pagination.

Business Detail và Funding Opportunity Detail.

User Directory và User Detail.

Save Business.

Contact Request.

News và Blogs.

Admin Dashboard cơ bản, moderation và taxonomy.

Featured Investment Opportunity Banner.

FAQ, About, Terms, Privacy và Investment Disclaimer.

20.2. Giai đoạn 2

Direct Messaging.

Comments.

Follow Business.

Saved Funding Opportunity.

Notifications.

Business và User Verification.

Document Access Request.

Support Ticket.

Advanced Moderation.

Business Analytics.

20.3. Giai đoạn 3

Matching doanh nghiệp và nhà đầu tư theo tiêu chí.

Trending algorithm.

Profile completeness score.

Paid Featured Opportunity nếu mô hình kinh doanh cho phép.

Subscription.

Advanced analytics.

AI hỗ trợ soạn mô tả cơ hội gọi vốn nhưng luôn yêu cầu người dùng kiểm tra và chịu trách nhiệm nội dung.

21. Definition of Done

Một User Story chỉ được xem là hoàn thành khi đáp ứng toàn bộ điều kiện liên quan:

Giao diện React hoàn thiện theo Page Specs và Design System.

Chỉ sử dụng CSS Modules và CSS Variables theo quy ước dự án.

Responsive trên desktop, tablet và mobile.

Node.js REST API hoàn thiện và bám API Contract.

Cognito authentication và backend authorization hoạt động đúng.

Dữ liệu được lưu đúng trong PostgreSQL qua Prisma.

Upload private/public file tuân thủ S3 Presigned URL và access policy.

Có validate frontend và backend.

Có loading, empty, error và success state.

Có unit test cho logic quan trọng và integration test cho API chính.

Lint, typecheck, test và production build đều pass.

Không có lỗi bảo mật nghiêm trọng hoặc dữ liệu confidential bị lộ.

Được deploy và kiểm thử trên môi trường staging AWS.

Được Product Owner kiểm tra theo Acceptance Criteria.

22. Quy ước thuật ngữ bắt buộc

Không dùng làm thuật ngữ trung tâm

Dùng thống nhất

Startup

Business; Startup chỉ là một Business Type

Startup Founder

Business Owner

Browse Startups

Explore Businesses

Startup Profile

Business Profile

Post Your Idea

Raise Capital

Idea

Funding Opportunity

Featured Startup

Featured Investment Opportunity

Saved Startup

Saved Business

Contact Founder

Contact Business / Contact Business Owner


## Epic 7: Cộng đồng và Thảo luận (User-Generated Content)

**7.1. Đóng góp bài viết (Dành cho Business Owner)**
- **Mô tả:** Tôi muốn có thể tự viết bài Blog/Insight trên nền tảng.
- **Acceptance Criteria:**
  - Có giao diện soạn thảo văn bản (Rich-text editor).
  - Có thể chọn danh mục (Funding, Growth, Product...).
  - Lưu bản nháp (Draft) hoặc Gửi duyệt (Submit for Review).
  - Có tính năng Chỉnh sửa bài viết (gửi duyệt lại khi sửa).
  - Có tính năng Yêu cầu xóa bài viết (chuyển sang trạng thái chờ duyệt xóa `PENDING_DELETE`).
  
**7.1.1. Bảng điều khiển tác giả (Author Analytics Dashboard)**
- **Mô tả:** Tôi muốn xem thống kê lượng truy cập và tương tác của bài viết mình đã đăng.
- **Acceptance Criteria:**
  - Hiển thị bảng điều khiển ngay trên cùng của bài viết nếu người xem chính là tác giả.
  - Cung cấp biểu đồ thống kê lượt xem theo thời gian (ví dụ: lượt xem trong tuần).
  - Tích hợp sẵn các nút hành động nhanh như "Chỉnh sửa" và "Xóa" ngay trên giao diện đọc bài.

**7.2. Kiểm duyệt nội dung (Dành cho Moderator)**
- **Mô tả:** Tôi muốn kiểm duyệt các bài Blog do người dùng gửi lên trước khi hiển thị công khai.
- **Acceptance Criteria:**
  - Danh sách bài chờ duyệt (PENDING_REVIEW).
  - Nút Phê duyệt (Publish) hoặc Từ chối (Reject) kèm lý do qua email.

**7.3. Bình luận bài viết (Dành cho User & Business Owner)**
- **Mô tả:** Tôi muốn bình luận và thảo luận dưới các bài viết.
- **Acceptance Criteria:**
  - Người dùng đã đăng nhập có quyền bình luận.
  - Có thể trả lời (Reply) bình luận của người khác (Nested comments 1 cấp).
  - Moderator có quyền xóa các bình luận vi phạm.


**7.4. Đánh dấu bài viết (Bookmark)**
- **Mô tả:** Tôi muốn lưu (bookmark) các bài viết Blog/News hay để đọc lại sau.
- **Acceptance Criteria:**
  - Có nút Bookmark trên thẻ bài viết và trang chi tiết bài viết.
  - Xem danh sách "Saved Blogs" trong trang User Profile (Private view).

**7.5. Trang Cá Nhân & Doanh Nghiệp (Public Profiles)**
- **Mô tả:** Tôi muốn xem hồ sơ công khai của Người dùng (Tác giả) và Doanh nghiệp (Startup) để đọc tất cả các bài viết của họ.
- **Acceptance Criteria:**
  - **User Profile:** Hiển thị Avatar, Tên, Bio và danh sách các bài viết đã được duyệt của người dùng đó.
  - **Startup Profile:** Bổ sung tab "Blogs & Updates" để hiển thị các bài viết được liên kết với doanh nghiệp đó.
