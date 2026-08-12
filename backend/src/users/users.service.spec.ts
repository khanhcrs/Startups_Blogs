import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import type { PrismaService } from '../prisma/prisma.service';
import type { CognitoGroupsService } from './cognito-groups.service';
import { UsersService } from './users.service';

describe('UsersService identity and admin safety', () => {
  const findUnique = jest.fn();
  const update = jest.fn();
  const create = jest.fn();
  const count = jest.fn();
  const transaction = jest.fn();
  const setAdminMembership = jest.fn();
  const prisma = {
    user: { findUnique, update, create, count },
    $transaction: transaction,
  };
  let service: UsersService;

  beforeEach(() => {
    jest.clearAllMocks();
    transaction.mockImplementation(
      async (callback: (client: PrismaService) => Promise<unknown>) =>
        callback(prisma as unknown as PrismaService),
    );
    count.mockResolvedValue(1);
    service = new UsersService(
      prisma as unknown as PrismaService,
      { setAdminMembership } as unknown as CognitoGroupsService,
    );
  });

  describe('Cognito account linking', () => {
    it('links a verified Cognito identity to a legacy email row', async () => {
      const legacyUser = {
        id: 'legacy-id',
        cognitoSub: null,
        email: 'legacy@example.com',
      };
      findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(legacyUser);
      update.mockResolvedValue({
        ...legacyUser,
        cognitoSub: 'new-subject',
      });

      await expect(
        service.findOrCreateFromCognito({
          cognitoSub: 'new-subject',
          email: 'legacy@example.com',
          emailVerified: true,
        }),
      ).resolves.toMatchObject({ cognitoSub: 'new-subject' });
    });

    it('rejects relinking an email row owned by another Cognito subject', async () => {
      findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce({
        id: 'existing-id',
        cognitoSub: 'existing-subject',
        email: 'member@example.com',
      });

      await expect(
        service.findOrCreateFromCognito({
          cognitoSub: 'attacker-subject',
          email: 'member@example.com',
          emailVerified: true,
        }),
      ).rejects.toThrow(ConflictException);
      expect(update).not.toHaveBeenCalled();
    });

    it('requires a verified Cognito email before linking a legacy row', async () => {
      findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce({
        id: 'legacy-id',
        cognitoSub: null,
        email: 'legacy@example.com',
      });

      await expect(
        service.findOrCreateFromCognito({
          cognitoSub: 'new-subject',
          email: 'legacy@example.com',
          emailVerified: false,
        }),
      ).rejects.toThrow(UnauthorizedException);
      expect(update).not.toHaveBeenCalled();
    });
  });

  describe('admin role synchronization', () => {
    it('adds the user to Cognito before persisting the ADMIN role', async () => {
      findUnique.mockResolvedValue({
        id: 'user-id',
        cognitoSub: 'cognito-subject',
        email: 'admin@example.com',
        name: 'Admin',
        role: Role.USER,
        status: 'ACTIVE',
      });
      update.mockResolvedValue({ id: 'user-id', role: Role.ADMIN });

      await service.updateUserRole('user-id', Role.ADMIN, 'actor-id');

      expect(setAdminMembership).toHaveBeenCalledWith('cognito-subject', true);
      expect(update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { role: Role.ADMIN } }),
      );
      expect(setAdminMembership.mock.invocationCallOrder[0]).toBeLessThan(
        update.mock.invocationCallOrder[0],
      );
    });

    it('removes Cognito ADMIN membership while preserving another active admin', async () => {
      findUnique.mockResolvedValue({
        id: 'user-id',
        cognitoSub: 'cognito-subject',
        email: 'admin@example.com',
        name: 'Admin',
        role: Role.ADMIN,
        status: 'ACTIVE',
      });
      update.mockResolvedValue({ id: 'user-id', role: Role.USER });

      await service.updateUserRole('user-id', Role.USER, 'other-admin');

      expect(setAdminMembership).toHaveBeenCalledWith('cognito-subject', false);
      expect(count).toHaveBeenCalled();
    });

    it('falls back to the email alias for a legacy user without cognitoSub', async () => {
      findUnique.mockResolvedValue({
        id: 'legacy-id',
        cognitoSub: null,
        email: 'legacy@example.com',
        name: 'Legacy',
        role: Role.USER,
        status: 'ACTIVE',
      });
      update.mockResolvedValue({ id: 'legacy-id', role: Role.ADMIN });

      await service.updateUserRole('legacy-id', Role.ADMIN, 'actor-id');

      expect(setAdminMembership).toHaveBeenCalledWith(
        'legacy@example.com',
        true,
      );
    });

    it('prevents an admin from demoting their own account', async () => {
      findUnique.mockResolvedValue({
        id: 'self-id',
        cognitoSub: 'self-subject',
        email: 'self@example.com',
        name: 'Self',
        role: Role.ADMIN,
        status: 'ACTIVE',
      });

      await expect(
        service.updateUserRole('self-id', Role.USER, 'self-id'),
      ).rejects.toThrow(ForbiddenException);
      expect(setAdminMembership).not.toHaveBeenCalled();
    });

    it('prevents removal of the last active admin', async () => {
      findUnique.mockResolvedValue({
        id: 'last-admin',
        cognitoSub: 'last-subject',
        email: 'last@example.com',
        name: 'Last Admin',
        role: Role.ADMIN,
        status: 'ACTIVE',
      });
      count.mockResolvedValue(0);

      await expect(
        service.updateUserRole('last-admin', Role.USER, 'actor-id'),
      ).rejects.toThrow(ConflictException);
      expect(setAdminMembership).not.toHaveBeenCalled();
    });

    it('does not call Cognito for an unknown database user', async () => {
      findUnique.mockResolvedValue(null);

      await expect(
        service.updateUserRole('missing-user', Role.ADMIN, 'actor-id'),
      ).rejects.toThrow(NotFoundException);
      expect(setAdminMembership).not.toHaveBeenCalled();
    });
  });

  describe('admin account status safety', () => {
    it('prevents an admin from locking their own account', async () => {
      await expect(
        service.updateUserStatus('self-id', 'LOCKED', 'self-id'),
      ).rejects.toThrow(ForbiddenException);
      expect(transaction).not.toHaveBeenCalled();
    });

    it('prevents locking the last active admin', async () => {
      findUnique.mockResolvedValue({ role: Role.ADMIN, status: 'ACTIVE' });
      count.mockResolvedValue(0);

      await expect(
        service.updateUserStatus('last-admin', 'LOCKED', 'actor-id'),
      ).rejects.toThrow(ConflictException);
      expect(update).not.toHaveBeenCalled();
    });
  });
});
