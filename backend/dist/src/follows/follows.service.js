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
exports.FollowsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FollowsService = class FollowsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(followingId, followerId) {
        if (followingId === followerId) {
            throw new common_1.BadRequestException('You cannot follow yourself');
        }
        const userToFollow = await this.prisma.user.findUnique({ where: { id: followingId } });
        if (!userToFollow)
            throw new common_1.NotFoundException('User not found');
        const existing = await this.prisma.follow.findUnique({
            where: { followerId_followingId: { followerId, followingId } }
        });
        if (existing) {
            throw new common_1.ConflictException('You are already following this user');
        }
        return this.prisma.follow.create({
            data: { followerId, followingId }
        });
    }
    async remove(followingId, followerId) {
        const existing = await this.prisma.follow.findUnique({
            where: { followerId_followingId: { followerId, followingId } }
        });
        if (!existing) {
            throw new common_1.NotFoundException('You are not following this user');
        }
        return this.prisma.follow.delete({
            where: { followerId_followingId: { followerId, followingId } }
        });
    }
    async getFollowers(userId) {
        return this.prisma.follow.findMany({
            where: { followingId: userId },
            include: {
                follower: { select: { id: true, name: true, avatarUrl: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async getFollowing(userId) {
        return this.prisma.follow.findMany({
            where: { followerId: userId },
            include: {
                following: { select: { id: true, name: true, avatarUrl: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
};
exports.FollowsService = FollowsService;
exports.FollowsService = FollowsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FollowsService);
//# sourceMappingURL=follows.service.js.map