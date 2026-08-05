import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { FundingRoundsService } from './funding-rounds.service';
import { CreateFundingRoundDto } from './dto/create-funding-round.dto';
import { UpdateFundingRoundDto } from './dto/update-funding-round.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('businesses/:businessId/funding-rounds')
export class FundingRoundsController {
  constructor(private readonly fundingRoundsService: FundingRoundsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Param('businessId') businessId: string,
    @Body() createFundingRoundDto: CreateFundingRoundDto,
    @Request() req: any,
  ) {
    return this.fundingRoundsService.create(businessId, createFundingRoundDto, req.user.userId);
  }

  @Get()
  findAll(@Param('businessId') businessId: string) {
    return this.fundingRoundsService.findAll(businessId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('businessId') businessId: string,
    @Param('id') id: string,
    @Body() updateFundingRoundDto: UpdateFundingRoundDto,
    @Request() req: any,
  ) {
    return this.fundingRoundsService.update(businessId, id, updateFundingRoundDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('businessId') businessId: string,
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.fundingRoundsService.remove(businessId, id, req.user.userId);
  }
}
