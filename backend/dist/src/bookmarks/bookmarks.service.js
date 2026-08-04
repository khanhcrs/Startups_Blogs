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
exports.BookmarksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BookmarksService = class BookmarksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(articleId, userId) {
        const article = await this.prisma.article.findUnique({ where: { id: articleId } });
        if (!article)
            throw new common_1.NotFoundException('Article not found');
        const existing = await this.prisma.bookmark.findUnique({
            where: { userId_articleId: { userId, articleId } }
        });
        if (existing) {
            throw new common_1.ConflictException('You have already bookmarked this article');
        }
        return this.prisma.bookmark.create({
            data: { userId, articleId }
        });
    }
    async remove(articleId, userId) {
        const existing = await this.prisma.bookmark.findUnique({
            where: { userId_articleId: { userId, articleId } }
        });
        if (!existing) {
            throw new common_1.NotFoundException('Bookmark not found');
        }
        return this.prisma.bookmark.delete({
            where: { userId_articleId: { userId, articleId } }
        });
    }
    async findAll(userId) {
        return this.prisma.bookmark.findMany({
            where: { userId },
            include: {
                article: {
                    select: { id: true, title: true, slug: true, summary: true, createdAt: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
};
exports.BookmarksService = BookmarksService;
exports.BookmarksService = BookmarksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookmarksService);
//# sourceMappingURL=bookmarks.service.js.map