const { PrismaClient, Role } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.updateMany({
    where: {
      email: {
        in: ['khanghakim12l421@gmail.com', 'phangiakiet65@gmail.com']
      }
    },
    data: {
      role: 'ADMIN'
    }
  });
  console.log('Roles updated to ADMIN!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
