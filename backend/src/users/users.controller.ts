import { Controller, Get, Put, Body, UseGuards, Request, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/all')
  async getAllUsers(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    return this.usersService.getAllUsers(Number(page), Number(limit));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put('admin/:id/role')
  async updateUserRole(@Param('id') id: string, @Body('role') role: string) {
    const data = await this.usersService.updateUserRole(id, role);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req: any) {
    const user = await this.usersService.findById(req.user.userId);
    if (user) {
      // Exclude password from the response
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  @Get(':id')
  async getPublicProfile(@Param('id') id: string) {
    return this.usersService.getPublicProfile(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateProfile(@Request() req: any, @Body() updateProfileDto: UpdateProfileDto) {
    const user = await this.usersService.updateUser(req.user.userId, updateProfileDto);
    const { password, ...result } = user;
    return result;
  }




}
