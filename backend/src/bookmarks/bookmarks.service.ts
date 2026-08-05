import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarksService {
  constructor(private prisma: PrismaService) {}

  async create(articleId: string, userId: string) {
    const article = await this.prisma.article.findUnique({ where: { id: articleId } });
    if (!article) throw new NotFoundException('Article not found');

    const existing = await this.prisma.bookmark.findUnique({
      where: { userId_articleId: { userId, articleId } }
    });

    if (existing) {
      throw new ConflictException('You have already bookmarked this article');
    }

    return this.prisma.bookmark.create({
      data: { userId, articleId }
    });
  }

  async remove(articleId: string, userId: string) {
    const existing = await this.prisma.bookmark.findUnique({
      where: { userId_articleId: { userId, articleId } }
    });

    if (!existing) {
      throw new NotFoundException('Bookmark not found');
    }

    return this.prisma.bookmark.delete({
      where: { userId_articleId: { userId, articleId } }
    });
  }

  async findAll(userId: string) {
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
}
