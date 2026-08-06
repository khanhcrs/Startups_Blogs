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
exports.ProposalsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProposalsService = class ProposalsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMyProposals(userId) {
        const businesses = await this.prisma.business.findMany({
            where: { ownerId: userId },
            select: { id: true, name: true, slug: true }
        });
        const articles = await this.prisma.article.findMany({
            where: { authorId: userId },
            select: { id: true, title: true, slug: true }
        });
        const businessIds = businesses.map(b => b.id);
        const articleIds = articles.map(a => a.id);
        const proposals = await this.prisma.changeProposal.findMany({
            where: {
                OR: [
                    { entityType: 'BUSINESS', entityId: { in: businessIds } },
                    { entityType: 'ARTICLE', entityId: { in: articleIds } }
                ],
                status: 'PENDING'
            },
            orderBy: { createdAt: 'desc' },
            include: {
                proposer: { select: { id: true, name: true, email: true } }
            }
        });
        return proposals.map(p => {
            let entityName = 'Unknown';
            let entitySlug = '';
            if (p.entityType === 'BUSINESS') {
                const b = businesses.find(b => b.id === p.entityId);
                if (b) {
                    entityName = b.name;
                    entitySlug = b.slug;
                }
            }
            else if (p.entityType === 'ARTICLE') {
                const a = articles.find(a => a.id === p.entityId);
                if (a) {
                    entityName = a.title;
                    entitySlug = a.slug;
                }
            }
            return { ...p, entityName, entitySlug };
        });
    }
    async getProposal(id, userId) {
        const proposal = await this.prisma.changeProposal.findUnique({
            where: { id },
            include: {
                proposer: { select: { id: true, name: true } }
            }
        });
        if (!proposal)
            throw new common_1.NotFoundException('Proposal not found');
        let entityData = null;
        let isOwner = false;
        if (proposal.entityType === 'BUSINESS') {
            entityData = await this.prisma.business.findUnique({ where: { id: proposal.entityId } });
            if (entityData && entityData.ownerId === userId)
                isOwner = true;
        }
        else if (proposal.entityType === 'ARTICLE') {
            entityData = await this.prisma.article.findUnique({ where: { id: proposal.entityId } });
            if (entityData && entityData.authorId === userId)
                isOwner = true;
        }
        if (!isOwner)
            throw new common_1.ForbiddenException('You do not own this entity');
        return { proposal, currentData: entityData };
    }
    async approveProposal(id, userId) {
        const { proposal, currentData } = await this.getProposal(id, userId);
        if (proposal.status !== 'PENDING')
            throw new common_1.BadRequestException('Proposal is not pending');
        const changes = proposal.proposedChanges;
        if (proposal.entityType === 'BUSINESS') {
            await this.prisma.business.update({
                where: { id: proposal.entityId },
                data: changes
            });
        }
        else if (proposal.entityType === 'ARTICLE') {
            await this.prisma.article.update({
                where: { id: proposal.entityId },
                data: changes
            });
        }
        const updatedProposal = await this.prisma.changeProposal.update({
            where: { id },
            data: { status: 'APPROVED' }
        });
        return updatedProposal;
    }
    async rejectProposal(id, userId) {
        const { proposal } = await this.getProposal(id, userId);
        if (proposal.status !== 'PENDING')
            throw new common_1.BadRequestException('Proposal is not pending');
        const updatedProposal = await this.prisma.changeProposal.update({
            where: { id },
            data: { status: 'REJECTED' }
        });
        return updatedProposal;
    }
};
exports.ProposalsService = ProposalsService;
exports.ProposalsService = ProposalsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProposalsService);
//# sourceMappingURL=proposals.service.js.map