import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TeamMembersService } from './team-members.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('businesses/:businessId/team-members')
export class TeamMembersController {
  constructor(private readonly teamMembersService: TeamMembersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Param('businessId') businessId: string,
    @Body() createTeamMemberDto: CreateTeamMemberDto,
    @Request() req: any,
  ) {
    return this.teamMembersService.create(businessId, createTeamMemberDto, req.user.userId);
  }

  @Get()
  findAll(@Param('businessId') businessId: string) {
    return this.teamMembersService.findAll(businessId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('businessId') businessId: string,
    @Param('id') id: string,
    @Body() updateTeamMemberDto: UpdateTeamMemberDto,
    @Request() req: any,
  ) {
    return this.teamMembersService.update(businessId, id, updateTeamMemberDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('businessId') businessId: string,
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.teamMembersService.remove(businessId, id, req.user.userId);
  }
}
