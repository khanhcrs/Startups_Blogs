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
exports.ArticlesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ArticlesService = class ArticlesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createArticleDto, authorId) {
        if (createArticleDto.businessId) {
            const business = await this.prisma.business.findUnique({
                where: { id: createArticleDto.businessId }
            });
            if (!business) {
                throw new common_1.NotFoundException('Business not found');
            }
            if (business.ownerId !== authorId) {
                throw new common_1.ForbiddenException('You cannot post an article on behalf of a business you do not own.');
            }
        }
        const slug = createArticleDto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
        return this.prisma.article.create({
            data: {
                ...createArticleDto,
                slug,
                authorId,
            },
        });
    }
    async findAll(query) {
        const { category, businessId, skip = 0, take = 10 } = query;
        const where = { status: 'PUBLISHED' };
        if (category)
            where.category = category;
        if (businessId)
            where.businessId = businessId;
        return this.prisma.article.findMany({
            where,
            skip,
            take,
            orderBy: { id: 'desc' },
            include: {
                author: { select: { id: true, name: true, avatarUrl: true } },
                business: { select: { id: true, name: true, logoUrl: true, slug: true } },
            }
        });
    }
    async findOneBySlug(slug) {
        const article = await this.prisma.article.findUnique({
            where: { slug },
            include: {
                author: { select: { id: true, name: true, avatarUrl: true } },
                business: { select: { id: true, name: true, logoUrl: true, slug: true } },
            }
        });
        if (!article)
            throw new common_1.NotFoundException('Article not found');
        this.prisma.article.update({
            where: { id: article.id },
            data: { viewCount: { increment: 1 } }
        }).catch(console.error);
        return article;
    }
    async update(id, updateArticleDto, authorId) {
        const article = await this.prisma.article.findUnique({ where: { id } });
        if (!article)
            throw new common_1.NotFoundException('Article not found');
        if (article.authorId !== authorId) {
            throw new common_1.ForbiddenException('You can only update your own articles');
        }
        if (updateArticleDto.businessId && updateArticleDto.businessId !== article.businessId) {
            const business = await this.prisma.business.findUnique({
                where: { id: updateArticleDto.businessId }
            });
            if (!business || business.ownerId !== authorId) {
                throw new common_1.ForbiddenException('You cannot assign this article to a business you do not own.');
            }
        }
        return this.prisma.article.update({
            where: { id },
            data: updateArticleDto,
        });
    }
    async remove(id, authorId) {
        const article = await this.prisma.article.findUnique({ where: { id } });
        if (!article)
            throw new common_1.NotFoundException('Article not found');
        if (article.authorId !== authorId) {
            throw new common_1.ForbiddenException('You can only delete your own articles');
        }
        return this.prisma.article.delete({
            where: { id },
        });
    }
};
exports.ArticlesService = ArticlesService;
exports.ArticlesService = ArticlesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ArticlesService);
//# sourceMappingURL=articles.service.js.map