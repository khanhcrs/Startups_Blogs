import { Controller, Get, Post, Param, Body, Request, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  async getStats() {
    const data = await this.adminService.getStats();
    return {
      success: true,
      data
    };
  }

  @Post('proposals/business/:id')
  async proposeBusinessChange(
    @Param('id') id: string,
    @Body() changes: any,
    @Request() req: any
  ) {
    const proposal = await this.adminService.createProposal('BUSINESS', id, changes, req.user.id);
    return { success: true, data: proposal };
  }

  @Post('proposals/article/:id')
  async proposeArticleChange(
    @Param('id') id: string,
    @Body() changes: any,
    @Request() req: any
  ) {
    const proposal = await this.adminService.createProposal('ARTICLE', id, changes, req.user.id);
    return { success: true, data: proposal };
  }
}
