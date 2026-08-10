import { Global, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CognitoGroupsService } from './cognito-groups.service';

@Global()
@Module({
  providers: [UsersService, CognitoGroupsService],
  controllers: [UsersController],
  exports: [UsersService], // Important for AuthModule
})
export class UsersModule {}
