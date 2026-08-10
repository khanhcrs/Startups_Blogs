/* eslint-disable @typescript-eslint/unbound-method -- decorators are inspected without invoking handlers */
import { GUARDS_METADATA } from '@nestjs/common/constants';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { BusinessesController } from './businesses.controller';

describe('BusinessesController admin authorization', () => {
  const adminHandlers = [
    BusinessesController.prototype.findAllForAdmin,
    BusinessesController.prototype.updateStatus,
    BusinessesController.prototype.findOneForAdmin,
    BusinessesController.prototype.updateAsAdmin,
  ];

  it.each(adminHandlers)('requires ADMIN for an admin handler', (handler) => {
    expect(Reflect.getMetadata(ROLES_KEY, handler)).toEqual([Role.ADMIN]);
    expect(Reflect.getMetadata(GUARDS_METADATA, handler)).toEqual([
      JwtAuthGuard,
      RolesGuard,
    ]);
  });
});
