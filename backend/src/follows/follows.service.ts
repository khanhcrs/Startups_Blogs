import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FollowsService {
  constructor(private prisma: PrismaService) {}

  async create(followingId: string, followerId: string) {
    if (followingId === followerId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const userToFollow = await this.prisma.user.findUnique({ where: { id: followingId } });
    if (!userToFollow) throw new NotFoundException('User not found');

    const existing = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } }
    });

    if (existing) {
      throw new ConflictException('You are already following this user');
    }

    return this.prisma.follow.create({
      data: { followerId, followingId }
    });
  }

  async remove(followingId: string, followerId: string) {
    const existing = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } }
    });

    if (!existing) {
      throw new NotFoundException('You are not following this user');
    }

    return this.prisma.follow.delete({
      where: { followerId_followingId: { followerId, followingId } }
    });
  }

  async getFollowers(userId: string) {
    return this.prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: { select: { id: true, name: true, avatarUrl: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getFollowing(userId: string) {
    return this.prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: { select: { id: true, name: true, avatarUrl: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
