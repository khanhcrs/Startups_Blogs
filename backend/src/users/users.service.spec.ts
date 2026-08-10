import { NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import type { PrismaService } from '../prisma/prisma.service';
import type { CognitoGroupsService } from './cognito-groups.service';
import { UsersService } from './users.service';

describe('UsersService admin role synchronization', () => {
  const findUnique = jest.fn();
  const update = jest.fn();
  const setAdminMembership = jest.fn();
  let service: UsersService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UsersService(
      { user: { findUnique, update } } as unknown as PrismaService,
      { setAdminMembership } as unknown as CognitoGroupsService,
    );
  });

  it('adds the user to Cognito before persisting the ADMIN role', async () => {
    findUnique.mockResolvedValue({ email: 'admin@example.com' });
    update.mockResolvedValue({ id: 'user-id', role: Role.ADMIN });

    await service.updateUserRole('user-id', Role.ADMIN);

    expect(setAdminMembership).toHaveBeenCalledWith('admin@example.com', true);
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { role: Role.ADMIN } }),
    );
    expect(setAdminMembership.mock.invocationCallOrder[0]).toBeLessThan(
      update.mock.invocationCallOrder[0],
    );
  });

  it('removes Cognito ADMIN membership before persisting a lower role', async () => {
    findUnique.mockResolvedValue({ email: 'admin@example.com' });
    update.mockResolvedValue({ id: 'user-id', role: Role.USER });

    await service.updateUserRole('user-id', Role.USER);

    expect(setAdminMembership).toHaveBeenCalledWith('admin@example.com', false);
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { role: Role.USER } }),
    );
  });

  it('does not call Cognito for an unknown database user', async () => {
    findUnique.mockResolvedValue(null);

    await expect(
      service.updateUserRole('missing-user', Role.ADMIN),
    ).rejects.toThrow(NotFoundException);
    expect(setAdminMembership).not.toHaveBeenCalled();
  });
});
