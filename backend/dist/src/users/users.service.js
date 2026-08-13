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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const cognito_groups_service_1 = require("./cognito-groups.service");
let UsersService = class UsersService {
    prisma;
    cognitoGroups;
    constructor(prisma, cognitoGroups) {
        this.prisma = prisma;
        this.cognitoGroups = cognitoGroups;
    }
    async findByEmail(email) {
        if (!email)
            return null;
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
    async findById(id) {
        return this.prisma.user.findUnique({
            where: { id },
            include: { ownedBusinesses: true },
        });
    }
    async findOrCreateFromCognito(data) {
        const bySubject = await this.prisma.user.findUnique({
            where: { cognitoSub: data.cognitoSub },
        });
        if (bySubject)
            return bySubject;
        const byEmail = await this.findByEmail(data.email);
        if (byEmail) {
            return this.prisma.user.update({
                where: { id: byEmail.id },
                data: { cognitoSub: data.cognitoSub },
            });
        }
        return this.prisma.user.create({
            data: {
                cognitoSub: data.cognitoSub,
                email: data.email,
                name: data.name || data.email.split('@')[0],
            },
        });
    }
    async getPublicProfile(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                bio: true,
                avatarUrl: true,
                location: true,
                _count: {
                    select: { followers: true, articles: true },
                },
            },
        });
        if (!user)
            return null;
        return {
            id: user.id,
            name: user.name,
            bio: user.bio,
            avatarUrl: user.avatarUrl,
            location: user.location,
            followersCount: user._count.followers,
            publishedCount: user._count.articles,
        };
    }
    async createUser(data) {
        return this.prisma.user.create({
            data,
        });
    }
    async updateUser(id, data) {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }
    async getAllUsers(page, limit, role) {
        const skip = (page - 1) * limit;
        const whereCondition = role ? { role: role } : {};
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where: whereCondition,
                skip,
                take: limit,
                orderBy: { joinedAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true,
                    bio: true,
                    location: true,
                    role: true,
                    status: true,
                    joinedAt: true,
                    _count: {
                        select: { articles: true, ownedBusinesses: true, followers: true },
                    },
                },
            }),
            this.prisma.user.count({ where: whereCondition }),
        ]);
        return {
            data: users,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async updateUserRole(id, role) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: { email: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        await this.cognitoGroups.setAdminMembership(user.email, role === client_1.Role.ADMIN);
        return this.prisma.user.update({
            where: { id },
            data: { role },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });
    }
    async syncRoleFromCognito(id, role) {
        await this.prisma.user.update({ where: { id }, data: { role } });
    }
    async updateUserStatus(id, status) {
        return this.prisma.user.update({
            where: { id },
            data: { status },
            select: {
                id: true,
                name: true,
                email: true,
                status: true,
            },
        });
    }
    async getAdminUserDetails(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                articles: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        status: true,
                        viewCount: true,
                        createdAt: true,
                    },
                    orderBy: { createdAt: 'desc' },
                },
                ownedBusinesses: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        status: true,
                        industry: true,
                        createdAt: true,
                    },
                    orderBy: { createdAt: 'desc' },
                },
                _count: {
                    select: { followers: true, following: true, comments: true },
                },
            },
        });
        if (!user)
            return null;
        return user;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cognito_groups_service_1.CognitoGroupsService])
], UsersService);
//# sourceMappingURL=users.service.js.map