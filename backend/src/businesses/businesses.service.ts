import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Injectable()
export class BusinessesService {
  constructor(private prisma: PrismaService) {}

  async create(createBusinessDto: CreateBusinessDto, ownerId: string) {
    const slug = createBusinessDto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    
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

  async findAllForAdmin(
    skip: number = 0, 
    take: number = 10, 
    status?: string, 
    search?: string, 
    stage?: string, 
    industry?: string,
    startDate?: string,
    endDate?: string
  ) {
    const where: any = {};
    if (status) where.status = status;
    if (stage) where.businessStage = stage;
    if (industry) where.industry = { contains: industry, mode: 'insensitive' };
    if (search) where.name = { contains: search, mode: 'insensitive' };
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }
    
    const [data, total] = await Promise.all([
      this.prisma.business.findMany({
        where,
        skip,
        take,
        include: { owner: { select: { id: true, name: true, avatarUrl: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.business.count({ where })
    ]);

    return {
      data,
      meta: {
        total,
        totalPages: Math.ceil(total / take)
      }
    };
  }

  async findOneForAdmin(id: string) {
    const business = await this.prisma.business.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, avatarUrl: true, email: true } },
        teamMembers: true,
        fundingRounds: true
      },
    });
    if (!business) {
      throw new NotFoundException(`Business with id ${id} not found`);
    }
    return business;
  }

  async updateStatus(id: string, status: string) {
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
    const business = await this.prisma.business.findUnique({
      where: { slug },
      include: { 
        owner: { select: { id: true, name: true, avatarUrl: true } },
        teamMembers: true,
        fundingRounds: true
      },
    });
    if (!business) {
      throw new NotFoundException(`Business with slug ${slug} not found`);
    }
    return business;
  }

  async update(id: string, updateBusinessDto: UpdateBusinessDto, ownerId: string) {
    const business = await this.prisma.business.findUnique({ where: { id } });
    if (!business) {
      throw new NotFoundException(`Business with id ${id} not found`);
    }
    if (business.ownerId !== ownerId) {
      throw new ForbiddenException('You do not have permission to update this business');
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
      throw new ForbiddenException('You do not have permission to delete this business');
    }

    return this.prisma.business.delete({
      where: { id },
    });
  }

  async updateAsAdmin(id: string, updateData: any) {
    const business = await this.prisma.business.findUnique({ where: { id } });
    if (!business) {
      throw new NotFoundException(`Business with id ${id} not found`);
    }

    // Ensure foundedYear is a number if it's provided as string
    if (updateData.foundedYear) {
      updateData.foundedYear = parseInt(updateData.foundedYear, 10);
    }

    return this.prisma.business.update({
      where: { id },
      data: updateData,
    });
  }
}
