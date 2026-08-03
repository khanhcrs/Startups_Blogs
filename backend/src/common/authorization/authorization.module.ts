import { Global, Module } from '@nestjs/common';
import { BusinessPolicyService } from './business-policy.service';

@Global()
@Module({ providers: [BusinessPolicyService], exports: [BusinessPolicyService] })
export class AuthorizationModule {}
