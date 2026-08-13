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
} from '@nestjs/common';
import { FundingOpportunitiesService } from './funding-opportunities.service';
import { CreateFundingOpportunityDto } from './dto/create-funding-opportunity.dto';
import { UpdateFundingOpportunityDto } from './dto/update-funding-opportunity.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/auth.types';

@Controller('businesses/:businessId/funding-opportunities')
export class FundingOpportunitiesController {
  constructor(
    private readonly fundingOpportunitiesService: FundingOpportunitiesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Param('businessId') businessId: string,
    @Body() createFundingOpportunityDto: CreateFundingOpportunityDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.fundingOpportunitiesService.create(
      businessId,
      createFundingOpportunityDto,
      req.user.userId,
    );
  }

  @Get()
  findAll(@Param('businessId') businessId: string) {
    return this.fundingOpportunitiesService.findAll(businessId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('businessId') businessId: string,
    @Param('id') id: string,
    @Body() updateFundingOpportunityDto: UpdateFundingOpportunityDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.fundingOpportunitiesService.update(
      businessId,
      id,
      updateFundingOpportunityDto,
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('businessId') businessId: string,
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.fundingOpportunitiesService.remove(
      businessId,
      id,
      req.user.userId,
    );
  }
}
