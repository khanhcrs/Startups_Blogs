import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createArticleDto: CreateArticleDto, @Request() req: any) {
    return this.articlesService.create(createArticleDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMyArticles(@Request() req: any) {
    return this.articlesService.findMyArticles(req.user.userId);
  }

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('businessId') businessId?: string,
    @Query('authorId') authorId?: string,
    @Query('tag') tag?: string,
    @Query('search') search?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.articlesService.findAll({
      category,
      businessId,
      authorId,
      tag,
      search,
      startDate,
      endDate,
      skip: skip ? +skip : 0,
      take: take ? +take : 10,
    });
  }

  @Get('tags')
  async getAllTags() {
    return this.articlesService.getAllTags();
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/all')
  async getAllArticles(
    @Query('page') page: string = '1', 
    @Query('limit') limit: string = '10',
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('tag') tag?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.articlesService.getAllArticles(Number(page), Number(limit), category, search, tag, startDate, endDate);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put('admin/:id/status')
  async updateArticleStatus(@Param('id') id: string, @Body('status') status: string) {
    const data = await this.articlesService.updateArticleStatus(id, status);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('admin/:id')
  async deleteArticleAdmin(@Param('id') id: string) {
    await this.articlesService.deleteArticleAdmin(id);
    return { success: true, message: 'Article deleted successfully' };
  }

  @Get(':idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.articlesService.findOne(idOrSlug);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @Request() req: any,
  ) {
    return this.articlesService.update(id, updateArticleDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.articlesService.remove(id, req.user.userId);
  }


}
