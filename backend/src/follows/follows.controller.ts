import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FollowsService } from './follows.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/auth.types';

@UseGuards(JwtAuthGuard)
@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post(':userId')
  create(
    @Param('userId') followingId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.followsService.create(followingId, req.user.userId);
  }

  @Delete(':userId')
  remove(
    @Param('userId') followingId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.followsService.remove(followingId, req.user.userId);
  }

  @Get('followers')
  getFollowers(@Request() req: AuthenticatedRequest) {
    return this.followsService.getFollowers(req.user.userId);
  }

  @Get('following')
  getFollowing(@Request() req: AuthenticatedRequest) {
    return this.followsService.getFollowing(req.user.userId);
  }
}
