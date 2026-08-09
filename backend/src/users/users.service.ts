import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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
}
