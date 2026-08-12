import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import type { AuthenticatedRequest } from '../auth/auth.types';
import { UpdateBusinessDto } from '../businesses/dto/update-business.dto';
import { UpdateArticleDto } from '../articles/dto/update-article.dto';

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
      data,
    };
  }

  @Post('proposals/business/:id')
  async proposeBusinessChange(
    @Param('id') id: string,
    @Body() changes: UpdateBusinessDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const proposal = await this.adminService.createProposal(
      'BUSINESS',
      id,
      changes,
      req.user.userId,
    );
    return { success: true, data: proposal };
  }

  @Post('proposals/article/:id')
  async proposeArticleChange(
    @Param('id') id: string,
    @Body() changes: UpdateArticleDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const proposal = await this.adminService.createProposal(
      'ARTICLE',
      id,
      changes,
      req.user.userId,
    );
    return { success: true, data: proposal };
  }
}
