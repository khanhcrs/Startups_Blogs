import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [totalUsers, totalBusinesses, pendingBusinesses, totalArticles] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.business.count(),
      this.prisma.business.count({ where: { status: 'PENDING' } }),
      this.prisma.article.count(),
    ]);

    return {
      totalUsers,
      totalBusinesses,
      pendingBusinesses,
      totalArticles
    };
  }

  async createProposal(entityType: string, entityId: string, changes: any, proposerId: string) {
    // 1. Lưu ChangeProposal
    const proposal = await this.prisma.changeProposal.create({
      data: {
        entityType,
        entityId,
        proposedChanges: changes,
        proposerId,
        status: 'PENDING'
      }
    });

    // 2. Tự động tạo Notification cho Owner của Business/Article
    let targetUserId: string | null = null;
    let title = '';
    
    if (entityType === 'BUSINESS') {
      const business = await this.prisma.business.findUnique({ where: { id: entityId } });
      if (business) {
        targetUserId = business.ownerId;
        title = `Admin proposed changes to your startup: ${business.name}`;
      }
    } else if (entityType === 'ARTICLE') {
      const article = await this.prisma.article.findUnique({ where: { id: entityId } });
      if (article) {
        targetUserId = article.authorId;
        title = `Admin proposed changes to your article: ${article.title}`;
      }
    }

    if (targetUserId) {
      await this.prisma.notification.create({
        data: {
          userId: targetUserId,
          title: 'New Edit Proposal',
          message: title,
          type: 'SYSTEM',
          linkUrl: `/profile/proposals/${proposal.id}` // Link giả định
        }
      });
    }

    return proposal;
  }
}
