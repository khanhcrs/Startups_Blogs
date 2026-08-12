import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdminService } from './admin.service';

const transaction = {
  business: { findUnique: jest.fn() },
  article: { findUnique: jest.fn() },
  changeProposal: { create: jest.fn() },
  notification: { create: jest.fn() },
};

const prisma = {
  $transaction: jest.fn(
    async (callback: (client: typeof transaction) => Promise<unknown>) =>
      callback(transaction),
  ),
};

describe('AdminService proposal creation', () => {
  const service = new AdminService(prisma as unknown as PrismaService);

  beforeEach(() => {
    jest.resetAllMocks();
    prisma.$transaction.mockImplementation(
      async (callback: (client: typeof transaction) => Promise<unknown>) =>
        callback(transaction),
    );
  });

  it('atomically creates a business proposal and owner notification', async () => {
    transaction.business.findUnique.mockResolvedValue({
      ownerId: 'owner-1',
      name: 'Acme',
    });
    transaction.changeProposal.create.mockResolvedValue({
      id: 'proposal-1',
      entityType: 'BUSINESS',
    });
    transaction.notification.create.mockResolvedValue({ id: 'notice-1' });

    await expect(
      service.createProposal(
        'BUSINESS',
        'business-1',
        { name: 'Acme 2' },
        'admin-1',
      ),
    ).resolves.toEqual({
      id: 'proposal-1',
      entityType: 'BUSINESS',
      proposedChanges: { name: 'Acme 2' },
    });

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(transaction.changeProposal.create).toHaveBeenCalledWith({
      data: {
        entityType: 'BUSINESS',
        entityId: 'business-1',
        proposedChanges: {
          schemaVersion: 1,
          changes: { name: 'Acme 2' },
          baseValues: { name: 'Acme' },
        },
        proposerId: 'admin-1',
        status: 'PENDING',
      },
    });
    expect(transaction.notification.create).toHaveBeenCalledWith({
      data: {
        userId: 'owner-1',
        title: 'New Edit Proposal',
        message: 'Admin proposed changes to your startup: Acme',
        type: 'SYSTEM',
        linkUrl: '/proposals/proposal-1',
      },
    });
  });

  it('rejects a missing article before persisting an orphan proposal', async () => {
    transaction.article.findUnique.mockResolvedValue(null);

    await expect(
      service.createProposal(
        'ARTICLE',
        'missing-article',
        { title: 'New title' },
        'admin-1',
      ),
    ).rejects.toThrow(NotFoundException);

    expect(transaction.changeProposal.create).not.toHaveBeenCalled();
    expect(transaction.notification.create).not.toHaveBeenCalled();
  });

  it('rejects a missing business before persisting an orphan proposal', async () => {
    transaction.business.findUnique.mockResolvedValue(null);

    await expect(
      service.createProposal(
        'BUSINESS',
        'missing-business',
        { name: 'New name' },
        'admin-1',
      ),
    ).rejects.toThrow(NotFoundException);

    expect(transaction.changeProposal.create).not.toHaveBeenCalled();
    expect(transaction.notification.create).not.toHaveBeenCalled();
  });

  it('keeps proposal and notification in the same failing transaction', async () => {
    transaction.article.findUnique.mockResolvedValue({
      authorId: 'author-1',
      title: 'Article',
    });
    transaction.changeProposal.create.mockResolvedValue({ id: 'proposal-1' });
    transaction.notification.create.mockRejectedValue(
      new Error('notification write failed'),
    );

    await expect(
      service.createProposal(
        'ARTICLE',
        'article-1',
        { title: 'Updated' },
        'admin-1',
      ),
    ).rejects.toThrow('notification write failed');

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(transaction.changeProposal.create).toHaveBeenCalledTimes(1);
    expect(transaction.notification.create).toHaveBeenCalledTimes(1);
  });

  it('rejects an empty proposal before opening a transaction', async () => {
    await expect(
      service.createProposal('ARTICLE', 'article-1', {}, 'admin-1'),
    ).rejects.toThrow(BadRequestException);

    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('stores only changed fields and their original values', async () => {
    transaction.article.findUnique.mockResolvedValue({
      id: 'article-1',
      authorId: 'author-1',
      title: 'Original title',
      summary: 'Original summary',
      tags: ['one'],
    });
    transaction.changeProposal.create.mockResolvedValue({
      id: 'proposal-1',
      entityType: 'ARTICLE',
    });
    transaction.notification.create.mockResolvedValue({ id: 'notice-1' });

    await service.createProposal(
      'ARTICLE',
      'article-1',
      {
        title: 'Original title',
        summary: 'Updated summary',
        tags: ['one'],
      },
      'admin-1',
    );

    expect(transaction.changeProposal.create).toHaveBeenCalledWith({
      data: {
        entityType: 'ARTICLE',
        entityId: 'article-1',
        proposedChanges: {
          schemaVersion: 1,
          changes: { summary: 'Updated summary' },
          baseValues: { summary: 'Original summary' },
        },
        proposerId: 'admin-1',
        status: 'PENDING',
      },
    });
  });

  it('rejects a non-empty snapshot when every value is unchanged', async () => {
    transaction.article.findUnique.mockResolvedValue({
      id: 'article-1',
      authorId: 'author-1',
      title: 'Same title',
    });

    await expect(
      service.createProposal(
        'ARTICLE',
        'article-1',
        { title: 'Same title' },
        'admin-1',
      ),
    ).rejects.toThrow('Proposal does not contain any changes');

    expect(transaction.changeProposal.create).not.toHaveBeenCalled();
    expect(transaction.notification.create).not.toHaveBeenCalled();
  });
});
