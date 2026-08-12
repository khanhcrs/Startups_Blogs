import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { CreateRaiseCapitalDto } from './dto/create-raise-capital.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateBusinessStatusDto } from './dto/update-business-status.dto';
import { AdminBusinessQueryDto } from './dto/admin-business-query.dto';
import type {
  AuthenticatedRequest,
  AuthenticatedUser,
} from '../auth/auth.types';

@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createBusinessDto: CreateBusinessDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.businessesService.create(createBusinessDto, req.user.userId);
  }

  @Get()
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.businessesService.findAll(skip ? +skip : 0, take ? +take : 10);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/all')
  findAllForAdmin(@Query() query: AdminBusinessQueryDto) {
    return this.businessesService.findAllForAdmin(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put('admin/:id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateBusinessStatusDto) {
    return this.businessesService.updateStatus(id, dto.status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/:id')
  findOneForAdmin(@Param('id') id: string) {
    return this.businessesService.findOneForAdmin(id);
  }

  @Get('taxonomy')
  getTaxonomy() {
    return this.businessesService.getTaxonomy();
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/saved-ids')
  getSavedBusinessIds(@Request() req: AuthenticatedRequest) {
    return this.businessesService.getSavedBusinessIds(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/followed-ids')
  getFollowedBusinessIds(@Request() req: AuthenticatedRequest) {
    return this.businessesService.getFollowedBusinessIds(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('raise-capital')
  createRaiseCapitalSubmission(
    @Body() dto: CreateRaiseCapitalDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.businessesService.createRaiseCapitalSubmission(
      dto,
      req.user.userId,
    );
  }

  @Get(':identifier/relationship')
  getRelationship(
    @Param('identifier') identifier: string,
    @Request() req: { user?: AuthenticatedUser },
  ) {
    const userId = req.user?.userId;
    return this.businessesService.getRelationship(identifier, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':identifier/save')
  saveBusiness(
    @Param('identifier') identifier: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.businessesService.saveBusiness(identifier, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':identifier/save')
  unsaveBusiness(
    @Param('identifier') identifier: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.businessesService.unsaveBusiness(identifier, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':identifier/follow')
  followBusiness(
    @Param('identifier') identifier: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.businessesService.followBusiness(identifier, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':identifier/follow')
  unfollowBusiness(
    @Param('identifier') identifier: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.businessesService.unfollowBusiness(identifier, req.user.userId);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.businessesService.findOneBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.businessesService.update(
      id,
      updateBusinessDto,
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.businessesService.remove(id, req.user.userId);
  }
}
