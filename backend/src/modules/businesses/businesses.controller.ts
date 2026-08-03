import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import type { RequestPrincipal } from '../../common/auth/principal';
import { CurrentUser } from '../../common/auth/current-user.decorator';
import { Public } from '../../common/auth/public.decorator';
import { PageQueryDto } from '../../common/pagination/page-query.dto';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';

@Controller('businesses')
export class BusinessesController {
  constructor(private readonly service: BusinessesService) {}
  @Public() @Get() list(@Query() query: PageQueryDto) { return this.service.list(query); }
  @Public() @Get(':slug') detail(@Param('slug') slug: string) { return this.service.findPublicBySlug(slug); }
  @Post() create(@CurrentUser() user: RequestPrincipal, @Body() dto: CreateBusinessDto) { return this.service.create(user.userId, dto); }
}
