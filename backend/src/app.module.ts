import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { CognitoAuthGuard } from './common/auth/cognito-auth.guard';
import { RolesGuard } from './common/auth/roles.guard';
import { AuthorizationModule } from './common/authorization/authorization.module';
import { DatabaseModule } from './common/database/database.module';
import { validateEnvironment } from './config/env.schema';
import { HealthController } from './health/health.controller';
import { AuditModule } from './modules/audit/audit.module';
import { BusinessesModule } from './modules/businesses/businesses.module';
import { ContactRequestsModule } from './modules/contact-requests/contact-requests.module';
import { ContentModule } from './modules/content/content.module';
import { FeaturedOpportunitiesModule } from './modules/featured-opportunities/featured-opportunities.module';
import { FundingOpportunitiesModule } from './modules/funding-opportunities/funding-opportunities.module';
import { IdentityModule } from './modules/identity/identity.module';
import { InvestorsModule } from './modules/investors/investors.module';
import { ModerationModule } from './modules/moderation/moderation.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SavedItemsModule } from './modules/saved-items/saved-items.module';
import { SupportModule } from './modules/support/support.module';
import { TaxonomyModule } from './modules/taxonomy/taxonomy.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, validate: validateEnvironment }),
    DatabaseModule, AuthorizationModule, IdentityModule, UsersModule, TaxonomyModule,
    BusinessesModule, FundingOpportunitiesModule, InvestorsModule, SavedItemsModule,
    ContactRequestsModule, UploadsModule, ContentModule, ModerationModule,
    FeaturedOpportunitiesModule, NotificationsModule, SupportModule, AuditModule,
  ],
  controllers: [HealthController],
  providers: [
    { provide: APP_GUARD, useClass: CognitoAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
