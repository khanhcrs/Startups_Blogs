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
exports.BusinessesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BusinessesService = class BusinessesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createBusinessDto, ownerId) {
        const slug = createBusinessDto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') +
            '-' +
            Date.now();
        return this.prisma.business.create({
            data: {
                ...createBusinessDto,
                slug,
                ownerId,
            },
        });
    }
    async findAll(skip = 0, take = 10) {
        return this.prisma.business.findMany({
            where: { status: 'APPROVED' },
            skip,
            take,
            include: { owner: { select: { id: true, name: true, avatarUrl: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findAllForAdmin(skip = 0, take = 10, status, search, stage, industry, startDate, endDate) {
        const where = {};
        if (status)
            where.status = status;
        if (stage)
            where.businessStage = stage;
        if (industry)
            where.industry = { contains: industry, mode: 'insensitive' };
        if (search)
            where.name = { contains: search, mode: 'insensitive' };
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) {
                where.createdAt.gte = new Date(startDate);
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                where.createdAt.lte = end;
            }
        }
        const [data, total] = await Promise.all([
            this.prisma.business.findMany({
                where,
                skip,
                take,
                include: {
                    owner: { select: { id: true, name: true, avatarUrl: true } },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.business.count({ where }),
        ]);
        return {
            data,
            meta: {
                total,
                totalPages: Math.ceil(total / take),
            },
        };
    }
    async findOneForAdmin(id) {
        const business = await this.prisma.business.findUnique({
            where: { id },
            include: {
                owner: {
                    select: { id: true, name: true, avatarUrl: true, email: true },
                },
                teamMembers: true,
                fundingRounds: true,
            },
        });
        if (!business) {
            throw new common_1.NotFoundException(`Business with id ${id} not found`);
        }
        return business;
    }
    async updateStatus(id, status) {
        const business = await this.prisma.business.findUnique({ where: { id } });
        if (!business) {
            throw new common_1.NotFoundException(`Business with id ${id} not found`);
        }
        return this.prisma.business.update({
            where: { id },
            data: { status },
        });
    }
    async findOneBySlug(slug) {
        const business = await this.prisma.business.findUnique({
            where: { slug },
            include: {
                owner: { select: { id: true, name: true, avatarUrl: true } },
                teamMembers: true,
                fundingRounds: true,
            },
        });
        if (!business) {
            throw new common_1.NotFoundException(`Business with slug ${slug} not found`);
        }
        return business;
    }
    async update(id, updateBusinessDto, ownerId) {
        const business = await this.prisma.business.findUnique({ where: { id } });
        if (!business) {
            throw new common_1.NotFoundException(`Business with id ${id} not found`);
        }
        if (business.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('You do not have permission to update this business');
        }
        return this.prisma.business.update({
            where: { id },
            data: updateBusinessDto,
        });
    }
    async remove(id, ownerId) {
        const business = await this.prisma.business.findUnique({ where: { id } });
        if (!business) {
            throw new common_1.NotFoundException(`Business with id ${id} not found`);
        }
        if (business.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('You do not have permission to delete this business');
        }
        return this.prisma.business.delete({
            where: { id },
        });
    }
    async updateAsAdmin(id, updateData) {
        const business = await this.prisma.business.findUnique({ where: { id } });
        if (!business) {
            throw new common_1.NotFoundException(`Business with id ${id} not found`);
        }
        if (updateData.foundedYear) {
            updateData.foundedYear = parseInt(updateData.foundedYear, 10);
        }
        return this.prisma.business.update({
            where: { id },
            data: updateData,
        });
    }
};
exports.BusinessesService = BusinessesService;
exports.BusinessesService = BusinessesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BusinessesService);
//# sourceMappingURL=businesses.service.js.map