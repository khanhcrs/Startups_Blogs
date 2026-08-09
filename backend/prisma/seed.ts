import * as dotenv from 'dotenv';
dotenv.config();
import { PrismaClient, Role } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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

  // 1. Tạo các user mặc định để test

  const password = await bcrypt.hash('password123', 10);
  

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@startups.vn',
      name: 'Quản Trị Viên',
      bio: 'Người quản lý hệ thống Startups & Blogs',
      location: 'Hà Nội, Việt Nam',
      role: Role.ADMIN,
      avatarUrl: 'https://i.pravatar.cc/150?u=admin',
    }
  });

  const testUser = await prisma.user.create({
    data: {
      email: 'user@startups.vn',

      name: 'Khách Tham Quan',
      bio: 'Nhà đầu tư thiên thần, đam mê công nghệ',

      password,
      name: 'Nhà Đầu Tư Angel',
      bio: 'Đam mê công nghệ và tìm kiếm các startup tiềm năng tại Đông Nam Á.',

      location: 'Hồ Chí Minh, Việt Nam',
      role: Role.USER,
      avatarUrl: 'https://i.pravatar.cc/150?u=investor',
    }
  });

  // Create 12 founders
  const founders: any[] = [];
  for (let i = 1; i <= 12; i++) {
    founders.push(await prisma.user.create({
      data: {

        email: faker.internet.email(),
        name: faker.person.fullName(),
        bio: faker.person.jobTitle(),
        location: faker.location.city(),
        avatarUrl: faker.image.avatar(),

        email: `founder${i}@startups.vn`,
        password,
        name: `Founder ${i}`,
        bio: 'Khởi nghiệp gia nhiệt huyết, luôn tìm kiếm giải pháp đột phá.',
        location: i % 2 === 0 ? 'Hà Nội, Việt Nam' : 'Hồ Chí Minh, Việt Nam',
        avatarUrl: `https://i.pravatar.cc/150?u=founder${i}`,

      }
    }));
  }

  // 12 Realistic Startups Data
  const startupData = [
    {
      name: 'PayVN', legalName: 'Công ty Cổ phần Công nghệ Thanh toán PayVN',
      industry: 'Fintech', businessType: 'Startup công nghệ', businessStage: 'Series B',
      desc: 'Nền tảng thanh toán điện tử hàng đầu với hơn 10 triệu người dùng.',
      detailed: 'PayVN cung cấp giải pháp thanh toán toàn diện qua mã QR, tích hợp với hơn 40 ngân hàng và 100,000 điểm chấp nhận thanh toán. Sứ mệnh của chúng tôi là thay đổi thói quen dùng tiền mặt tại Việt Nam.',
      logo: 'https://placehold.co/200x200/0047AB/FFFFFF?text=PayVN',
      cover: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'EduBase', legalName: 'Công ty Cổ phần Giáo dục EduBase',
      industry: 'EdTech', businessType: 'Startup công nghệ', businessStage: 'Series A',
      desc: 'Nền tảng học tập trực tuyến cá nhân hóa bằng Trí tuệ nhân tạo.',
      detailed: 'EduBase áp dụng AI để phân tích lộ trình học tập của từng học sinh, từ đó đề xuất bài giảng và bài tập phù hợp nhất. Hiện đang phục vụ hơn 500,000 học sinh từ lớp 1 đến lớp 12.',
      logo: 'https://placehold.co/200x200/228B22/FFFFFF?text=EduBase',
      cover: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'DoctorCare', legalName: 'Công ty TNHH Y tế Số DoctorCare',
      industry: 'HealthTech', businessType: 'B2C', businessStage: 'Hạt giống (Seed)',
      desc: 'Ứng dụng tư vấn sức khỏe từ xa và đặt lịch khám bệnh 24/7.',
      detailed: 'Kết nối trực tiếp bệnh nhân với hơn 2000 bác sĩ chuyên khoa. Tích hợp hồ sơ bệnh án điện tử, mua thuốc trực tuyến và giao thuốc tận nhà trong 2 giờ.',
      logo: 'https://placehold.co/200x200/DC143C/FFFFFF?text=DocCare',
      cover: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'BuyFast', legalName: 'Công ty Cổ phần BuyFast Việt Nam',
      industry: 'Thương mại điện tử', businessType: 'B2C', businessStage: 'Mở rộng quy mô',
      desc: 'Sàn thương mại điện tử chuyên cung cấp hàng chính hãng giao nhanh 2h.',
      detailed: 'BuyFast tự hào với hệ thống kho bãi trải dài toàn quốc, cam kết giao hàng trong 2 giờ tại các thành phố lớn. Tập trung vào trải nghiệm khách hàng và hàng hóa chất lượng cao.',
      logo: 'https://placehold.co/200x200/FF8C00/FFFFFF?text=BuyFast',
      cover: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'ShipNow', legalName: 'Công ty Cổ phần Vận tải Tốc độ ShipNow',
      industry: 'Logistics', businessType: 'B2B', businessStage: 'Series A',
      desc: 'Giải pháp logistics và giao hàng chặng cuối tối ưu cho các chủ shop.',
      detailed: 'Tối ưu hóa lộ trình giao hàng bằng AI, giúp giảm 30% chi phí vận hành. Hệ thống quản lý đơn hàng theo thời gian thực (Real-time tracking) cho cả người gửi và người nhận.',
      logo: 'https://placehold.co/200x200/FFD700/000000?text=ShipNow',
      cover: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'NhaTot', legalName: 'Công ty Cổ phần Bất động sản NhaTot',
      industry: 'PropTech', businessType: 'Mô hình lai', businessStage: 'Đang hoạt động có lãi',
      desc: 'Nền tảng giao dịch bất động sản minh bạch với công nghệ thực tế ảo.',
      detailed: 'Trải nghiệm xem nhà 3D Tour từ xa. Cung cấp định giá bất động sản tự động bằng Machine Learning dựa trên dữ liệu hàng triệu giao dịch đã thành công trên thị trường.',
      logo: 'https://placehold.co/200x200/4B0082/FFFFFF?text=NhaTot',
      cover: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'WorkBase', legalName: 'Công ty Cổ phần Phần mềm WorkBase',
      industry: 'SaaS', businessType: 'B2B', businessStage: 'Series B',
      desc: 'Hệ điều hành doanh nghiệp, quản lý công việc và nhân sự toàn diện.',
      detailed: 'Nền tảng hợp nhất hơn 50 ứng dụng chuyên biệt từ quản lý tiến độ dự án, OKR, HRM đến CRM. Tích hợp sâu vào quy trình làm việc giúp tăng 200% hiệu suất doanh nghiệp.',
      logo: 'https://placehold.co/200x200/000000/FFFFFF?text=WorkBase',
      cover: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'AgriConnect', legalName: 'Công ty TNHH Nông nghiệp Công nghệ cao AgriConnect',
      industry: 'Nông nghiệp sạch', businessType: 'B2B', businessStage: 'Hạt giống (Seed)',
      desc: 'Hệ thống quản lý tưới tiêu và nông trại thông minh qua IoT.',
      detailed: 'Cung cấp cảm biến theo dõi độ ẩm, nhiệt độ và dinh dưỡng đất. Tự động hóa hệ thống tưới tiêu và cảnh báo sâu bệnh qua ứng dụng di động cho nhà nông.',
      logo: 'https://placehold.co/200x200/8FBC8F/000000?text=AgriConn',
      cover: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'CryptoPets', legalName: 'Công ty Cổ phần Game Blockchain CryptoPets',
      industry: 'Blockchain', businessType: 'Startup công nghệ', businessStage: 'Ý tưởng (Idea)',
      desc: 'Trò chơi Play-to-Earn thế hệ mới kết hợp nuôi thú ảo bằng NFT.',
      detailed: 'Mỗi thú cưng là một NFT độc bản với gen di truyền riêng biệt. Người chơi có thể nhân giống, chiến đấu và trao đổi trên Marketplace hoàn toàn phi tập trung.',
      logo: 'https://placehold.co/200x200/FF69B4/FFFFFF?text=CPets',
      cover: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'VietAI', legalName: 'Viện Công nghệ Trí tuệ Nhân tạo VietAI',
      industry: 'Công nghệ AI', businessType: 'Doanh nghiệp xã hội', businessStage: 'Đang hoạt động có lãi',
      desc: 'Cung cấp các API nhận diện giọng nói và ngôn ngữ tự nhiên tiếng Việt.',
      detailed: 'Đội ngũ nghiên cứu hàng đầu từ các trường đại học lớn. Cung cấp API Text-to-Speech (TTS) và Speech-to-Text (STT) với độ chính xác lên tới 98% cho tiếng Việt mọi vùng miền.',
      logo: 'https://placehold.co/200x200/00CED1/FFFFFF?text=VietAI',
      cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'TravelVN', legalName: 'Công ty Cổ phần Du lịch Số TravelVN',
      industry: 'SaaS', businessType: 'B2C', businessStage: 'Series A',
      desc: 'Siêu ứng dụng đặt phòng khách sạn và tour du lịch tại Việt Nam.',
      detailed: 'Mạng lưới đối tác với hơn 10,000 khách sạn và resort. Cam kết giá rẻ nhất thị trường. Hỗ trợ đặt vé máy bay, xe khách và tour du lịch trải nghiệm địa phương.',
      logo: 'https://placehold.co/200x200/20B2AA/FFFFFF?text=TravelVN',
      cover: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'FoodNow', legalName: 'Công ty Cổ phần Giao nhận Ẩm thực FoodNow',
      industry: 'Thương mại điện tử', businessType: 'B2C', businessStage: 'Mở rộng quy mô',
      desc: 'Ứng dụng gọi món và giao đồ ăn tận nơi hàng đầu.',
      detailed: 'Kết nối với hơn 50,000 quán ăn và nhà hàng. Đội ngũ tài xế đông đảo đảm bảo giao đồ ăn nóng hổi trong 30 phút. Liên tục có các chương trình khuyến mãi hấp dẫn mỗi ngày.',
      logo: 'https://placehold.co/200x200/FA8072/FFFFFF?text=FoodNow',
      cover: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1200&q=80',
    }
  ];

  console.log('Đang tạo doanh nghiệp và nhân sự (Seeding businesses & team)...');
  const createdBusinesses: any[] = [];
  
  for (let i = 0; i < startupData.length; i++) {
    const data = startupData[i];
    const owner = founders[i];
    
    // Team Members
    const teamMembers = [
      { name: 'Nguyễn Văn A', role: 'Giám đốc Kỹ thuật (CTO)', bio: '10 năm kinh nghiệm tại Thung lũng Silicon.', avatarUrl: 'https://i.pravatar.cc/150?u=a' + i },
      { name: 'Trần Thị B', role: 'Giám đốc Marketing (CMO)', bio: 'Chuyên gia Growth Hacking.', avatarUrl: 'https://i.pravatar.cc/150?u=b' + i },
      { name: 'Lê Văn C', role: 'Giám đốc Sản phẩm (CPO)', bio: 'Thiết kế các sản phẩm phục vụ hàng triệu người dùng.', avatarUrl: 'https://i.pravatar.cc/150?u=c' + i }
    ];

    // Funding Rounds
    const fundingRounds: any[] = [];
    if (data.businessStage !== 'Ý tưởng (Idea)') {
      fundingRounds.push({
        roundName: 'Seed Round', amount: 500000, currency: 'USD',
        date: new Date(new Date().setFullYear(new Date().getFullYear() - 2)),
        investors: 'CyberAgent Capital, 500 Startups', isVerified: true
      });
    }
    if (data.businessStage.includes('Series A') || data.businessStage.includes('Series B') || data.businessStage === 'Mở rộng quy mô') {
      fundingRounds.push({
        roundName: 'Series A', amount: 2500000, currency: 'USD',
        date: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        investors: 'VinaCapital Ventures, Mekong Capital', isVerified: true
      });
    }

    const b = await prisma.business.create({
      data: {
        slug: data.name.toLowerCase(),
        name: data.name,
        legalName: data.legalName,
        description: data.desc,
        detailedOverview: data.detailed,
        industry: data.industry,
        businessType: data.businessType,
        businessStage: data.businessStage,
        location: owner.location || 'Hà Nội, Việt Nam',
        website: `https://${data.name.toLowerCase()}.vn`,
        logoUrl: data.logo,
        coverUrl: data.cover,
        status: 'APPROVED',
        isVerified: true,
        foundedYear: 2018 + (i % 5),
        employeeRange: ['10-50 employees', '50-200 employees', '200-500 employees'][i % 3],
        businessModel: data.businessType.includes('B2B') ? 'B2B Enterprise / SaaS' : 'B2C Platform / Marketplace',
        productsOrServices: 'Cung cấp hệ sinh thái giải pháp số toàn diện, ứng dụng các công nghệ lõi mới nhất giúp giải quyết triệt để các bài toán của thị trường.',
        operatingRegions: ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng'],
        mainMarket: 'Thị trường nội địa Việt Nam và định hướng mở rộng ra khu vực Đông Nam Á.',
        financialHighlights: { 
          revenueRange: '$1M - $5M', 
          growthRange: '+150% YoY', 
          profitabilityStatus: data.businessStage === 'Đang hoạt động có lãi' ? 'Profitable' : 'Pre-profit / Reinvesting', 
          reportingPeriod: 'Năm tài chính 2024' 
        },
        viewCount: Math.floor(Math.random() * 5000) + 100,
        savedCount: Math.floor(Math.random() * 500) + 10,
        commentCount: Math.floor(Math.random() * 100) + 5,
        ownerId: owner.id,
        teamMembers: { create: teamMembers },
        fundingRounds: { create: fundingRounds }
      }
    });
    createdBusinesses.push(b);
  }

  console.log('Đang tạo bài viết (Seeding articles)...');
  const articles: any[] = [];
  // Each business creates 2 articles
  for (const b of createdBusinesses) {
    const article1 = await prisma.article.create({
      data: {
        slug: `hanh-trinh-phat-trien-cua-${b.slug}`,
        title: `Hành trình phát triển bứt phá của ${b.name} trong năm qua`,
        summary: `Chia sẻ những câu chuyện chưa kể về quá trình xây dựng sản phẩm và vươn lên dẫn đầu thị trường của ${b.name}.`,
        content: `
          <h3>Bắt đầu từ một ý tưởng</h3>
          <p>Chúng tôi đã nhận thấy một vấn đề lớn trên thị trường và quyết định tạo ra ${b.name} để giải quyết nó. Những ngày đầu vô cùng khó khăn nhưng với sự nỗ lực không ngừng, chúng tôi đã đạt được những cột mốc quan trọng.</p>
          <h3>Vượt qua thách thức</h3>
          <p>Khó khăn lớn nhất là việc tìm kiếm nhân tài và thuyết phục những khách hàng đầu tiên. Bằng chất lượng sản phẩm thực sự, ${b.name} đã dần chiếm được lòng tin.</p>
          <h3>Tầm nhìn tương lai</h3>
          <p>Mục tiêu của chúng tôi trong 3 năm tới là dẫn đầu thị trường Đông Nam Á và IPO thành công.</p>
        `,
        status: 'PUBLISHED',
        category: 'Blog',
        tags: [b.industry, 'Khởi nghiệp', 'Tăng trưởng'],
        coverImage: b.coverUrl,
        viewCount: Math.floor(Math.random() * 5000) + 100,
        likesCount: Math.floor(Math.random() * 500) + 10,
        authorId: b.ownerId,
        businessId: b.id,
        publishedAt: new Date(new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 30)))
      }
    });

    const article2 = await prisma.article.create({
      data: {
        slug: `${b.slug}-ra-mat-tinh-nang-moi`,
        title: `${b.name} chính thức ra mắt bản cập nhật siêu khủng`,
        summary: `Khám phá những tính năng mới nhất vừa được đội ngũ kỹ sư của ${b.name} phát hành.`,
        content: `
          <p>Hôm nay, chúng tôi vô cùng tự hào công bố bản cập nhật lớn nhất từ trước đến nay.</p>
          <ul>
            <li><strong>Giao diện hoàn toàn mới:</strong> Tối giản và thân thiện hơn.</li>
            <li><strong>Hiệu năng tăng 300%:</strong> Xử lý dữ liệu mượt mà, không giật lag.</li>
            <li><strong>Tích hợp AI:</strong> Cá nhân hóa trải nghiệm người dùng tối đa.</li>
          </ul>
          <p>Hãy trải nghiệm ngay hôm nay và để lại phản hồi cho chúng tôi nhé!</p>
        `,
        status: 'PUBLISHED',
        category: 'Technology',
        tags: ['Cập nhật', 'Sản phẩm mới', 'Công nghệ'],
        coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
        viewCount: Math.floor(Math.random() * 2000) + 50,
        likesCount: Math.floor(Math.random() * 200) + 5,
        authorId: b.ownerId,
        businessId: b.id,
        publishedAt: new Date(new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 10)))
      }
    });
    
    articles.push(article1, article2);
  }

  // Admin posts some News
  for (let i = 1; i <= 3; i++) {
    const news = await prisma.article.create({
      data: {
        slug: `tin-tuc-thi-truong-khoi-nghiep-thang-${i}`,
        title: `Điểm tin thị trường Khởi nghiệp & Công nghệ (Số ${i})`,
        summary: `Tổng hợp các thương vụ gọi vốn khủng và biến động thị trường trong thời gian qua.`,
        content: `
          <p>Thị trường chứng kiến sự trỗi dậy mạnh mẽ của các startup trong lĩnh vực AI và EdTech. Điển hình là sự kiện một số công ty đã huy động thành công hàng triệu USD vòng Series A.</p>
          <p>Chúng tôi sẽ tiếp tục cập nhật các thông tin mới nhất đến cộng đồng nhà đầu tư.</p>
        `,
        status: 'PUBLISHED',
        category: 'News',
        tags: ['Tin tức', 'Thị trường', 'Đầu tư'],
        coverImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
        viewCount: 3000,
        likesCount: 150,
        authorId: adminUser.id,
        publishedAt: new Date()
      }
    });
    articles.push(news);
  }

  console.log('Đang tạo tương tác (Bình luận, Lưu bài viết, Theo dõi)...');
  // Add comments and bookmarks from testUser and admin
  for (const article of articles) {
    // Comments
    await prisma.comment.create({
      data: {
        content: 'Bài viết rất hay và chi tiết, cảm ơn đội ngũ!',
        authorId: testUser.id,
        articleId: article.id,
        createdAt: new Date()
      }
    });
    
    // Bookmark
    if (Math.random() > 0.5) {
      await prisma.bookmark.create({
        data: {
          userId: testUser.id,
          articleId: article.id,
        }
      });
    }
  }

  // Test User follows a few founders
  for (let i = 0; i < 5; i++) {
    await prisma.follow.create({
      data: {
        followerId: testUser.id,
        followingId: founders[i].id
      }
    });
  }

  console.log('Đang tạo thông báo mẫu (Seeding notifications)...');
  const allUsers = [adminUser, testUser, ...founders];
  for (const user of allUsers) {
    await prisma.notification.createMany({
      data: [
        {
          userId: user.id,
          title: 'Chào mừng đến với Startups & Blogs!',
          message: 'Hồ sơ của bạn đã được khởi tạo thành công. Hãy bắt đầu khám phá các startup tiềm năng ngay hôm nay.',
          type: 'SYSTEM',
          isRead: false,
          createdAt: new Date(new Date().setDate(new Date().getDate() - 2))
        },
        {
          userId: user.id,
          title: 'THÔNG BÁO BẢO TRÌ HỆ THỐNG',
          message: 'Hệ thống sẽ bảo trì định kỳ vào 00:00 - 02:00 sáng mai. Vui lòng lưu lại công việc của bạn.',
          type: 'ANNOUNCEMENT',
          isRead: true,
          createdAt: new Date(new Date().setDate(new Date().getDate() - 5))
        }
      ]
    });
  }

  console.log('Hoàn thành quá trình tạo dữ liệu (Seeding completed)!');
  console.log(`Đã tạo thành công: 14 Người dùng, 12 Doanh nghiệp chuẩn, 27 Bài viết, cùng các bình luận và tương tác.`);
  console.log(`\n============================`);

  console.log(`Tài khoản Admin (Dùng để test News):`);
  console.log(`Email: admin@startups.vn`);
  console.log(`\nTài khoản User thường (Dùng để test tính năng chung):`);
  console.log(`Email: user@startups.vn`);
  console.log(`Các tài khoản đăng nhập được quản lý trong AWS Cognito.`);

  console.log(`Tài khoản Admin: admin@startups.vn / password123`);
  console.log(`Tài khoản Nhà đầu tư: user@startups.vn / password123`);
  console.log(`Tài khoản Founder (ví dụ): founder1@startups.vn / password123`);

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
