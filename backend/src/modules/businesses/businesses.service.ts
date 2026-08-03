import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PublicationStatus } from '@prisma/client';
import { PrismaService } from '../../common/database/prisma.service';
import { PageQueryDto } from '../../common/pagination/page-query.dto';
import { CreateBusinessDto } from './dto/create-business.dto';

@Injectable()
export class BusinessesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: PageQueryDto) {
    const where = { status: PublicationStatus.PUBLISHED };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.business.findMany({ where, skip: (query.page - 1) * query.limit, take: query.limit, orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }] }),
      this.prisma.business.count({ where }),
    ]);
    return { data, meta: { ...query, total, totalPages: Math.ceil(total / query.limit) } };
  }

  async findPublicBySlug(slug: string) {
    const business = await this.prisma.business.findFirst({
      where: { slug, status: PublicationStatus.PUBLISHED },
      include: { industries: { include: { taxonomy: true } }, opportunities: { where: { status: 'PUBLISHED' } } },
    });
    if (!business) throw new NotFoundException('Business not found');
    return business;
  }

  async create(userId: string, dto: CreateBusinessDto) {
    const slug = await this.uniqueSlug(dto.name);
    const { industryIds, ...profile } = dto;
    return this.prisma.$transaction(async (tx) => tx.business.create({
      data: {
        ...profile,
        slug,
        members: { create: { userId, role: 'OWNER' } },
        industries: industryIds?.length ? { create: industryIds.map((taxonomyId) => ({ taxonomyId })) } : undefined,
      },
    }));
  }

  private async uniqueSlug(name: string) {
    const base = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (!base) throw new ConflictException('Cannot generate business slug');
    const exists = await this.prisma.business.findUnique({ where: { slug: base }, select: { id: true } });
    return exists ? `${base}-${crypto.randomUUID().slice(0, 8)}` : base;
  }
}
