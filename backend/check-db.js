const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.count();
  const businesses = await prisma.business.count();
  console.log('Users:', users, 'Businesses:', businesses);
}
main().catch(console.error).finally(() => prisma.$disconnect());
