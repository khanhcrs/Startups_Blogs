import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProposalsService {
  constructor(private prisma: PrismaService) {}

  async getMyProposals(userId: string) {
    const businesses = await this.prisma.business.findMany({
      where: { ownerId: userId },
      select: { id: true, name: true, slug: true }
    });
    
    const articles = await this.prisma.article.findMany({
      where: { authorId: userId },
      select: { id: true, title: true, slug: true }
    });
    
    const businessIds = businesses.map(b => b.id);
    const articleIds = articles.map(a => a.id);
    
    const proposals = await this.prisma.changeProposal.findMany({
      where: {
        OR: [
          { entityType: 'BUSINESS', entityId: { in: businessIds } },
          { entityType: 'ARTICLE', entityId: { in: articleIds } }
        ],
        status: 'PENDING'
      },
      orderBy: { createdAt: 'desc' },
      include: {
        proposer: { select: { id: true, name: true, email: true } }
      }
    });

    return proposals.map(p => {
      let entityName = 'Unknown';
      let entitySlug = '';
      if (p.entityType === 'BUSINESS') {
        const b = businesses.find(b => b.id === p.entityId);
        if (b) { entityName = b.name; entitySlug = b.slug; }
      } else if (p.entityType === 'ARTICLE') {
        const a = articles.find(a => a.id === p.entityId);
        if (a) { entityName = a.title; entitySlug = a.slug; }
      }
      return { ...p, entityName, entitySlug };
    });
  }

  async getProposal(id: string, userId: string) {
    const proposal = await this.prisma.changeProposal.findUnique({
      where: { id },
      include: {
        proposer: { select: { id: true, name: true } }
      }
    });

    if (!proposal) throw new NotFoundException('Proposal not found');

    let entityData: any = null;
    let isOwner = false;

    if (proposal.entityType === 'BUSINESS') {
      entityData = await this.prisma.business.findUnique({ where: { id: proposal.entityId } });
      if (entityData && entityData.ownerId === userId) isOwner = true;
    } else if (proposal.entityType === 'ARTICLE') {
      entityData = await this.prisma.article.findUnique({ where: { id: proposal.entityId } });
      if (entityData && entityData.authorId === userId) isOwner = true;
    }

    if (!isOwner) throw new ForbiddenException('You do not own this entity');

    return { proposal, currentData: entityData };
  }

  async approveProposal(id: string, userId: string) {
    const { proposal, currentData } = await this.getProposal(id, userId);

    if (proposal.status !== 'PENDING') throw new BadRequestException('Proposal is not pending');

    const changes = proposal.proposedChanges as any;

    if (proposal.entityType === 'BUSINESS') {
      await this.prisma.business.update({
        where: { id: proposal.entityId },
        data: changes
      });
    } else if (proposal.entityType === 'ARTICLE') {
      await this.prisma.article.update({
        where: { id: proposal.entityId },
        data: changes
      });
    }

    const updatedProposal = await this.prisma.changeProposal.update({
      where: { id },
      data: { status: 'APPROVED' }
    });

    return updatedProposal;
  }

  async rejectProposal(id: string, userId: string) {
    const { proposal } = await this.getProposal(id, userId);

    if (proposal.status !== 'PENDING') throw new BadRequestException('Proposal is not pending');

    const updatedProposal = await this.prisma.changeProposal.update({
      where: { id },
      data: { status: 'REJECTED' }
    });

    return updatedProposal;
  }
}
