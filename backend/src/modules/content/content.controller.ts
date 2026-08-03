import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { ArticleType } from '@prisma/client';
import { Public } from '../../common/auth/public.decorator';
import { PrismaService } from '../../common/database/prisma.service';
import { PageQueryDto } from '../../common/pagination/page-query.dto';

@Controller()
export class ContentController {
  constructor(private readonly prisma: PrismaService) {}
  @Public() @Get('news') news(@Query() query: PageQueryDto) { return this.list(ArticleType.NEWS, query); }
  @Public() @Get('blogs') blogs(@Query() query: PageQueryDto) { return this.list(ArticleType.BLOG, query); }
  @Public() @Get('news/:slug') newsDetail(@Param('slug') slug: string) { return this.detail(ArticleType.NEWS, slug); }
  @Public() @Get('blogs/:slug') blogDetail(@Param('slug') slug: string) { return this.detail(ArticleType.BLOG, slug); }
  private async list(type: ArticleType, query: PageQueryDto) {
    const where = { type, status: 'PUBLISHED' as const };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.article.findMany({ where, skip: (query.page - 1) * query.limit, take: query.limit, orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }] }),
      this.prisma.article.count({ where }),
    ]);
    return { data, meta: { ...query, total, totalPages: Math.ceil(total / query.limit) } };
  }
  private async detail(type: ArticleType, slug: string) {
    const item = await this.prisma.article.findFirst({ where: { type, slug, status: 'PUBLISHED' }, include: { author: { select: { displayName: true } }, categories: { include: { taxonomy: true } } } });
    if (!item) throw new NotFoundException('Article not found');
    return item;
  }
}
