"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats() {
        const [totalUsers, totalBusinesses, pendingBusinesses, totalArticles] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.business.count(),
            this.prisma.business.count({ where: { status: 'PENDING' } }),
            this.prisma.article.count(),
        ]);
        return {
            totalUsers,
            totalBusinesses,
            pendingBusinesses,
            totalArticles
        };
    }
    async createProposal(entityType, entityId, changes, proposerId) {
        const proposal = await this.prisma.changeProposal.create({
            data: {
                entityType,
                entityId,
                proposedChanges: changes,
                proposerId,
                status: 'PENDING'
            }
        });
        let targetUserId = null;
        let title = '';
        if (entityType === 'BUSINESS') {
            const business = await this.prisma.business.findUnique({ where: { id: entityId } });
            if (business) {
                targetUserId = business.ownerId;
                title = `Admin proposed changes to your startup: ${business.name}`;
            }
        }
        else if (entityType === 'ARTICLE') {
            const article = await this.prisma.article.findUnique({ where: { id: entityId } });
            if (article) {
                targetUserId = article.authorId;
                title = `Admin proposed changes to your article: ${article.title}`;
            }
        }
        if (targetUserId) {
            await this.prisma.notification.create({
                data: {
                    userId: targetUserId,
                    title: 'New Edit Proposal',
                    message: title,
                    type: 'SYSTEM',
                    linkUrl: `/profile/proposals/${proposal.id}`
                }
            });
        }
        return proposal;
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map