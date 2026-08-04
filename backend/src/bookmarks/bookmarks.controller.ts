import { Controller, Get, Post, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post(':articleId')
  create(@Param('articleId') articleId: string, @Request() req: any) {
    return this.bookmarksService.create(articleId, req.user.userId);
  }

  @Delete(':articleId')
  remove(@Param('articleId') articleId: string, @Request() req: any) {
    return this.bookmarksService.remove(articleId, req.user.userId);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.bookmarksService.findAll(req.user.userId);
  }
}
