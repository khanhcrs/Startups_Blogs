import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../../common/auth/current-user.decorator';
import type { RequestPrincipal } from '../../common/auth/principal';
import { Public } from '../../common/auth/public.decorator';
import { PageQueryDto } from '../../common/pagination/page-query.dto';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { FundingOpportunitiesService } from './funding-opportunities.service';

@Controller()
export class FundingOpportunitiesController {
  constructor(private readonly service: FundingOpportunitiesService) {}
  @Public() @Get('funding-opportunities') list(@Query() query: PageQueryDto) { return this.service.list(query); }
  @Public() @Get('funding-opportunities/:slug') detail(@Param('slug') slug: string) { return this.service.detail(slug); }
  @Post('businesses/:businessId/funding-opportunities') create(@CurrentUser() user: RequestPrincipal, @Param('businessId') businessId: string, @Body() dto: CreateOpportunityDto) { return this.service.create(user.userId, businessId, dto); }
}
