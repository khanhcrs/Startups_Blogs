import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { BusinessStatus } from './dto/update-business-status.dto';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import type { AdminBusinessQueryDto } from './dto/admin-business-query.dto';
import type { Prisma } from '@prisma/client';

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
}
