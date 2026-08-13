import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFundingRoundDto } from './dto/create-funding-round.dto';
import { UpdateFundingRoundDto } from './dto/update-funding-round.dto';

@Injectable()
export class FundingRoundsService {
  constructor(private prisma: PrismaService) {}

  private async checkBusinessOwnership(businessId: string, ownerId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });
    if (!business) {
      throw new NotFoundException(`Business with id ${businessId} not found`);
    }
    if (business.ownerId !== ownerId) {
      throw new ForbiddenException(
        'You do not have permission to modify funding rounds for this business',
      );
    }
    return business;
  }

  async create(
    businessId: string,
    createFundingRoundDto: CreateFundingRoundDto,
    ownerId: string,
  ) {
    await this.checkBusinessOwnership(businessId, ownerId);
    return this.prisma.fundingRound.create({
      data: {
        ...createFundingRoundDto,
        date: new Date(createFundingRoundDto.date),
        businessId,
      },
    });
  }

  async findAll(businessId: string) {
    return this.prisma.fundingRound.findMany({
      where: { businessId },
      orderBy: { date: 'desc' },
    });
  }

  async update(
    businessId: string,
    id: string,
    updateFundingRoundDto: UpdateFundingRoundDto,
    ownerId: string,
  ) {
    await this.checkBusinessOwnership(businessId, ownerId);

    const fundingRound = await this.prisma.fundingRound.findFirst({
      where: { id, businessId },
    });
    if (!fundingRound) throw new NotFoundException('Funding round not found');

    const { date, ...updateData } = updateFundingRoundDto;

    return this.prisma.fundingRound.update({
      where: { id },
      data: {
        ...updateData,
        ...(date && { date: new Date(date) }),
      },
    });
  }

  async remove(businessId: string, id: string, ownerId: string) {
    await this.checkBusinessOwnership(businessId, ownerId);

    const fundingRound = await this.prisma.fundingRound.findFirst({
      where: { id, businessId },
    });
    if (!fundingRound) throw new NotFoundException('Funding round not found');

    return this.prisma.fundingRound.delete({
      where: { id },
    });
  }
}
