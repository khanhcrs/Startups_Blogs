import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFundingOpportunityDto } from './dto/create-funding-opportunity.dto';
import { UpdateFundingOpportunityDto } from './dto/update-funding-opportunity.dto';

@Injectable()
export class FundingOpportunitiesService {
  constructor(private prisma: PrismaService) {}

  private async checkBusinessOwnership(businessId: string, ownerId: string) {
    const business = await this.prisma.business.findUnique({ where: { id: businessId } });
    if (!business) {
      throw new NotFoundException(`Business with id ${businessId} not found`);
    }
    if (business.ownerId !== ownerId) {
      throw new ForbiddenException('You do not have permission to modify funding opportunities for this business');
    }
    return business;
  }

  async create(businessId: string, createFundingOpportunityDto: CreateFundingOpportunityDto, ownerId: string) {
    await this.checkBusinessOwnership(businessId, ownerId);
    const slug = createFundingOpportunityDto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    
    const dataToCreate: any = {
      ...createFundingOpportunityDto,
      slug,
      businessId,
    };
    if (dataToCreate.publishedAt) dataToCreate.publishedAt = new Date(dataToCreate.publishedAt);
    if (dataToCreate.deadline) dataToCreate.deadline = new Date(dataToCreate.deadline);

    return this.prisma.fundingOpportunity.create({
      data: dataToCreate,
    });
  }

  async findAll(businessId: string) {
    return this.prisma.fundingOpportunity.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(businessId: string, id: string, updateFundingOpportunityDto: UpdateFundingOpportunityDto, ownerId: string) {
    await this.checkBusinessOwnership(businessId, ownerId);
    
    const opportunity = await this.prisma.fundingOpportunity.findFirst({
      where: { id, businessId },
    });
    if (!opportunity) throw new NotFoundException('Funding opportunity not found');

    const updateData: any = { ...updateFundingOpportunityDto };
    if (updateData.publishedAt) updateData.publishedAt = new Date(updateData.publishedAt);
    if (updateData.deadline) updateData.deadline = new Date(updateData.deadline);

    return this.prisma.fundingOpportunity.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(businessId: string, id: string, ownerId: string) {
    await this.checkBusinessOwnership(businessId, ownerId);
    
    const opportunity = await this.prisma.fundingOpportunity.findFirst({
      where: { id, businessId },
    });
    if (!opportunity) throw new NotFoundException('Funding opportunity not found');

    return this.prisma.fundingOpportunity.delete({
      where: { id },
    });
  }
}
