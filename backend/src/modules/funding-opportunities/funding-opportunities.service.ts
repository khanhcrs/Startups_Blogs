import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BusinessPolicyService } from '../../common/authorization/business-policy.service';
import { PrismaService } from '../../common/database/prisma.service';
import { PageQueryDto } from '../../common/pagination/page-query.dto';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';

@Injectable()
export class FundingOpportunitiesService {
  constructor(private readonly prisma: PrismaService, private readonly policy: BusinessPolicyService) {}
  async list(query: PageQueryDto) {
    const where = { status: 'PUBLISHED' as const };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.fundingOpportunity.findMany({ where, include: { business: true }, skip: (query.page - 1) * query.limit, take: query.limit, orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }] }),
      this.prisma.fundingOpportunity.count({ where }),
    ]);
    return { data, meta: { ...query, total, totalPages: Math.ceil(total / query.limit) } };
  }
  async detail(slug: string) {
    const item = await this.prisma.fundingOpportunity.findFirst({ where: { slug, status: 'PUBLISHED' }, include: { business: true, industries: { include: { taxonomy: true } } } });
    if (!item) throw new NotFoundException('Funding opportunity not found');
    return item;
  }
  async create(userId: string, businessId: string, dto: CreateOpportunityDto) {
    await this.policy.assertCanEdit(userId, businessId);
    const min = dto.fundingAmountMin ? new Prisma.Decimal(dto.fundingAmountMin) : undefined;
    const max = dto.fundingAmountMax ? new Prisma.Decimal(dto.fundingAmountMax) : undefined;
    if (min && max && min.greaterThan(max)) throw new BadRequestException('Minimum amount must not exceed maximum amount');
    const base = dto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return this.prisma.fundingOpportunity.create({ data: {
      businessId, title: dto.title, slug: `${base}-${crypto.randomUUID().slice(0, 8)}`,
      shortDescription: dto.shortDescription, description: dto.description, useOfFunds: dto.useOfFunds,
      fundingPurpose: dto.fundingPurpose, fundingAmountMin: min, fundingAmountMax: max, currency: dto.currency,
      fundingTypes: dto.fundingTypeIds?.length ? { create: dto.fundingTypeIds.map((taxonomyId) => ({ taxonomyId })) } : undefined,
    } });
  }
}
