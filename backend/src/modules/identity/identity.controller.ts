import { Controller, Headers, Post } from '@nestjs/common';
import { Public } from '../../common/auth/public.decorator';
import { IdentityService } from './identity.service';

@Controller('auth')
export class IdentityController {
  constructor(private readonly service: IdentityService) {}
  @Public() @Post('sync') sync(@Headers('authorization') authorization?: string) {
    return this.service.sync(authorization?.match(/^Bearer (.+)$/i)?.[1]);
  }
}
