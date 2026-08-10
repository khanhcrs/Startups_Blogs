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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateBusinessStatusDto } from './dto/update-business-status.dto';

@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createBusinessDto: CreateBusinessDto, @Request() req: any) {
    return this.businessesService.create(createBusinessDto, req.user.userId);
  }

  @Get()
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.businessesService.findAll(skip ? +skip : 0, take ? +take : 10);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/all')
  findAllForAdmin(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('stage') stage?: string,
    @Query('industry') industry?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.businessesService.findAllForAdmin(
      skip ? +skip : 0,
      take ? +take : 10,
      status,
      search,
      stage,
      industry,
      startDate,
      endDate,
    );
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put('admin/:id')
  updateAsAdmin(@Param('id') id: string, @Body() updateBusinessDto: any) {
    return this.businessesService.updateAsAdmin(id, updateBusinessDto);
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
    @Request() req: any,
  ) {
    return this.businessesService.update(
      id,
      updateBusinessDto,
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.businessesService.remove(id, req.user.userId);
  }
}
