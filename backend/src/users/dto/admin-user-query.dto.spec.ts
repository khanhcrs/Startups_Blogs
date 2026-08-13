import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Role } from '@prisma/client';
import { AdminUserQueryDto } from './admin-user-query.dto';

describe('AdminUserQueryDto', () => {
  it('applies safe pagination defaults', async () => {
    const dto = plainToInstance(AdminUserQueryDto, {});

    await expect(validate(dto)).resolves.toHaveLength(0);
    expect(dto).toMatchObject({ page: 1, limit: 10 });
  });

  it('transforms valid pagination and accepts a canonical role', async () => {
    const dto = plainToInstance(AdminUserQueryDto, {
      page: '2',
      limit: '100',
      role: Role.ADMIN,
    });

    await expect(validate(dto)).resolves.toHaveLength(0);
    expect(dto).toMatchObject({ page: 2, limit: 100, role: Role.ADMIN });
  });

  it('rejects unsafe pagination and unsupported roles', async () => {
    const dto = plainToInstance(AdminUserQueryDto, {
      page: '0',
      limit: '101',
      role: 'SUPER_ADMIN',
    });

    await expect(validate(dto)).resolves.toHaveLength(3);
  });
});
