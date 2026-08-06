import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('proposals')
@UseGuards(JwtAuthGuard)
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Get('me')
  async getMyProposals(@Request() req: any) {
    const data = await this.proposalsService.getMyProposals(req.user.id);
    return { success: true, data };
  }

  @Get(':id')
  async getProposal(@Param('id') id: string, @Request() req: any) {
    const data = await this.proposalsService.getProposal(id, req.user.id);
    return { success: true, data };
  }

  @Post(':id/approve')
  async approveProposal(@Param('id') id: string, @Request() req: any) {
    const data = await this.proposalsService.approveProposal(id, req.user.id);
    return { success: true, data };
  }

  @Post(':id/reject')
  async rejectProposal(@Param('id') id: string, @Request() req: any) {
    const data = await this.proposalsService.rejectProposal(id, req.user.id);
    return { success: true, data };
  }
}
