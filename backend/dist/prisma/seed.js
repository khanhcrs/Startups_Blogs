"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const faker_1 = require("@faker-js/faker");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('Đang dọn dẹp cơ sở dữ liệu (Clearing database)...');
    await prisma.follow.deleteMany();
    await prisma.bookmark.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.article.deleteMany();
    await prisma.fundingOpportunity.deleteMany();
    await prisma.fundingRound.deleteMany();
    await prisma.teamMember.deleteMany();
    await prisma.business.deleteMany();
    await prisma.user.deleteMany();
    console.log('Đang tạo người dùng (Seeding users)...');
    const password = await bcrypt.hash('password123', 10);
    const adminUser = await prisma.user.create({
        data: {
            email: 'admin@startups.vn',
            password,
            name: 'Quản Trị Viên',
            bio: 'Người quản lý hệ thống Startups & Blogs',
            location: 'Hà Nội, Việt Nam',
            role: client_1.Role.ADMIN,
            avatarUrl: faker_1.fakerVI.image.avatar(),
        }
    });
    const testUser = await prisma.user.create({
        data: {
            email: 'user@startups.vn',
            password,
            name: 'Khách Tham Quan',
            bio: 'Nhà đầu tư thiên thần, đam mê công nghệ',
            location: 'Hồ Chí Minh, Việt Nam',
            role: client_1.Role.USER,
            avatarUrl: faker_1.fakerVI.image.avatar(),
        }
    });
    const users = [adminUser, testUser];
    for (let i = 0; i < 48; i++) {
        users.push(await prisma.user.create({
            data: {
                email: faker_1.fakerVI.internet.email(),
                password,
                name: faker_1.fakerVI.person.fullName(),
                bio: faker_1.fakerVI.person.jobTitle(),
                location: faker_1.fakerVI.location.city(),
                avatarUrl: faker_1.fakerVI.image.avatar(),
            }
        }));
    }
    console.log('Đang tạo doanh nghiệp và nhân sự (Seeding businesses & team)...');
    const businesses = [];
    const industries = ['Công nghệ AI', 'Fintech', 'Y tế & Chăm sóc sức khỏe', 'Giáo dục', 'Thương mại điện tử', 'Nông nghiệp sạch', 'SaaS', 'Proptech'];
    const stages = ['Ý tưởng (Idea)', 'Hạt giống (Seed)', 'Series A', 'Series B', 'Đang hoạt động có lãi', 'Mở rộng quy mô'];
    const types = ['Startup công nghệ', 'Doanh nghiệp xã hội', 'B2B', 'B2C', 'Mô hình lai'];
    for (let i = 0; i < 50; i++) {
        const owner = faker_1.fakerVI.helpers.arrayElement(users);
        const availableTeamUsers = users.filter(u => u.id !== owner.id);
        const teamSize = faker_1.fakerVI.number.int({ min: 2, max: 5 });
        const teamMembersForThisBusiness = faker_1.fakerVI.helpers.arrayElements(availableTeamUsers, teamSize);
        const b = await prisma.business.create({
            data: {
                slug: faker_1.fakerVI.helpers.slugify(faker_1.fakerVI.company.name()).toLowerCase() + '-' + i,
                name: faker_1.fakerVI.company.name() + ' Việt Nam',
                legalName: 'Công ty Cổ phần ' + faker_1.fakerVI.company.name(),
                description: 'Mang đến giải pháp chuyển đổi số toàn diện cho thị trường Việt Nam và Đông Nam Á.',
                detailedOverview: 'Được thành lập với sứ mệnh giải quyết những bài toán hóc búa nhất của doanh nghiệp trong kỷ nguyên 4.0. Chúng tôi tự hào sở hữu đội ngũ nhân sự chất lượng cao, cam kết mang đến những sản phẩm công nghệ tiên tiến nhất, từ AI đến Blockchain, phục vụ hơn hàng triệu người dùng mỗi ngày.',
                industry: faker_1.fakerVI.helpers.arrayElement(industries),
                businessType: faker_1.fakerVI.helpers.arrayElement(types),
                businessStage: faker_1.fakerVI.helpers.arrayElement(stages),
                location: faker_1.fakerVI.location.city(),
                website: faker_1.fakerVI.internet.url(),
                logoUrl: faker_1.fakerVI.image.urlLoremFlickr({ category: 'business' }),
                coverUrl: faker_1.fakerVI.image.urlLoremFlickr({ category: 'office' }),
                status: 'APPROVED',
                ownerId: owner.id,
                teamMembers: {
                    create: teamMembersForThisBusiness.map((tUser) => ({
                        userId: tUser.id,
                        name: tUser.name,
                        role: faker_1.fakerVI.helpers.arrayElement(['Giám đốc Kỹ thuật (CTO)', 'Giám đốc Marketing (CMO)', 'Nhà thiết kế (Product Designer)', 'Kỹ sư Phần mềm', 'Chuyên gia Phân tích Dữ liệu']),
                        bio: tUser.bio || 'Có nhiều năm kinh nghiệm dẫn dắt các dự án công nghệ lớn.',
                        avatarUrl: tUser.avatarUrl
                    }))
                }
            }
        });
        businesses.push(b);
    }
    console.log('Đang tạo bài viết và tin tức (Seeding articles)...');
    const articles = [];
    const categories = ['Blog', 'Funding', 'Technology', 'Leadership', 'Marketing'];
    const tagsPool = ['Khởi nghiệp', 'AI', 'Đầu tư', 'Thương mại điện tử', 'Tăng trưởng', 'Kỹ năng lãnh đạo', 'Kinh doanh', 'Phân tích dữ liệu'];
    const vietnameseTitles = [
        '5 Xu hướng công nghệ sẽ định hình tương lai năm 2025',
        'Làm thế nào để thu hút dòng vốn từ các quỹ đầu tư ngoại?',
        'Kinh nghiệm vượt qua giai đoạn "Thung lũng chết" của Startup',
        'Áp dụng Trí tuệ nhân tạo (AI) vào quy trình chăm sóc khách hàng',
        'Bài học đắt giá từ thất bại của các dự án tiền điện tử',
        'Quản trị dòng tiền - Chìa khóa sinh tồn cho Doanh nghiệp vừa và nhỏ',
        'Tại sao văn hóa doanh nghiệp lại quan trọng hơn cả chiến lược?',
        'Mô hình làm việc từ xa: Lợi ích và những thách thức tiềm ẩn',
        'Cách xây dựng MVP (Sản phẩm khả thi tối thiểu) trong 4 tuần',
        'Những lưu ý về mặt pháp lý trước khi ký Term Sheet',
    ];
    for (let i = 0; i < 50; i++) {
        const isNews = faker_1.fakerVI.datatype.boolean() && i % 5 === 0;
        const author = isNews ? adminUser : faker_1.fakerVI.helpers.arrayElement(users);
        const business = faker_1.fakerVI.datatype.boolean() ? faker_1.fakerVI.helpers.arrayElement(businesses) : null;
        const cat = isNews ? 'News' : faker_1.fakerVI.helpers.arrayElement(categories);
        const selectedTags = faker_1.fakerVI.helpers.arrayElements(tagsPool, faker_1.fakerVI.number.int({ min: 2, max: 4 }));
        const baseTitle = faker_1.fakerVI.helpers.arrayElement(vietnameseTitles);
        const article = await prisma.article.create({
            data: {
                slug: faker_1.fakerVI.helpers.slugify(baseTitle).toLowerCase() + '-' + Date.now() + i,
                title: baseTitle + ' (Cập nhật ' + (i + 1) + ')',
                summary: 'Bài viết này sẽ mang đến cho bạn góc nhìn đa chiều về những xu hướng mới nhất, đi kèm những phân tích sâu sắc từ các chuyên gia hàng đầu trong ngành.',
                content: `
          <h3>Phần 1: Thực trạng thị trường</h3>
          <p>Thị trường hiện nay đang chứng kiến một cuộc chuyển mình mạnh mẽ. Các doanh nghiệp không kịp thích nghi sẽ nhanh chóng bị bỏ lại phía sau. Để sống sót, việc đổi mới sáng tạo liên tục là bắt buộc.</p>
          
          <img src="${faker_1.fakerVI.image.urlLoremFlickr({ category: 'technology', width: 800, height: 400 })}" alt="Ảnh minh họa công nghệ" style="max-width:100%; border-radius:8px; margin:20px 0;" />
          
          <h3>Phần 2: Phân tích nguyên nhân & Giải pháp</h3>
          <p>Nhiều chuyên gia cho rằng nguyên nhân chính đến từ sự dịch chuyển hành vi của người tiêu dùng. Một số giải pháp nổi bật bao gồm:</p>
          <ul>
            <li><strong>Tối ưu hóa dữ liệu khách hàng:</strong> Dùng AI để phân tích hành vi mua sắm.</li>
            <li><strong>Chuyển đổi số toàn diện:</strong> Tự động hóa các quy trình thủ công.</li>
            <li><strong>Liên minh chiến lược:</strong> Tìm kiếm các đối tác để cùng tạo ra giá trị mới.</li>
          </ul>
          
          <img src="${faker_1.fakerVI.image.urlLoremFlickr({ category: 'business,people', width: 800, height: 400 })}" alt="Ảnh minh họa họp nhóm" style="max-width:100%; border-radius:8px; margin:20px 0;" />
          
          <h3>Phần 3: Bài học thực tiễn</h3>
          <p>Rất nhiều ví dụ thực tế đã chứng minh rằng, dù bạn là một gã khổng lồ hay một startup non trẻ, khả năng linh hoạt xoay chuyển tình thế (Pivot) mới là yếu tố quyết định thành bại.</p>
          
          <img src="${faker_1.fakerVI.image.urlLoremFlickr({ category: 'finance,chart', width: 800, height: 400 })}" alt="Ảnh biểu đồ tăng trưởng" style="max-width:100%; border-radius:8px; margin:20px 0;" />

          <h3>Kết luận</h3>
          <p>Tương lai luôn thuộc về những người dám tiên phong đổi mới. Chúc các bạn áp dụng thành công những chiến lược này vào doanh nghiệp của mình.</p>
        `,
                status: 'PUBLISHED',
                category: cat,
                tags: selectedTags,
                coverImage: faker_1.fakerVI.image.urlLoremFlickr({ category: 'abstract' }),
                viewCount: faker_1.fakerVI.number.int({ min: 50, max: 5000 }),
                likesCount: faker_1.fakerVI.number.int({ min: 10, max: 1000 }),
                authorId: author.id,
                businessId: business ? business.id : null,
                publishedAt: faker_1.fakerVI.date.recent({ days: 60 })
            }
        });
        articles.push(article);
    }
    console.log('Đang tạo tương tác (Bình luận, Lưu bài viết)...');
    for (let i = 0; i < 200; i++) {
        const article = faker_1.fakerVI.helpers.arrayElement(articles);
        const author = faker_1.fakerVI.helpers.arrayElement(users);
        await prisma.comment.create({
            data: {
                content: faker_1.fakerVI.helpers.arrayElement([
                    'Bài viết phân tích rất sâu sắc, cảm ơn bạn đã chia sẻ!',
                    'Góc nhìn này cực kỳ mới mẻ. Mình sẽ thử áp dụng cho team của mình.',
                    'Đọc xong thấy có thêm nhiều động lực để xây dựng startup. Tuyệt vời!',
                    'Phần số liệu ở đoạn 2 rất chính xác so với báo cáo quý vừa rồi. Mình lưu lại bài này.',
                    'Rất mong tác giả sẽ viết thêm phần tiếp theo về chủ đề này.',
                    'Thực sự hữu ích cho các anh em Founder đang gặp khó khăn.',
                    'Chất lượng nội dung quá tốt! Share mạnh cho mọi người cùng đọc.'
                ]),
                authorId: author.id,
                articleId: article.id,
                createdAt: faker_1.fakerVI.date.recent({ days: 20 })
            }
        });
        if (faker_1.fakerVI.datatype.boolean()) {
            try {
                await prisma.bookmark.create({
                    data: {
                        userId: author.id,
                        articleId: article.id,
                    }
                });
            }
            catch (e) {
            }
        }
    }
    console.log('Hoàn thành quá trình tạo dữ liệu (Seeding completed)!');
    console.log(`Đã tạo thành công: ${users.length} Người dùng, ${businesses.length} Doanh nghiệp, ${articles.length} Bài viết, cùng hàng trăm bình luận và đánh dấu.`);
    console.log(`\n============================`);
    console.log(`Tài khoản Admin (Dùng để test News):`);
    console.log(`Email: admin@startups.vn`);
    console.log(`Mật khẩu: password123`);
    console.log(`\nTài khoản User thường (Dùng để test tính năng chung):`);
    console.log(`Email: user@startups.vn`);
    console.log(`Mật khẩu: password123`);
    console.log(`============================\n`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map