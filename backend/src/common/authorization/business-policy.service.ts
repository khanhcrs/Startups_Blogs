import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class BusinessPolicyService {
  constructor(private readonly prisma: PrismaService) {}

  async assertCanEdit(userId: string, businessId: string) {
    const membership = await this.prisma.businessMember.findUnique({
      where: { businessId_userId: { businessId, userId } },
    });
    if (!membership?.isActive || !['OWNER', 'EDITOR'].includes(membership.role)) {
      throw new ForbiddenException('You cannot edit this business');
    }
  }
}
