import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/auth.types';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateArticleStatusDto } from './dto/update-article-status.dto';
import { AdminArticleQueryDto } from './dto/admin-article-query.dto';
import { ArticleListQueryDto } from './dto/article-list-query.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createArticleDto: CreateArticleDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.articlesService.create(createArticleDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMyArticles(@Request() req: AuthenticatedRequest) {
    return this.articlesService.findMyArticles(req.user.userId);
  }

  @Get()
  findAll(@Query() query: ArticleListQueryDto) {
    return this.articlesService.findAll(query);
  }

  @Get('tags')
  async getAllTags() {
    return this.articlesService.getAllTags();
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/all')
  async getAllArticles(@Query() query: AdminArticleQueryDto) {
    return this.articlesService.getAllArticles(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/:id')
  async getArticleForAdmin(@Param('id') id: string) {
    const data = await this.articlesService.findOneForAdmin(id);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put('admin/:id/status')
  async updateArticleStatus(
    @Param('id') id: string,
    @Body() dto: UpdateArticleStatusDto,
  ) {
    const data = await this.articlesService.updateArticleStatus(id, dto.status);
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
    @Request() req: AuthenticatedRequest,
  ) {
    return this.articlesService.update(id, updateArticleDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.articlesService.remove(id, req.user.userId);
  }
}
