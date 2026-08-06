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
exports.BusinessesController = void 0;
const common_1 = require("@nestjs/common");
const businesses_service_1 = require("./businesses.service");
const create_business_dto_1 = require("./dto/create-business.dto");
const update_business_dto_1 = require("./dto/update-business.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let BusinessesController = class BusinessesController {
    businessesService;
    constructor(businessesService) {
        this.businessesService = businessesService;
    }
    create(createBusinessDto, req) {
        return this.businessesService.create(createBusinessDto, req.user.userId);
    }
    findAll(skip, take) {
        return this.businessesService.findAll(skip ? +skip : 0, take ? +take : 10);
    }
    findAllForAdmin(req, skip, take, status, search, stage, industry, startDate, endDate) {
        if (req.user.role !== 'ADMIN') {
            throw new common_1.ForbiddenException('Only admin can access this route');
        }
        return this.businessesService.findAllForAdmin(skip ? +skip : 0, take ? +take : 10, status, search, stage, industry, startDate, endDate);
    }
    updateStatus(id, status, req) {
        if (req.user.role !== 'ADMIN') {
            throw new common_1.ForbiddenException('Only admin can access this route');
        }
        return this.businessesService.updateStatus(id, status);
    }
    findOneForAdmin(id, req) {
        if (req.user.role !== 'ADMIN') {
            throw new common_1.ForbiddenException('Only admin can access this route');
        }
        return this.businessesService.findOneForAdmin(id);
    }
    updateAsAdmin(id, updateBusinessDto, req) {
        if (req.user.role !== 'ADMIN') {
            throw new common_1.ForbiddenException('Only admin can access this route');
        }
        return this.businessesService.updateAsAdmin(id, updateBusinessDto);
    }
    findOne(slug) {
        return this.businessesService.findOneBySlug(slug);
    }
    update(id, updateBusinessDto, req) {
        return this.businessesService.update(id, updateBusinessDto, req.user.userId);
    }
    remove(id, req) {
        return this.businessesService.remove(id, req.user.userId);
    }
};
exports.BusinessesController = BusinessesController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_business_dto_1.CreateBusinessDto, Object]),
    __metadata("design:returntype", void 0)
], BusinessesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('skip')),
    __param(1, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BusinessesController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('admin/all'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('skip')),
    __param(2, (0, common_1.Query)('take')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('search')),
    __param(5, (0, common_1.Query)('stage')),
    __param(6, (0, common_1.Query)('industry')),
    __param(7, (0, common_1.Query)('startDate')),
    __param(8, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], BusinessesController.prototype, "findAllForAdmin", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('admin/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], BusinessesController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('admin/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BusinessesController.prototype, "findOneForAdmin", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('admin/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], BusinessesController.prototype, "updateAsAdmin", null);
__decorate([
    (0, common_1.Get)(':slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BusinessesController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_business_dto_1.UpdateBusinessDto, Object]),
    __metadata("design:returntype", void 0)
], BusinessesController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BusinessesController.prototype, "remove", null);
exports.BusinessesController = BusinessesController = __decorate([
    (0, common_1.Controller)('businesses'),
    __metadata("design:paramtypes", [businesses_service_1.BusinessesService])
], BusinessesController);
//# sourceMappingURL=businesses.controller.js.map