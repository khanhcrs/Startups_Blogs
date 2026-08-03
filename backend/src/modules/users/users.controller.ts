import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '../../common/auth/current-user.decorator';
import type { RequestPrincipal } from '../../common/auth/principal';
import { PrismaService } from '../../common/database/prisma.service';

@Controller('users')
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}
  @Get('me') me(@CurrentUser() user: RequestPrincipal) {
    return this.prisma.user.findUnique({ where: { id: user.userId }, include: { roles: { include: { role: true } } } });
  }
}
