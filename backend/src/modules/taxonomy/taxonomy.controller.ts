import { Controller, Get, Param } from '@nestjs/common';
import { Public } from '../../common/auth/public.decorator';
import { PrismaService } from '../../common/database/prisma.service';

@Controller('taxonomies')
export class TaxonomyController {
  constructor(private readonly prisma: PrismaService) {}
  @Public() @Get(':group') list(@Param('group') group: string) {
    return this.prisma.taxonomyItem.findMany({ where: { group: group.toUpperCase(), isActive: true }, orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] });
  }
}
