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

  async findAllForAdmin(skip: number = 0, take: number = 10, status?: string) {
    const where = status ? { status } : {};
    return this.prisma.business.findMany({
      where,
      skip,
      take,
      include: { owner: { select: { id: true, name: true, avatarUrl: true } } },
      orderBy: { createdAt: 'desc' },
    });
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
      include: { owner: { select: { id: true, name: true, avatarUrl: true } } },
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
}
