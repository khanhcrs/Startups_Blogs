import { Role } from '@prisma/client';
import { validate } from 'class-validator';
import { UpdateUserRoleDto } from './update-user-role.dto';
import { UpdateUserStatusDto } from './update-user-status.dto';

describe('admin user update DTOs', () => {
  it.each(Object.values(Role))(
    'accepts the supported role %s',
    async (role) => {
      const dto = Object.assign(new UpdateUserRoleDto(), { role });
      await expect(validate(dto)).resolves.toHaveLength(0);
    },
  );

  it('rejects an unsupported role', async () => {
    const dto = Object.assign(new UpdateUserRoleDto(), {
      role: 'SUPER_ADMIN',
    });
    await expect(validate(dto)).resolves.not.toHaveLength(0);
  });

  it.each(['ACTIVE', 'LOCKED'])(
    'accepts the supported status %s',
    async (status) => {
      const dto = Object.assign(new UpdateUserStatusDto(), { status });
      await expect(validate(dto)).resolves.toHaveLength(0);
    },
  );

  it('rejects an unsupported status', async () => {
    const dto = Object.assign(new UpdateUserStatusDto(), { status: 'DELETED' });
    await expect(validate(dto)).resolves.not.toHaveLength(0);
  });
});
