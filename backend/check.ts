import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: { notifications: true }
      }
    }
  });
  console.log(users.map(u => ({ email: u.email, notificationsCount: u._count.notifications })));
}

main().finally(() => prisma.$disconnect());
