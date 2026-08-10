import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User, Role } from '@prisma/client';
import { CognitoGroupsService } from './cognito-groups.service';
import type { UserStatus } from './dto/update-user-status.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cognitoGroups: CognitoGroupsService,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    if (!email) return null;
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { ownedBusinesses: true },
    });
  }

  async findOrCreateFromCognito(data: {
    cognitoSub: string;
    email: string;
    name?: string;
  }): Promise<User> {
    const bySubject = await this.prisma.user.findUnique({
      where: { cognitoSub: data.cognitoSub },
    });
    if (bySubject) return bySubject;

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

  async getPublicProfile(id: string) {
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
    if (!user) return null;
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

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async getAllUsers(page: number, limit: number, role?: string) {
    const skip = (page - 1) * limit;
    const whereCondition = role ? { role: role as Role } : {};

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

  async updateUserRole(id: string, role: Role) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { email: true },
    });
    if (!user) throw new NotFoundException('User not found');

    await this.cognitoGroups.setAdminMembership(
      user.email,
      role === Role.ADMIN,
    );
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

  async syncRoleFromCognito(id: string, role: Role): Promise<void> {
    await this.prisma.user.update({ where: { id }, data: { role } });
  }

  async updateUserStatus(id: string, status: UserStatus) {
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

  async getAdminUserDetails(id: string) {
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

    if (!user) return null;

    return user;
  }
}
