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
exports.FundingOpportunitiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FundingOpportunitiesService = class FundingOpportunitiesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkBusinessOwnership(businessId, ownerId) {
        const business = await this.prisma.business.findUnique({ where: { id: businessId } });
        if (!business) {
            throw new common_1.NotFoundException(`Business with id ${businessId} not found`);
        }
        if (business.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('You do not have permission to modify funding opportunities for this business');
        }
        return business;
    }
    async create(businessId, createFundingOpportunityDto, ownerId) {
        await this.checkBusinessOwnership(businessId, ownerId);
        const slug = createFundingOpportunityDto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
        const dataToCreate = {
            ...createFundingOpportunityDto,
            slug,
            businessId,
        };
        if (dataToCreate.publishedAt)
            dataToCreate.publishedAt = new Date(dataToCreate.publishedAt);
        if (dataToCreate.deadline)
            dataToCreate.deadline = new Date(dataToCreate.deadline);
        return this.prisma.fundingOpportunity.create({
            data: dataToCreate,
        });
    }
    async findAll(businessId) {
        return this.prisma.fundingOpportunity.findMany({
            where: { businessId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async update(businessId, id, updateFundingOpportunityDto, ownerId) {
        await this.checkBusinessOwnership(businessId, ownerId);
        const opportunity = await this.prisma.fundingOpportunity.findFirst({
            where: { id, businessId },
        });
        if (!opportunity)
            throw new common_1.NotFoundException('Funding opportunity not found');
        const updateData = { ...updateFundingOpportunityDto };
        if (updateData.publishedAt)
            updateData.publishedAt = new Date(updateData.publishedAt);
        if (updateData.deadline)
            updateData.deadline = new Date(updateData.deadline);
        return this.prisma.fundingOpportunity.update({
            where: { id },
            data: updateData,
        });
    }
    async remove(businessId, id, ownerId) {
        await this.checkBusinessOwnership(businessId, ownerId);
        const opportunity = await this.prisma.fundingOpportunity.findFirst({
            where: { id, businessId },
        });
        if (!opportunity)
            throw new common_1.NotFoundException('Funding opportunity not found');
        return this.prisma.fundingOpportunity.delete({
            where: { id },
        });
    }
};
exports.FundingOpportunitiesService = FundingOpportunitiesService;
exports.FundingOpportunitiesService = FundingOpportunitiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FundingOpportunitiesService);
//# sourceMappingURL=funding-opportunities.service.js.map