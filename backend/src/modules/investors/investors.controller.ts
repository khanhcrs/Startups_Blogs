import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { Public } from '../../common/auth/public.decorator';
import { PrismaService } from '../../common/database/prisma.service';
import { PageQueryDto } from '../../common/pagination/page-query.dto';

@Controller('investors')
export class InvestorsController {
  constructor(private readonly prisma: PrismaService) {}
  @Public() @Get() async list(@Query() query: PageQueryDto) {
    const where = { isPublic: true };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.investorProfile.findMany({ where, skip: (query.page - 1) * query.limit, take: query.limit, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }] }),
      this.prisma.investorProfile.count({ where }),
    ]);
    return { data, meta: { ...query, total, totalPages: Math.ceil(total / query.limit) } };
  }
  @Public() @Get(':slug') async detail(@Param('slug') slug: string) {
    const item = await this.prisma.investorProfile.findFirst({ where: { slug, isPublic: true }, include: { industries: { include: { taxonomy: true } }, fundingTypes: { include: { taxonomy: true } } } });
    if (!item) throw new NotFoundException('Investor profile not found');
    return item;
  }
}
