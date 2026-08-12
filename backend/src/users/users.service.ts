import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User, Role } from '@prisma/client';
import { CognitoGroupsService } from './cognito-groups.service';
import type { UserStatus } from './dto/update-user-status.dto';
import type { AdminUserQueryDto } from './dto/admin-user-query.dto';

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

  async findByCognitoSub(cognitoSub: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { cognitoSub } });
  }

  async findOrCreateFromCognito(data: {
    cognitoSub: string;
    email: string;
    emailVerified: boolean;
    name?: string;
  }): Promise<User> {
    const bySubject = await this.prisma.user.findUnique({
      where: { cognitoSub: data.cognitoSub },
    });
    if (bySubject) return bySubject;

    const byEmail = await this.findByEmail(data.email);
    if (byEmail) {
      if (byEmail.cognitoSub && byEmail.cognitoSub !== data.cognitoSub) {
        throw new ConflictException(
          'Email is already linked to another Cognito account',
        );
      }
      if (!data.emailVerified) {
        throw new UnauthorizedException(
          'Verified Cognito email is required to link this account',
        );
      }
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

  async getAllUsers(query: AdminUserQueryDto) {
    const { page = 1, limit = 10, role } = query;
    const skip = (page - 1) * limit;
    const where: Prisma.UserWhereInput = role ? { role } : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
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
      this.prisma.user.count({ where }),
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

  private async ensureAnotherActiveAdmin(
    client: Pick<PrismaService, 'user'>,
    targetId: string,
  ): Promise<void> {
    const remainingAdmins = await client.user.count({
      where: {
        id: { not: targetId },
        role: Role.ADMIN,
        status: 'ACTIVE',
      },
    });
    if (remainingAdmins === 0) {
      throw new ConflictException('At least one active admin must remain');
    }
  }

  async updateUserRole(id: string, role: Role, actorId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        cognitoSub: true,
        email: true,
        name: true,
        role: true,
        status: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    if (id === actorId && role !== Role.ADMIN) {
      throw new ForbiddenException('Admins cannot demote their own account');
    }
    const removesActiveAdmin =
      user.role === Role.ADMIN &&
      user.status === 'ACTIVE' &&
      role !== Role.ADMIN;
    if (removesActiveAdmin) {
      await this.ensureAnotherActiveAdmin(this.prisma, id);
    }

    const cognitoUsername = user.cognitoSub || user.email;
    try {
      await this.cognitoGroups.setAdminMembership(
        cognitoUsername,
        role === Role.ADMIN,
      );
      return await this.prisma.$transaction(
        async (transaction) => {
          const current = await transaction.user.findUnique({
            where: { id },
            select: { role: true, status: true },
          });
          if (!current) throw new NotFoundException('User not found');
          if (
            current.role === Role.ADMIN &&
            current.status === 'ACTIVE' &&
            role !== Role.ADMIN
          ) {
            await this.ensureAnotherActiveAdmin(transaction, id);
          }
          return transaction.user.update({
            where: { id },
            data: { role },
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error) {
      try {
        await this.cognitoGroups.setAdminMembership(
          cognitoUsername,
          user.role === Role.ADMIN,
        );
      } catch {
        throw new ServiceUnavailableException(
          'Role update failed and Cognito membership could not be restored',
        );
      }
      throw error;
    }
  }

  async syncRoleFromCognito(id: string, role: Role): Promise<void> {
    await this.prisma.user.update({ where: { id }, data: { role } });
  }

  async updateUserStatus(id: string, status: UserStatus, actorId: string) {
    if (id === actorId && status === 'LOCKED') {
      throw new ForbiddenException('Admins cannot lock their own account');
    }

    return this.prisma.$transaction(
      async (transaction) => {
        const current = await transaction.user.findUnique({
          where: { id },
          select: { role: true, status: true },
        });
        if (!current) throw new NotFoundException('User not found');
        if (
          current.role === Role.ADMIN &&
          current.status === 'ACTIVE' &&
          status === 'LOCKED'
        ) {
          await this.ensureAnotherActiveAdmin(transaction, id);
        }

        return transaction.user.update({
          where: { id },
          data: { status },
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
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
