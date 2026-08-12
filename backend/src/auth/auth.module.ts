import { Global, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CognitoIdentityService } from './cognito-identity.service';

@Global()
@Module({
  imports: [
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [JwtAuthGuard, AuthService, CognitoIdentityService],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
