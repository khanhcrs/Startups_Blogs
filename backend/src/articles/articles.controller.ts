import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.articlesService.findAll({
      category,
      businessId,
      skip: skip ? +skip : 0,
      take: take ? +take : 10,
    });
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.articlesService.findOneBySlug(slug);
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
