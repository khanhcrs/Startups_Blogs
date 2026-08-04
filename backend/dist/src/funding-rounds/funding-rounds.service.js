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
exports.FundingRoundsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FundingRoundsService = class FundingRoundsService {
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
            throw new common_1.ForbiddenException('You do not have permission to modify funding rounds for this business');
        }
        return business;
    }
    async create(businessId, createFundingRoundDto, ownerId) {
        await this.checkBusinessOwnership(businessId, ownerId);
        return this.prisma.fundingRound.create({
            data: {
                ...createFundingRoundDto,
                date: new Date(createFundingRoundDto.date),
                businessId,
            },
        });
    }
    async findAll(businessId) {
        return this.prisma.fundingRound.findMany({
            where: { businessId },
            orderBy: { date: 'desc' },
        });
    }
    async update(businessId, id, updateFundingRoundDto, ownerId) {
        await this.checkBusinessOwnership(businessId, ownerId);
        const fundingRound = await this.prisma.fundingRound.findFirst({
            where: { id, businessId },
        });
        if (!fundingRound)
            throw new common_1.NotFoundException('Funding round not found');
        const updateData = { ...updateFundingRoundDto };
        if (updateData.date) {
            updateData.date = new Date(updateData.date);
        }
        return this.prisma.fundingRound.update({
            where: { id },
            data: updateData,
        });
    }
    async remove(businessId, id, ownerId) {
        await this.checkBusinessOwnership(businessId, ownerId);
        const fundingRound = await this.prisma.fundingRound.findFirst({
            where: { id, businessId },
        });
        if (!fundingRound)
            throw new common_1.NotFoundException('Funding round not found');
        return this.prisma.fundingRound.delete({
            where: { id },
        });
    }
};
exports.FundingRoundsService = FundingRoundsService;
exports.FundingRoundsService = FundingRoundsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FundingRoundsService);
//# sourceMappingURL=funding-rounds.service.js.map