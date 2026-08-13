import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BusinessesModule } from './businesses/businesses.module';
import { TeamMembersModule } from './team-members/team-members.module';
import { FundingRoundsModule } from './funding-rounds/funding-rounds.module';
import { FundingOpportunitiesModule } from './funding-opportunities/funding-opportunities.module';
import { ArticlesModule } from './articles/articles.module';
import { CommentsModule } from './comments/comments.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { SavedBusinessesModule } from './saved-businesses/saved-businesses.module';
import { FollowsModule } from './follows/follows.module';
import { UploadModule } from './upload/upload.module';
import { ContactRequestsModule } from './contact-requests/contact-requests.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AdminModule } from './admin/admin.module';
import { ProposalsModule } from './proposals/proposals.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    BusinessesModule,
    TeamMembersModule,
    FundingRoundsModule,
    FundingOpportunitiesModule,
    ArticlesModule,
    CommentsModule,
    BookmarksModule,
    SavedBusinessesModule,
    FollowsModule,
    UploadModule,
    ContactRequestsModule,
    NotificationsModule,
    AdminModule,
    ProposalsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
