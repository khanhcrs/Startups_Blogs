"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
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
//# sourceMappingURL=check.js.map