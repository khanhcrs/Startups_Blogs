import * as dotenv from 'dotenv';
dotenv.config();
import { PrismaClient, Role } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Đang tìm và cấp quyền ADMIN...');
  
  const emails = ['khanghakim12l421@gmail.com', 'phangiakiet65@gmail.com'];
  
  for (const email of emails) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      await prisma.user.update({
        where: { email },
        data: { role: Role.ADMIN }
      });
      console.log(`Đã cấp quyền ADMIN cho: ${email}`);
    } else {
      console.log(`Chưa tìm thấy user với email: ${email} trong Database. Bạn cần đăng nhập web một lần để Database tạo user này trước.`);
    }
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
