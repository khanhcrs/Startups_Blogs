import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isDeepStrictEqual } from 'node:util';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { createProposalPayload } from '../proposals/proposal-payload';

export type ProposalEntityType = 'BUSINESS' | 'ARTICLE';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  private getActualChanges(
    requestedChanges: object,
    currentEntity: object,
  ): {
    changes: Prisma.InputJsonObject;
    baseValues: Prisma.InputJsonObject;
  } {
    const changes: Record<string, Prisma.InputJsonValue | null> = {};
    const baseValues: Record<string, Prisma.InputJsonValue | null> = {};
    const current = currentEntity as Record<string, unknown>;

    for (const [field, value] of Object.entries(requestedChanges)) {
      if (value === undefined || isDeepStrictEqual(value, current[field])) {
        continue;
      }

      changes[field] = value as Prisma.InputJsonValue | null;
      baseValues[field] = current[field] as Prisma.InputJsonValue | null;
    }

    if (Object.keys(changes).length === 0) {
      throw new BadRequestException('Proposal does not contain any changes');
    }

    return { changes, baseValues };
  }

  async getStats() {
    const [totalUsers, totalBusinesses, pendingBusinesses, totalArticles] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.business.count(),
        this.prisma.business.count({ where: { status: 'PENDING' } }),
        this.prisma.article.count(),
      ]);

    return {
      totalUsers,
      totalBusinesses,
      pendingBusinesses,
      totalArticles,
    };
  }

  async createProposal(
    entityType: ProposalEntityType,
    entityId: string,
    changes: object,
    proposerId: string,
  ) {
    if (Object.keys(changes).length === 0) {
      throw new BadRequestException(
        'Proposal must contain at least one requested change',
      );
    }

    return this.prisma.$transaction(async (transaction) => {
      let targetUserId: string;
      let message: string;
      let currentEntity: object;

      if (entityType === 'BUSINESS') {
        const business = await transaction.business.findUnique({
          where: { id: entityId },
        });
        if (!business) {
          throw new NotFoundException(`Business with id ${entityId} not found`);
        }
        currentEntity = business;
        targetUserId = business.ownerId;
        message = `Admin proposed changes to your startup: ${business.name}`;
      } else {
        const article = await transaction.article.findUnique({
          where: { id: entityId },
        });
        if (!article) {
          throw new NotFoundException(`Article with id ${entityId} not found`);
        }
        currentEntity = article;
        targetUserId = article.authorId;
        message = `Admin proposed changes to your article: ${article.title}`;
      }

      const proposalChanges = this.getActualChanges(changes, currentEntity);

      const proposal = await transaction.changeProposal.create({
        data: {
          entityType,
          entityId,
          proposedChanges: createProposalPayload(
            proposalChanges.changes,
            proposalChanges.baseValues,
          ),
          proposerId,
          status: 'PENDING',
        },
      });

      await transaction.notification.create({
        data: {
          userId: targetUserId,
          title: 'New Edit Proposal',
          message,
          type: 'SYSTEM',
          linkUrl: `/proposals/${proposal.id}`,
        },
      });

      return { ...proposal, proposedChanges: proposalChanges.changes };
    });
  }
}
