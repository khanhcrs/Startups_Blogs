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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CommentsService = class CommentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(articleId, createCommentDto, authorId) {
        const article = await this.prisma.article.findUnique({ where: { id: articleId } });
        if (!article)
            throw new common_1.NotFoundException('Article not found');
        if (createCommentDto.parentId) {
            const parent = await this.prisma.comment.findUnique({ where: { id: createCommentDto.parentId } });
            if (!parent)
                throw new common_1.NotFoundException('Parent comment not found');
        }
        return this.prisma.comment.create({
            data: {
                content: createCommentDto.content,
                authorId,
                articleId,
                parentId: createCommentDto.parentId || null,
            },
            include: {
                author: { select: { id: true, name: true, avatarUrl: true } }
            }
        });
    }
    async findAllByArticle(articleId) {
        return this.prisma.comment.findMany({
            where: { articleId, parentId: null },
            orderBy: { createdAt: 'desc' },
            include: {
                author: { select: { id: true, name: true, avatarUrl: true } },
                replies: {
                    include: {
                        author: { select: { id: true, name: true, avatarUrl: true } }
                    },
                    orderBy: { createdAt: 'asc' }
                }
            }
        });
    }
    async update(id, content, authorId) {
        const comment = await this.prisma.comment.findUnique({ where: { id } });
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        if (comment.authorId !== authorId) {
            throw new common_1.ForbiddenException('You can only edit your own comments');
        }
        return this.prisma.comment.update({
            where: { id },
            data: { content },
        });
    }
    async removeAdmin(id) {
        const comment = await this.prisma.comment.findUnique({ where: { id } });
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        return this.prisma.comment.delete({ where: { id } });
    }
    async remove(id, requesterId) {
        const comment = await this.prisma.comment.findUnique({
            where: { id },
            include: { article: { select: { authorId: true } } }
        });
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        const isCommentAuthor = comment.authorId === requesterId;
        const isArticleAuthor = comment.article.authorId === requesterId;
        if (!isCommentAuthor && !isArticleAuthor) {
            throw new common_1.ForbiddenException('You are not allowed to delete this comment');
        }
        return this.prisma.comment.delete({ where: { id } });
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommentsService);
//# sourceMappingURL=comments.service.js.map