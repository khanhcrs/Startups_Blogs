import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { BusinessStatus } from './dto/update-business-status.dto';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import {
  CreateRaiseCapitalDto,
  TeamMemberItemDto,
} from './dto/create-raise-capital.dto';
import type { AdminBusinessQueryDto } from './dto/admin-business-query.dto';
import type { Prisma, FundingOpportunity } from '@prisma/client';

@Injectable()
export class BusinessesService {
  constructor(private prisma: PrismaService) {}

  async create(createBusinessDto: CreateBusinessDto, ownerId: string) {
    const slug =
      createBusinessDto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') +
      '-' +
      Date.now();

    return this.prisma.business.create({
      data: {
        ...createBusinessDto,
        slug,
        ownerId,
      },
    });
  }

  async findAll(skip: number = 0, take: number = 10) {
    return this.prisma.business.findMany({
      where: { status: 'APPROVED' },
      skip,
      take,
      include: { owner: { select: { id: true, name: true, avatarUrl: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllForAdmin(query: AdminBusinessQueryDto) {
    const {
      skip = 0,
      take = 10,
      status,
      search,
      stage,
      industry,
      startDate,
      endDate,
    } = query;
    const where: Prisma.BusinessWhereInput = {};
    if (status) where.status = status;
    if (stage) where.businessStage = stage;
    if (industry) where.industry = { contains: industry, mode: 'insensitive' };
    if (search) where.name = { contains: search, mode: 'insensitive' };

    if (startDate || endDate) {
      const createdAt: Prisma.DateTimeFilter = {};
      if (startDate) {
        createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        createdAt.lte = end;
      }
      where.createdAt = createdAt;
    }

    const [data, total] = await Promise.all([
      this.prisma.business.findMany({
        where,
        skip,
        take,
        include: {
          owner: { select: { id: true, name: true, avatarUrl: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.business.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async findOneForAdmin(id: string) {
    const business = await this.prisma.business.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, name: true, avatarUrl: true, email: true },
        },
        teamMembers: true,
        fundingRounds: true,
      },
    });
    if (!business) {
      throw new NotFoundException(`Business with id ${id} not found`);
    }
    return business;
  }

  async updateStatus(id: string, status: BusinessStatus) {
    const business = await this.prisma.business.findUnique({ where: { id } });
    if (!business) {
      throw new NotFoundException(`Business with id ${id} not found`);
    }

    return this.prisma.business.update({
      where: { id },
      data: { status },
    });
  }

  async findOneBySlug(slug: string) {
    const business = await this.prisma.business.findFirst({
      where: { slug, status: 'APPROVED' },
      include: {
        owner: { select: { id: true, name: true, avatarUrl: true } },
        teamMembers: true,
        fundingRounds: true,
      },
    });
    if (!business) {
      throw new NotFoundException(`Business with slug ${slug} not found`);
    }
    return business;
  }

  async update(
    id: string,
    updateBusinessDto: UpdateBusinessDto,
    ownerId: string,
  ) {
    const business = await this.prisma.business.findUnique({ where: { id } });
    if (!business) {
      throw new NotFoundException(`Business with id ${id} not found`);
    }
    if (business.ownerId !== ownerId) {
      throw new ForbiddenException(
        'You do not have permission to update this business',
      );
    }

    return this.prisma.business.update({
      where: { id },
      data: updateBusinessDto,
    });
  }

  async remove(id: string, ownerId: string) {
    const business = await this.prisma.business.findUnique({ where: { id } });
    if (!business) {
      throw new NotFoundException(`Business with id ${id} not found`);
    }
    if (business.ownerId !== ownerId) {
      throw new ForbiddenException(
        'You do not have permission to delete this business',
      );
    }

    return this.prisma.business.delete({
      where: { id },
    });
  }

  async getSavedBusinessIds(userId: string): Promise<string[]> {
    const records = await this.prisma.savedBusiness.findMany({
      where: { userId },
      select: { businessId: true },
    });
    return records.map((r) => r.businessId);
  }

  async getFollowedBusinessIds(userId: string): Promise<string[]> {
    const records = await this.prisma.businessFollow.findMany({
      where: { userId },
      select: { businessId: true },
    });
    return records.map((r) => r.businessId);
  }

  private async resolveBusiness(identifier: string) {
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        identifier,
      );
    const business = await this.prisma.business.findFirst({
      where: isUuid ? { id: identifier } : { slug: identifier },
    });
    if (!business) {
      throw new NotFoundException(`Business '${identifier}' not found`);
    }
    return business;
  }

  async getRelationship(identifier: string, userId?: string) {
    const business = await this.resolveBusiness(identifier);
    if (!userId) {
      return {
        saved: false,
        following: false,
        savedCount: business.savedCount,
      };
    }
    const [savedRecord, followRecord] = await Promise.all([
      this.prisma.savedBusiness.findUnique({
        where: { userId_businessId: { userId, businessId: business.id } },
      }),
      this.prisma.businessFollow.findUnique({
        where: { userId_businessId: { userId, businessId: business.id } },
      }),
    ]);
    return {
      saved: !!savedRecord,
      following: !!followRecord,
      savedCount: business.savedCount,
    };
  }

  async saveBusiness(identifier: string, userId: string) {
    const business = await this.resolveBusiness(identifier);
    const existing = await this.prisma.savedBusiness.findUnique({
      where: { userId_businessId: { userId, businessId: business.id } },
    });
    if (!existing) {
      await this.prisma.$transaction([
        this.prisma.savedBusiness.create({
          data: { userId, businessId: business.id },
        }),
        this.prisma.business.update({
          where: { id: business.id },
          data: { savedCount: { increment: 1 } },
        }),
      ]);
    }
    return { saved: true };
  }

  async unsaveBusiness(identifier: string, userId: string) {
    const business = await this.resolveBusiness(identifier);
    const existing = await this.prisma.savedBusiness.findUnique({
      where: { userId_businessId: { userId, businessId: business.id } },
    });
    if (existing) {
      await this.prisma.$transaction([
        this.prisma.savedBusiness.delete({
          where: { id: existing.id },
        }),
        this.prisma.business.update({
          where: { id: business.id },
          data: {
            savedCount: {
              decrement: Math.max(0, business.savedCount > 0 ? 1 : 0),
            },
          },
        }),
      ]);
    }
    return { saved: false };
  }

  async followBusiness(identifier: string, userId: string) {
    const business = await this.resolveBusiness(identifier);
    const existing = await this.prisma.businessFollow.findUnique({
      where: { userId_businessId: { userId, businessId: business.id } },
    });
    if (!existing) {
      await this.prisma.businessFollow.create({
        data: { userId, businessId: business.id },
      });
    }
    return { following: true };
  }

  async unfollowBusiness(identifier: string, userId: string) {
    const business = await this.resolveBusiness(identifier);
    const existing = await this.prisma.businessFollow.findUnique({
      where: { userId_businessId: { userId, businessId: business.id } },
    });
    if (existing) {
      await this.prisma.businessFollow.delete({
        where: { id: existing.id },
      });
    }
    return { following: false };
  }

  async getTaxonomy() {
    const businesses = await this.prisma.business.findMany({
      select: { industry: true, businessType: true, businessStage: true },
    });
    const industries = Array.from(
      new Set(businesses.map((b) => b.industry).filter(Boolean)),
    ).sort();
    const businessTypes = Array.from(
      new Set(businesses.map((b) => b.businessType).filter(Boolean)),
    ).sort();
    const canonicalStages = [
      'Idea',
      'Early Stage',
      'Operating',
      'Growing',
      'Expansion',
      'Mature',
    ];
    return {
      industries:
        industries.length > 0
          ? industries
          : [
              'Fintech',
              'EdTech',
              'HealthTech',
              'Thương mại điện tử',
              'Logistics',
              'PropTech',
              'SaaS',
              'Nông nghiệp sạch',
              'Blockchain',
              'Công nghệ AI',
            ],
      businessTypes:
        businessTypes.length > 0
          ? businessTypes
          : [
              'Startup',
              'Small Business',
              'Family Business',
              'Online Business',
              'Franchise',
              'Cooperative',
              'Social Enterprise',
            ],
      stages: canonicalStages,
    };
  }

  async createRaiseCapitalSubmission(
    dto: CreateRaiseCapitalDto,
    ownerId: string,
  ) {
    const slug =
      dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    return this.prisma.$transaction(async (tx) => {
      const business = await tx.business.create({
        data: {
          name: dto.name,
          slug,
          description: dto.description,
          industry: dto.industry,
          businessStage: dto.businessStage,
          businessType: dto.businessType,
          location: dto.location,
          website: dto.website || null,
          detailedOverview: dto.detailedOverview || null,
          businessModel: dto.businessModel || null,
          productsOrServices: dto.productsOrServices || null,
          employeeRange: dto.employeeRange || null,
          status: 'PENDING',
          ownerId,
        },
      });

      if (Array.isArray(dto.teamMembers) && dto.teamMembers.length > 0) {
        await tx.teamMember.createMany({
          data: dto.teamMembers.map((tm: TeamMemberItemDto) => ({
            name: tm.name,
            role: tm.role,
            bio: tm.bio || null,
            businessId: business.id,
          })),
        });
      }

      let fundingOpportunity: FundingOpportunity | null = null;
      if (dto.fundingAmountMin || dto.fundingAmountMax || dto.fundingPurpose) {
        const oppSlug = `${slug}-funding-${Date.now()}`;
        fundingOpportunity = await tx.fundingOpportunity.create({
          data: {
            slug: oppSlug,
            title: `Huy động vốn - ${business.name}`,
            shortDescription: dto.description,
            detailedOverview: dto.detailedOverview || dto.description,
            fundingAmountMin: dto.fundingAmountMin || 100000000,
            fundingAmountMax: dto.fundingAmountMax || 1000000000,
            currency: dto.currency || 'VND',
            fundingPurpose: dto.fundingPurpose || 'Kinh doanh & Phát triển',
            fundingType: 'Equity',
            status: 'Pending Review',
            businessId: business.id,
          },
        });
      }

      return {
        success: true,
        businessId: business.id,
        slug: business.slug,
        status: 'PENDING_REVIEW',
        business,
        fundingOpportunity,
      };
    });
  }
}
