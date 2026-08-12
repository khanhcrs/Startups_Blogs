import { Role } from '@prisma/client';
import type { PrismaService } from '../prisma/prisma.service';
import type { CognitoGroupsService } from './cognito-groups.service';
import { UsersService } from './users.service';

describe('UsersService admin query', () => {
  const findMany = jest.fn();
  const count = jest.fn();
  const service = new UsersService(
    { user: { findMany, count } } as unknown as PrismaService,
    {} as CognitoGroupsService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses validated pagination and a typed role filter', async () => {
    findMany.mockResolvedValue([]);
    count.mockResolvedValue(0);

    await expect(
      service.getAllUsers({ page: 2, limit: 25, role: Role.ADMIN }),
    ).resolves.toEqual({
      data: [],
      meta: { total: 0, page: 2, limit: 25, totalPages: 0 },
    });

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { role: Role.ADMIN },
        skip: 25,
        take: 25,
      }),
    );
    expect(count).toHaveBeenCalledWith({ where: { role: Role.ADMIN } });
  });
});
