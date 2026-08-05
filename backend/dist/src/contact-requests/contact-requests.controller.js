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
exports.ContactRequestsController = void 0;
const common_1 = require("@nestjs/common");
const contact_requests_service_1 = require("./contact-requests.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ContactRequestsController = class ContactRequestsController {
    contactRequestsService;
    constructor(contactRequestsService) {
        this.contactRequestsService = contactRequestsService;
    }
    async createContactRequest(businessId, body, req) {
        return this.contactRequestsService.create({
            businessId,
            senderId: req.user.userId,
            title: body.title,
            message: body.message,
        });
    }
    async getContactRequests(businessId, req) {
        return this.contactRequestsService.findByBusiness(businessId, req.user.userId);
    }
};
exports.ContactRequestsController = ContactRequestsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ContactRequestsController.prototype, "createContactRequest", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ContactRequestsController.prototype, "getContactRequests", null);
exports.ContactRequestsController = ContactRequestsController = __decorate([
    (0, common_1.Controller)('businesses/:businessId/contact-requests'),
    __metadata("design:paramtypes", [contact_requests_service_1.ContactRequestsService])
], ContactRequestsController);
//# sourceMappingURL=contact-requests.controller.js.map