import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request, Query, ForbiddenException } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Get('admin/all')
  findAllForAdmin(
    @Request() req: any,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('stage') stage?: string,
    @Query('industry') industry?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admin can access this route');
    }
    return this.businessesService.findAllForAdmin(
      skip ? +skip : 0, 
      take ? +take : 10, 
      status, 
      search, 
      stage, 
      industry,
      startDate,
      endDate
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Request() req: any,
  ) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admin can access this route');
    }
    return this.businessesService.updateStatus(id, status);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/:id')
  findOneForAdmin(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admin can access this route');
    }
    return this.businessesService.findOneForAdmin(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/:id')
  updateAsAdmin(
    @Param('id') id: string,
    @Body() updateBusinessDto: any,
    @Request() req: any,
  ) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admin can access this route');
    }
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
    return this.businessesService.update(id, updateBusinessDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.businessesService.remove(id, req.user.userId);
  }
}
