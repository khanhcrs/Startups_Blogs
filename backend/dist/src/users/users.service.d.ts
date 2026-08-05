import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    getPublicProfile(id: string): Promise<{
        id: string;
        name: string;
        bio: string | null;
        avatarUrl: string | null;
        location: string | null;
        followersCount: number;
        publishedCount: number;
    } | null>;
    createUser(data: Prisma.UserCreateInput): Promise<User>;
    updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User>;
    getAllUsers(page: number, limit: number): Promise<{
        data: {
            id: string;
            email: string;
            name: string;
            joinedAt: Date;
            role: import("@prisma/client").$Enums.Role;
            _count: {
                ownedBusinesses: number;
                articles: number;
            };
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateUserRole(id: string, role: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
    }>;
}
