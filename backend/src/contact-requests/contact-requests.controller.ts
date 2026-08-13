import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ContactRequestsService } from './contact-requests.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/auth.types';

@Controller('businesses/:businessId/contact-requests')
export class ContactRequestsController {
  constructor(
    private readonly contactRequestsService: ContactRequestsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createContactRequest(
    @Param('businessId') businessId: string,
    @Body() body: { title: string; message: string },
    @Request() req: AuthenticatedRequest,
  ) {
    return this.contactRequestsService.create({
      businessId,
      senderId: req.user.userId,
      title: body.title,
      message: body.message,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getContactRequests(
    @Param('businessId') businessId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.contactRequestsService.findByBusiness(
      businessId,
      req.user.userId,
    );
  }
}
