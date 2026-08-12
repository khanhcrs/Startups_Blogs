import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, type ValidationError } from 'class-validator';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateArticleDto } from '../articles/dto/update-article.dto';
import { UpdateBusinessDto } from '../businesses/dto/update-business.dto';
import {
  parseProposalPayload,
  publicProposalChanges,
  type ProposalPayload,
} from './proposal-payload';

const createFieldAllowlist = <T extends object>(
  fields: readonly Extract<keyof T, string>[],
): ReadonlySet<string> => new Set(fields);

const BUSINESS_CHANGE_FIELDS = createFieldAllowlist<UpdateBusinessDto>([
  'name',
  'legalName',
  'description',
  'detailedOverview',
  'businessType',
  'businessStage',
  'industry',
  'location',
  'website',
  'logoUrl',
  'coverUrl',
  'foundedYear',
  'employeeRange',
  'businessModel',
  'productsOrServices',
  'mainMarket',
]);

const ARTICLE_CHANGE_FIELDS = createFieldAllowlist<UpdateArticleDto>([
  'title',
  'summary',
  'content',
  'category',
  'status',
  'businessId',
  'coverImage',
  'tags',
]);

type ProposalClient = Pick<
  Prisma.TransactionClient,
  'article' | 'business' | 'changeProposal' | 'user'
>;
type ProposalDecision = 'APPROVED' | 'REJECTED';
type DtoConstructor<T extends object> = new () => T;

const isJsonObject = (value: Prisma.JsonValue): value is Prisma.JsonObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const validationMessages = (errors: ValidationError[]): string[] =>
  errors.flatMap((error) => [
    ...Object.values(error.constraints ?? {}),
    ...validationMessages(error.children ?? []),
  ]);

const isNewsCategory = (category?: string) =>
  category?.trim().toUpperCase() === 'NEWS';

@Injectable()
export class ProposalsService {
  constructor(private prisma: PrismaService) {}

  private async validateChanges<T extends object>(
    changes: Prisma.JsonValue,
    dtoClass: DtoConstructor<T>,
    allowedFields: ReadonlySet<string>,
  ): Promise<T> {
    if (!isJsonObject(changes) || Object.keys(changes).length === 0) {
      throw new BadRequestException(
        'Proposal must contain a non-empty object of changes',
      );
    }

    const unknownFields = Object.keys(changes).filter(
      (field) => !allowedFields.has(field),
    );
    if (unknownFields.length > 0) {
      throw new BadRequestException({
        message: 'Proposal contains fields that cannot be changed',
        details: unknownFields,
      });
    }

    const nullFields = Object.entries(changes)
      .filter(([, value]) => value === null)
      .map(([field]) => field);
    if (nullFields.length > 0) {
      throw new BadRequestException({
        message:
          'Proposal contains null values that are not allowed by the DTO',
        details: nullFields,
      });
    }

    const dto = plainToInstance(dtoClass, changes);
    const errors = await validate(dto, {
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      whitelist: true,
    });

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Proposal contains invalid changes',
        details: validationMessages(errors),
      });
    }

    return dto;
  }

  private getConcurrencyPayload(
    proposedChanges: Prisma.JsonValue,
  ): ProposalPayload {
    const payload = parseProposalPayload(proposedChanges);
    if (!payload) {
      if (
        isJsonObject(proposedChanges) &&
        proposedChanges.schemaVersion === 1
      ) {
        throw new BadRequestException(
          'Proposal concurrency metadata is invalid',
        );
      }
      throw new ConflictException(
        'This proposal predates conflict protection and must be recreated',
      );
    }

    const changeFields = Object.keys(payload.changes).sort();
    const baseFields = Object.keys(payload.baseValues).sort();
    if (
      changeFields.length === 0 ||
      changeFields.length !== baseFields.length ||
      changeFields.some((field, index) => field !== baseFields[index])
    ) {
      throw new BadRequestException('Proposal concurrency metadata is invalid');
    }

    return payload;
  }

  private concurrencyConditions(
    baseValues: Prisma.JsonObject,
  ): Record<string, unknown>[] {
    return Object.entries(baseValues).map(([field, value]) =>
      Array.isArray(value)
        ? { [field]: { equals: value } }
        : { [field]: value },
    );
  }

  private async applyBusinessChanges(
    client: ProposalClient,
    entityId: string,
    changes: UpdateBusinessDto,
    baseValues: Prisma.JsonObject,
  ) {
    const result = await client.business.updateMany({
      where: {
        id: entityId,
        AND: this.concurrencyConditions(baseValues),
      },
      data: changes,
    });
    if (result.count !== 1) {
      throw new ConflictException(
        'Business changed after this proposal was created',
      );
    }
  }

  private async applyArticleChanges(
    client: ProposalClient,
    entityId: string,
    changes: UpdateArticleDto,
    baseValues: Prisma.JsonObject,
  ) {
    const result = await client.article.updateMany({
      where: {
        id: entityId,
        AND: this.concurrencyConditions(baseValues),
      },
      data: changes,
    });
    if (result.count !== 1) {
      throw new ConflictException(
        'Article changed after this proposal was created',
      );
    }
  }

  private presentProposal<T extends { proposedChanges: Prisma.JsonValue }>(
    proposal: T,
  ): T {
    return {
      ...proposal,
      proposedChanges: publicProposalChanges(proposal.proposedChanges),
    };
  }

  private async getOwnedPendingProposal(
    client: ProposalClient,
    id: string,
    userId: string,
  ) {
    const proposal = await client.changeProposal.findUnique({ where: { id } });
    if (!proposal) throw new NotFoundException('Proposal not found');

    if (proposal.entityType === 'BUSINESS') {
      const business = await client.business.findUnique({
        where: { id: proposal.entityId },
        select: { ownerId: true },
      });
      if (!business || business.ownerId !== userId) {
        throw new ForbiddenException('You do not own this entity');
      }
    } else if (proposal.entityType === 'ARTICLE') {
      const article = await client.article.findUnique({
        where: { id: proposal.entityId },
        select: { authorId: true },
      });
      if (!article || article.authorId !== userId) {
        throw new ForbiddenException('You do not own this entity');
      }
    } else {
      throw new BadRequestException('Unsupported proposal entity type');
    }

    if (proposal.status !== 'PENDING') {
      throw new BadRequestException('Proposal is not pending');
    }

    return proposal;
  }

  private async claimPendingProposal(
    client: ProposalClient,
    id: string,
    status: ProposalDecision,
  ) {
    const result = await client.changeProposal.updateMany({
      where: { id, status: 'PENDING' },
      data: { status },
    });

    if (result.count !== 1) {
      throw new BadRequestException('Proposal is not pending');
    }
  }

  private async validateArticleInvariants(
    client: ProposalClient,
    articleId: string,
    authorId: string,
    changes: UpdateArticleDto,
  ) {
    if (changes.businessId) {
      const article = await client.article.findUnique({
        where: { id: articleId },
        select: { businessId: true },
      });
      if (!article) throw new NotFoundException('Article not found');

      if (changes.businessId !== article.businessId) {
        const business = await client.business.findUnique({
          where: { id: changes.businessId },
          select: { ownerId: true },
        });
        if (!business || business.ownerId !== authorId) {
          throw new ForbiddenException(
            'You cannot assign this article to a business you do not own.',
          );
        }
      }
    }

    if (isNewsCategory(changes.category)) {
      const author = await client.user.findUnique({
        where: { id: authorId },
        select: { role: true },
      });
      if (author?.role !== 'ADMIN' && author?.role !== 'MODERATOR') {
        throw new ForbiddenException(
          'Only admins or moderators can categorize an article as News',
        );
      }
    }
  }

  private async findUpdatedProposal(client: ProposalClient, id: string) {
    const proposal = await client.changeProposal.findUnique({ where: { id } });
    if (!proposal) throw new NotFoundException('Proposal not found');
    return proposal;
  }

  async getMyProposals(userId: string) {
    const businesses = await this.prisma.business.findMany({
      where: { ownerId: userId },
      select: { id: true, name: true, slug: true },
    });

    const articles = await this.prisma.article.findMany({
      where: { authorId: userId },
      select: { id: true, title: true, slug: true },
    });

    const businessIds = businesses.map((b) => b.id);
    const articleIds = articles.map((a) => a.id);

    const proposals = await this.prisma.changeProposal.findMany({
      where: {
        OR: [
          { entityType: 'BUSINESS', entityId: { in: businessIds } },
          { entityType: 'ARTICLE', entityId: { in: articleIds } },
        ],
        status: 'PENDING',
      },
      orderBy: { createdAt: 'desc' },
      include: {
        proposer: { select: { id: true, name: true, email: true } },
      },
    });

    return proposals.map((p) => {
      let entityName = 'Unknown';
      let entitySlug = '';
      if (p.entityType === 'BUSINESS') {
        const b = businesses.find((b) => b.id === p.entityId);
        if (b) {
          entityName = b.name;
          entitySlug = b.slug;
        }
      } else if (p.entityType === 'ARTICLE') {
        const a = articles.find((a) => a.id === p.entityId);
        if (a) {
          entityName = a.title;
          entitySlug = a.slug;
        }
      }
      return this.presentProposal({ ...p, entityName, entitySlug });
    });
  }

  async getProposal(id: string, userId: string) {
    const proposal = await this.prisma.changeProposal.findUnique({
      where: { id },
      include: {
        proposer: { select: { id: true, name: true } },
      },
    });

    if (!proposal) throw new NotFoundException('Proposal not found');

    if (proposal.entityType === 'BUSINESS') {
      const entityData = await this.prisma.business.findUnique({
        where: { id: proposal.entityId },
      });
      if (!entityData || entityData.ownerId !== userId) {
        throw new ForbiddenException('You do not own this entity');
      }
      return {
        proposal: this.presentProposal(proposal),
        currentData: entityData,
      };
    }

    if (proposal.entityType === 'ARTICLE') {
      const entityData = await this.prisma.article.findUnique({
        where: { id: proposal.entityId },
      });
      if (!entityData || entityData.authorId !== userId) {
        throw new ForbiddenException('You do not own this entity');
      }
      return {
        proposal: this.presentProposal(proposal),
        currentData: entityData,
      };
    }

    throw new BadRequestException('Unsupported proposal entity type');
  }

  async approveProposal(id: string, userId: string) {
    return this.prisma.$transaction(async (transaction) => {
      const proposal = await this.getOwnedPendingProposal(
        transaction,
        id,
        userId,
      );

      const payload = this.getConcurrencyPayload(proposal.proposedChanges);

      if (proposal.entityType === 'BUSINESS') {
        const changes = await this.validateChanges(
          payload.changes,
          UpdateBusinessDto,
          BUSINESS_CHANGE_FIELDS,
        );
        await this.claimPendingProposal(transaction, id, 'APPROVED');
        await this.applyBusinessChanges(
          transaction,
          proposal.entityId,
          changes,
          payload.baseValues,
        );
      } else {
        const changes = await this.validateChanges(
          payload.changes,
          UpdateArticleDto,
          ARTICLE_CHANGE_FIELDS,
        );
        await this.validateArticleInvariants(
          transaction,
          proposal.entityId,
          userId,
          changes,
        );
        await this.claimPendingProposal(transaction, id, 'APPROVED');
        await this.applyArticleChanges(
          transaction,
          proposal.entityId,
          changes,
          payload.baseValues,
        );
      }

      return this.presentProposal(
        await this.findUpdatedProposal(transaction, id),
      );
    });
  }

  async rejectProposal(id: string, userId: string) {
    return this.prisma.$transaction(async (transaction) => {
      await this.getOwnedPendingProposal(transaction, id, userId);
      await this.claimPendingProposal(transaction, id, 'REJECTED');
      return this.presentProposal(
        await this.findUpdatedProposal(transaction, id),
      );
    });
  }
}
