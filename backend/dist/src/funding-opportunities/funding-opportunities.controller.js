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
exports.FundingOpportunitiesController = void 0;
const common_1 = require("@nestjs/common");
const funding_opportunities_service_1 = require("./funding-opportunities.service");
const create_funding_opportunity_dto_1 = require("./dto/create-funding-opportunity.dto");
const update_funding_opportunity_dto_1 = require("./dto/update-funding-opportunity.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let FundingOpportunitiesController = class FundingOpportunitiesController {
    fundingOpportunitiesService;
    constructor(fundingOpportunitiesService) {
        this.fundingOpportunitiesService = fundingOpportunitiesService;
    }
    create(businessId, createFundingOpportunityDto, req) {
        return this.fundingOpportunitiesService.create(businessId, createFundingOpportunityDto, req.user.userId);
    }
    findAll(businessId) {
        return this.fundingOpportunitiesService.findAll(businessId);
    }
    update(businessId, id, updateFundingOpportunityDto, req) {
        return this.fundingOpportunitiesService.update(businessId, id, updateFundingOpportunityDto, req.user.userId);
    }
    remove(businessId, id, req) {
        return this.fundingOpportunitiesService.remove(businessId, id, req.user.userId);
    }
};
exports.FundingOpportunitiesController = FundingOpportunitiesController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_funding_opportunity_dto_1.CreateFundingOpportunityDto, Object]),
    __metadata("design:returntype", void 0)
], FundingOpportunitiesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('businessId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FundingOpportunitiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_funding_opportunity_dto_1.UpdateFundingOpportunityDto, Object]),
    __metadata("design:returntype", void 0)
], FundingOpportunitiesController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], FundingOpportunitiesController.prototype, "remove", null);
exports.FundingOpportunitiesController = FundingOpportunitiesController = __decorate([
    (0, common_1.Controller)('businesses/:businessId/funding-opportunities'),
    __metadata("design:paramtypes", [funding_opportunities_service_1.FundingOpportunitiesService])
], FundingOpportunitiesController);
//# sourceMappingURL=funding-opportunities.controller.js.map