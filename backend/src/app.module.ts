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

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, BusinessesModule, TeamMembersModule, FundingRoundsModule, FundingOpportunitiesModule, ArticlesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
