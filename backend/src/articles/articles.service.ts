import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async create(createArticleDto: CreateArticleDto, authorId: string) {
    if (createArticleDto.category === 'News') {
      const user = await this.prisma.user.findUnique({ where: { id: authorId } });
      if (user?.role !== 'ADMIN' && user?.role !== 'MODERATOR') {
        throw new ForbiddenException('Only admins or moderators can post News');
      }
    }

    if (createArticleDto.businessId) {
      // Option A Secure check: Ensure author owns this business
      const business = await this.prisma.business.findUnique({
        where: { id: createArticleDto.businessId }
      });
      if (!business) {
        throw new NotFoundException('Business not found');
      }
      if (business.ownerId !== authorId) {
        throw new ForbiddenException('You cannot post an article on behalf of a business you do not own.');
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

  async findMyArticles(authorId: string) {
    return this.prisma.article.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
      include: {
        business: { select: { id: true, name: true, logoUrl: true, slug: true } },
      }
    });
  }

  async findAll(query: { category?: string; businessId?: string; skip?: number; take?: number }) {
    const { category, businessId, skip = 0, take = 10 } = query;
    const where: any = { status: 'PUBLISHED' };

    if (category) where.category = category;
    if (businessId) where.businessId = businessId;

    return this.prisma.article.findMany({
      where,
      skip,
      take,
      orderBy: { id: 'desc' }, // Should optimally sort by a createdAt if it exists, otherwise id
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        business: { select: { id: true, name: true, logoUrl: true, slug: true } },
      }
    });
  }

  async findOne(idOrSlug: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    
    const article = await this.prisma.article.findFirst({
      where: isUuid ? { id: idOrSlug } : { slug: idOrSlug },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        business: { select: { id: true, name: true, logoUrl: true, slug: true } },
      }
    });

    if (!article) throw new NotFoundException('Article not found');

    // Tăng lượt view (Fire and forget, no need to await for performance)
    this.prisma.article.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } }
    }).catch(console.error);

    return article;
  }

  async update(id: string, updateArticleDto: UpdateArticleDto, authorId: string) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) throw new NotFoundException('Article not found');
    if (article.authorId !== authorId) {
      throw new ForbiddenException('You can only update your own articles');
    }

    if (updateArticleDto.category === 'News') {
      const user = await this.prisma.user.findUnique({ where: { id: authorId } });
      if (user?.role !== 'ADMIN' && user?.role !== 'MODERATOR') {
        throw new ForbiddenException('Only admins or moderators can categorize an article as News');
      }
    }

    if (updateArticleDto.businessId && updateArticleDto.businessId !== article.businessId) {
      const business = await this.prisma.business.findUnique({
        where: { id: updateArticleDto.businessId }
      });
      if (!business || business.ownerId !== authorId) {
        throw new ForbiddenException('You cannot assign this article to a business you do not own.');
      }
    }

    return this.prisma.article.update({
      where: { id },
      data: updateArticleDto,
    });
  }

  async remove(id: string, authorId: string) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) throw new NotFoundException('Article not found');
    if (article.authorId !== authorId) {
      throw new ForbiddenException('You can only delete your own articles');
    }

    return this.prisma.article.delete({
      where: { id },
    });
  }
}
