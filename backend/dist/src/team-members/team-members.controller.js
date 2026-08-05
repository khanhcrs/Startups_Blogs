"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMembersController = void 0;
const common_1 = require("@nestjs/common");
const team_members_service_1 = require("./team-members.service");
const create_team_member_dto_1 = require("./dto/create-team-member.dto");
const update_team_member_dto_1 = require("./dto/update-team-member.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let TeamMembersController = class TeamMembersController {
    teamMembersService;
    constructor(teamMembersService) {
        this.teamMembersService = teamMembersService;
    }
    create(businessId, createTeamMemberDto, req) {
        return this.teamMembersService.create(businessId, createTeamMemberDto, req.user.userId);
    }
    findAll(businessId) {
        return this.teamMembersService.findAll(businessId);
    }
    update(businessId, id, updateTeamMemberDto, req) {
        return this.teamMembersService.update(businessId, id, updateTeamMemberDto, req.user.userId);
    }
    remove(businessId, id, req) {
        return this.teamMembersService.remove(businessId, id, req.user.userId);
    }
};
exports.TeamMembersController = TeamMembersController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_team_member_dto_1.CreateTeamMemberDto, Object]),
    __metadata("design:returntype", void 0)
], TeamMembersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('businessId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TeamMembersController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_team_member_dto_1.UpdateTeamMemberDto, Object]),
    __metadata("design:returntype", void 0)
], TeamMembersController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], TeamMembersController.prototype, "remove", null);
exports.TeamMembersController = TeamMembersController = __decorate([
    (0, common_1.Controller)('businesses/:businessId/team-members'),
    __metadata("design:paramtypes", [team_members_service_1.TeamMembersService])
], TeamMembersController);
//# sourceMappingURL=team-members.controller.js.map