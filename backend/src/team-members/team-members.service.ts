import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';

@Injectable()
export class TeamMembersService {
  constructor(private prisma: PrismaService) {}

  private async checkBusinessOwnership(businessId: string, ownerId: string) {
    const business = await this.prisma.business.findUnique({ where: { id: businessId } });
    if (!business) {
      throw new NotFoundException(`Business with id ${businessId} not found`);
    }
    if (business.ownerId !== ownerId) {
      throw new ForbiddenException('You do not have permission to modify team members for this business');
    }
    return business;
  }

  async create(businessId: string, createTeamMemberDto: CreateTeamMemberDto, ownerId: string) {
    await this.checkBusinessOwnership(businessId, ownerId);
    return this.prisma.teamMember.create({
      data: {
        ...createTeamMemberDto,
        businessId,
      },
    });
  }

  async findAll(businessId: string) {
    return this.prisma.teamMember.findMany({
      where: { businessId },
    });
  }

  async update(businessId: string, id: string, updateTeamMemberDto: UpdateTeamMemberDto, ownerId: string) {
    await this.checkBusinessOwnership(businessId, ownerId);
    
    const teamMember = await this.prisma.teamMember.findFirst({
      where: { id, businessId },
    });
    if (!teamMember) throw new NotFoundException('Team member not found');

    return this.prisma.teamMember.update({
      where: { id },
      data: updateTeamMemberDto,
    });
  }

  async remove(businessId: string, id: string, ownerId: string) {
    await this.checkBusinessOwnership(businessId, ownerId);
    
    const teamMember = await this.prisma.teamMember.findFirst({
      where: { id, businessId },
    });
    if (!teamMember) throw new NotFoundException('Team member not found');

    return this.prisma.teamMember.delete({
      where: { id },
    });
  }
}
