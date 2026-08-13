"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const businesses_module_1 = require("./businesses/businesses.module");
const team_members_module_1 = require("./team-members/team-members.module");
const funding_rounds_module_1 = require("./funding-rounds/funding-rounds.module");
const funding_opportunities_module_1 = require("./funding-opportunities/funding-opportunities.module");
const articles_module_1 = require("./articles/articles.module");
const comments_module_1 = require("./comments/comments.module");
const bookmarks_module_1 = require("./bookmarks/bookmarks.module");
const saved_businesses_module_1 = require("./saved-businesses/saved-businesses.module");
const follows_module_1 = require("./follows/follows.module");
const upload_module_1 = require("./upload/upload.module");
const contact_requests_module_1 = require("./contact-requests/contact-requests.module");
const notifications_module_1 = require("./notifications/notifications.module");
const admin_module_1 = require("./admin/admin.module");
const proposals_module_1 = require("./proposals/proposals.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            businesses_module_1.BusinessesModule,
            team_members_module_1.TeamMembersModule,
            funding_rounds_module_1.FundingRoundsModule,
            funding_opportunities_module_1.FundingOpportunitiesModule,
            articles_module_1.ArticlesModule,
            comments_module_1.CommentsModule,
            bookmarks_module_1.BookmarksModule,
            saved_businesses_module_1.SavedBusinessesModule,
            follows_module_1.FollowsModule,
            upload_module_1.UploadModule,
            contact_requests_module_1.ContactRequestsModule,
            notifications_module_1.NotificationsModule,
            admin_module_1.AdminModule,
            proposals_module_1.ProposalsModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map