import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProposalsService } from './proposals.service';

const transaction = {
  article: {
    findUnique: jest.fn(),
    updateMany: jest.fn(),
  },
  business: {
    findUnique: jest.fn(),
    updateMany: jest.fn(),
  },
  changeProposal: {
    findUnique: jest.fn(),
    updateMany: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
};

const prisma = {
  $transaction: jest.fn(
    async (callback: (client: typeof transaction) => Promise<unknown>) =>
      callback(transaction),
  ),
};

const protectedPayload = (
  changes: unknown,
  baseValues: Record<string, unknown> = typeof changes === 'object' &&
  changes !== null &&
  !Array.isArray(changes)
    ? Object.fromEntries(
        Object.keys(changes).map((field) => [field, `original-${field}`]),
      )
    : {},
) => ({ schemaVersion: 1, changes, baseValues });

const businessProposal = (
  changes: unknown,
  status = 'PENDING',
  baseValues?: Record<string, unknown>,
) => ({
  id: 'proposal-1',
  entityType: 'BUSINESS',
  entityId: 'business-1',
  proposerId: 'admin-1',
  proposedChanges: protectedPayload(changes, baseValues),
  status,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const articleProposal = (
  changes: unknown,
  status = 'PENDING',
  baseValues?: Record<string, unknown>,
) => ({
  id: 'proposal-1',
  entityType: 'ARTICLE',
  entityId: 'article-1',
  proposerId: 'admin-1',
  proposedChanges: protectedPayload(changes, baseValues),
  status,
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe('ProposalsService decisions', () => {
  const service = new ProposalsService(prisma as unknown as PrismaService);

  beforeEach(() => {
    jest.resetAllMocks();
    prisma.$transaction.mockImplementation(
      async (callback: (client: typeof transaction) => Promise<unknown>) =>
        callback(transaction),
    );
    transaction.changeProposal.updateMany.mockResolvedValue({ count: 1 });
    transaction.business.updateMany.mockResolvedValue({ count: 1 });
    transaction.article.updateMany.mockResolvedValue({ count: 1 });
  });

  it('validates and atomically applies an allowlisted business proposal', async () => {
    const pending = businessProposal(
      {
        name: 'Acme 2',
        foundedYear: 2024,
        website: 'https://acme.example',
      },
      'PENDING',
      {
        name: 'Acme',
        foundedYear: 2020,
        website: 'https://old-acme.example',
      },
    );
    const approved = { ...pending, status: 'APPROVED' };
    const publicApproved = {
      ...approved,
      proposedChanges: pending.proposedChanges.changes,
    };
    transaction.changeProposal.findUnique
      .mockResolvedValueOnce(pending)
      .mockResolvedValueOnce(approved);
    transaction.business.findUnique.mockResolvedValue({ ownerId: 'owner-1' });

    await expect(
      service.approveProposal('proposal-1', 'owner-1'),
    ).resolves.toEqual(publicApproved);

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(transaction.changeProposal.updateMany).toHaveBeenCalledWith({
      where: { id: 'proposal-1', status: 'PENDING' },
      data: { status: 'APPROVED' },
    });
    expect(transaction.business.updateMany).toHaveBeenCalledWith({
      where: {
        id: 'business-1',
        AND: [
          { name: 'Acme' },
          { foundedYear: 2020 },
          { website: 'https://old-acme.example' },
        ],
      },
      data: {
        name: 'Acme 2',
        foundedYear: 2024,
        website: 'https://acme.example',
      },
    });
  });

  it('validates and applies article fields defined by UpdateArticleDto', async () => {
    const pending = articleProposal(
      {
        title: 'Updated title',
        status: 'PUBLISHED',
        tags: ['startup', 'funding'],
      },
      'PENDING',
      {
        title: 'Original title',
        status: 'DRAFT',
        tags: ['draft'],
      },
    );
    const approved = { ...pending, status: 'APPROVED' };
    const publicApproved = {
      ...approved,
      proposedChanges: pending.proposedChanges.changes,
    };
    transaction.changeProposal.findUnique
      .mockResolvedValueOnce(pending)
      .mockResolvedValueOnce(approved);
    transaction.article.findUnique.mockResolvedValue({ authorId: 'author-1' });

    await expect(
      service.approveProposal('proposal-1', 'author-1'),
    ).resolves.toEqual(publicApproved);

    expect(transaction.article.updateMany).toHaveBeenCalledWith({
      where: {
        id: 'article-1',
        AND: [
          { title: 'Original title' },
          { status: 'DRAFT' },
          { tags: { equals: ['draft'] } },
        ],
      },
      data: {
        title: 'Updated title',
        status: 'PUBLISHED',
        tags: ['startup', 'funding'],
      },
    });
  });

  it('allows assigning an article only to a business owned by its author', async () => {
    const pending = articleProposal({ businessId: 'business-2' }, 'PENDING', {
      businessId: 'business-1',
    });
    const approved = { ...pending, status: 'APPROVED' };
    const publicApproved = {
      ...approved,
      proposedChanges: pending.proposedChanges.changes,
    };
    transaction.changeProposal.findUnique
      .mockResolvedValueOnce(pending)
      .mockResolvedValueOnce(approved);
    transaction.article.findUnique
      .mockResolvedValueOnce({ authorId: 'author-1' })
      .mockResolvedValueOnce({ businessId: 'business-1' });
    transaction.business.findUnique.mockResolvedValue({ ownerId: 'author-1' });

    await expect(
      service.approveProposal('proposal-1', 'author-1'),
    ).resolves.toEqual(publicApproved);

    expect(transaction.business.findUnique).toHaveBeenCalledWith({
      where: { id: 'business-2' },
      select: { ownerId: true },
    });
    expect(transaction.article.updateMany).toHaveBeenCalledWith({
      where: { id: 'article-1', AND: [{ businessId: 'business-1' }] },
      data: { businessId: 'business-2' },
    });
  });

  it.each([null, { ownerId: 'owner-2' }])(
    'rejects assigning an article to a missing or unowned business (%p)',
    async (targetBusiness) => {
      transaction.changeProposal.findUnique.mockResolvedValue(
        articleProposal({ businessId: 'business-2' }),
      );
      transaction.article.findUnique
        .mockResolvedValueOnce({ authorId: 'author-1' })
        .mockResolvedValueOnce({ businessId: 'business-1' });
      transaction.business.findUnique.mockResolvedValue(targetBusiness);

      await expect(
        service.approveProposal('proposal-1', 'author-1'),
      ).rejects.toThrow(ForbiddenException);

      expect(transaction.changeProposal.updateMany).not.toHaveBeenCalled();
      expect(transaction.article.updateMany).not.toHaveBeenCalled();
    },
  );

  it('does not let a USER approve a proposal that recategorizes an article as News', async () => {
    transaction.changeProposal.findUnique.mockResolvedValue(
      articleProposal({ category: ' News ' }),
    );
    transaction.article.findUnique.mockResolvedValue({ authorId: 'author-1' });
    transaction.user.findUnique.mockResolvedValue({ role: 'USER' });

    await expect(
      service.approveProposal('proposal-1', 'author-1'),
    ).rejects.toThrow(
      'Only admins or moderators can categorize an article as News',
    );

    expect(transaction.changeProposal.updateMany).not.toHaveBeenCalled();
    expect(transaction.article.updateMany).not.toHaveBeenCalled();
  });

  it.each(['ADMIN', 'MODERATOR'])(
    'allows a %s author to approve a News category proposal',
    async (role) => {
      const pending = articleProposal({ category: 'NEWS' });
      const approved = { ...pending, status: 'APPROVED' };
      const publicApproved = {
        ...approved,
        proposedChanges: pending.proposedChanges.changes,
      };
      transaction.changeProposal.findUnique
        .mockResolvedValueOnce(pending)
        .mockResolvedValueOnce(approved);
      transaction.article.findUnique.mockResolvedValue({
        authorId: 'author-1',
      });
      transaction.user.findUnique.mockResolvedValue({ role });

      await expect(
        service.approveProposal('proposal-1', 'author-1'),
      ).resolves.toEqual(publicApproved);

      expect(transaction.article.updateMany).toHaveBeenCalledTimes(1);
    },
  );

  it.each([
    businessProposal({ name: 'Acme 2', ownerId: 'attacker-1' }),
    articleProposal({ title: 'Injected', viewCount: 1_000_000 }),
  ])(
    'rejects unknown fields from a malicious legacy proposal',
    async (proposal) => {
      transaction.changeProposal.findUnique.mockResolvedValue(proposal);
      transaction.business.findUnique.mockResolvedValue({ ownerId: 'owner-1' });
      transaction.article.findUnique.mockResolvedValue({ authorId: 'owner-1' });

      await expect(
        service.approveProposal('proposal-1', 'owner-1'),
      ).rejects.toThrow(BadRequestException);

      expect(transaction.changeProposal.updateMany).not.toHaveBeenCalled();
      expect(transaction.business.updateMany).not.toHaveBeenCalled();
      expect(transaction.article.updateMany).not.toHaveBeenCalled();
    },
  );

  it.each([
    ['an invalid business URL', businessProposal({ website: 'not-a-url' })],
    [
      'an invalid article status',
      articleProposal({ status: 'MALICIOUS_STATUS' }),
    ],
    ['an empty changes object', businessProposal({})],
    ['a non-object payload', articleProposal(['title', 'Injected'])],
    ['a null DTO value', businessProposal({ legalName: null })],
  ])('rejects %s before claiming the proposal', async (_caseName, proposal) => {
    transaction.changeProposal.findUnique.mockResolvedValue(proposal);
    transaction.business.findUnique.mockResolvedValue({ ownerId: 'owner-1' });
    transaction.article.findUnique.mockResolvedValue({ authorId: 'owner-1' });

    await expect(
      service.approveProposal('proposal-1', 'owner-1'),
    ).rejects.toThrow(BadRequestException);

    expect(transaction.changeProposal.updateMany).not.toHaveBeenCalled();
    expect(transaction.business.updateMany).not.toHaveBeenCalled();
    expect(transaction.article.updateMany).not.toHaveBeenCalled();
  });

  it('preserves entity-owner authorization before any transition', async () => {
    transaction.changeProposal.findUnique.mockResolvedValue(
      businessProposal({ name: 'Acme 2' }),
    );
    transaction.business.findUnique.mockResolvedValue({ ownerId: 'owner-2' });

    await expect(
      service.approveProposal('proposal-1', 'owner-1'),
    ).rejects.toThrow(ForbiddenException);

    expect(transaction.changeProposal.updateMany).not.toHaveBeenCalled();
    expect(transaction.business.updateMany).not.toHaveBeenCalled();
  });

  it('does not re-apply a proposal that is no longer pending', async () => {
    transaction.changeProposal.findUnique.mockResolvedValue(
      articleProposal({ title: 'Updated' }, 'APPROVED'),
    );
    transaction.article.findUnique.mockResolvedValue({ authorId: 'author-1' });

    await expect(
      service.approveProposal('proposal-1', 'author-1'),
    ).rejects.toThrow('Proposal is not pending');

    expect(transaction.changeProposal.updateMany).not.toHaveBeenCalled();
    expect(transaction.article.updateMany).not.toHaveBeenCalled();
  });

  it('stops before updating the entity when another decision wins the race', async () => {
    transaction.changeProposal.findUnique.mockResolvedValue(
      businessProposal({ name: 'Acme 2' }),
    );
    transaction.business.findUnique.mockResolvedValue({ ownerId: 'owner-1' });
    transaction.changeProposal.updateMany.mockResolvedValue({ count: 0 });

    await expect(
      service.approveProposal('proposal-1', 'owner-1'),
    ).rejects.toThrow('Proposal is not pending');

    expect(transaction.business.updateMany).not.toHaveBeenCalled();
  });

  it('rejects a pending proposal through the same transaction and owner check', async () => {
    const pending = articleProposal({ title: 'Unsafe legacy value' });
    const rejected = { ...pending, status: 'REJECTED' };
    transaction.changeProposal.findUnique
      .mockResolvedValueOnce(pending)
      .mockResolvedValueOnce(rejected);
    transaction.article.findUnique.mockResolvedValue({ authorId: 'author-1' });

    await expect(
      service.rejectProposal('proposal-1', 'author-1'),
    ).resolves.toEqual({
      ...rejected,
      proposedChanges: pending.proposedChanges.changes,
    });

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(transaction.changeProposal.updateMany).toHaveBeenCalledWith({
      where: { id: 'proposal-1', status: 'PENDING' },
      data: { status: 'REJECTED' },
    });
    expect(transaction.article.updateMany).not.toHaveBeenCalled();
  });

  it('returns 409 and does not apply changes when the target fields changed', async () => {
    transaction.changeProposal.findUnique.mockResolvedValue(
      businessProposal({ name: 'Proposed name' }, 'PENDING', {
        name: 'Original name',
      }),
    );
    transaction.business.findUnique.mockResolvedValue({ ownerId: 'owner-1' });
    transaction.business.updateMany.mockResolvedValue({ count: 0 });

    await expect(
      service.approveProposal('proposal-1', 'owner-1'),
    ).rejects.toThrow(ConflictException);

    expect(transaction.changeProposal.updateMany).toHaveBeenCalledWith({
      where: { id: 'proposal-1', status: 'PENDING' },
      data: { status: 'APPROVED' },
    });
    expect(transaction.business.updateMany).toHaveBeenCalledWith({
      where: {
        id: 'business-1',
        AND: [{ name: 'Original name' }],
      },
      data: { name: 'Proposed name' },
    });
  });

  it('returns 409 for a legacy proposal without concurrency metadata', async () => {
    transaction.changeProposal.findUnique.mockResolvedValue({
      ...businessProposal({ name: 'Proposed name' }),
      proposedChanges: { name: 'Proposed name' },
    });
    transaction.business.findUnique.mockResolvedValue({ ownerId: 'owner-1' });

    await expect(
      service.approveProposal('proposal-1', 'owner-1'),
    ).rejects.toThrow(ConflictException);

    expect(transaction.changeProposal.updateMany).not.toHaveBeenCalled();
    expect(transaction.business.updateMany).not.toHaveBeenCalled();
  });

  it('propagates an entity update failure from the decision transaction', async () => {
    transaction.changeProposal.findUnique.mockResolvedValue(
      businessProposal({ name: 'Acme 2' }),
    );
    transaction.business.findUnique.mockResolvedValue({ ownerId: 'owner-1' });
    transaction.business.updateMany.mockRejectedValue(
      new Error('entity update failed'),
    );

    await expect(
      service.approveProposal('proposal-1', 'owner-1'),
    ).rejects.toThrow('entity update failed');

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(transaction.changeProposal.updateMany).toHaveBeenCalledTimes(1);
  });
});
