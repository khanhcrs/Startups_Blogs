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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactRequestsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let ContactRequestsService = class ContactRequestsService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(data) {
        const business = await this.prisma.business.findUnique({
            where: { id: data.businessId },
        });
        if (!business) {
            throw new common_1.NotFoundException('Doanh nghiệp không tồn tại');
        }
        const contactRequest = await this.prisma.contactRequest.create({
            data: {
                title: data.title,
                message: data.message,
                senderId: data.senderId,
                businessId: data.businessId,
                status: 'PENDING',
            },
            include: {
                sender: {
                    select: { id: true, name: true, avatarUrl: true, email: true },
                },
            }
        });
        await this.notificationsService.createNotification({
            userId: business.ownerId,
            title: 'Yêu cầu liên hệ mới',
            message: `Bạn nhận được một yêu cầu liên hệ mới từ ${contactRequest.sender.name} cho startup ${business.name}.`,
            type: 'CONTACT_REQUEST',
        });
        return contactRequest;
    }
    async findByBusiness(businessId, userId) {
        const business = await this.prisma.business.findUnique({
            where: { id: businessId },
        });
        if (!business) {
            throw new common_1.NotFoundException('Doanh nghiệp không tồn tại');
        }
        if (business.ownerId !== userId) {
            throw new common_1.UnauthorizedException('Bạn không có quyền xem thông tin này');
        }
        return this.prisma.contactRequest.findMany({
            where: { businessId },
            include: {
                sender: {
                    select: { id: true, name: true, avatarUrl: true, email: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.ContactRequestsService = ContactRequestsService;
exports.ContactRequestsService = ContactRequestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, notifications_service_1.NotificationsService])
], ContactRequestsService);
//# sourceMappingURL=contact-requests.service.js.map