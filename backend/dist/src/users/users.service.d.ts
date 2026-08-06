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
    getAllUsers(page: number, limit: number, role?: string): Promise<{
        data: {
            id: string;
            email: string;
            name: string;
            bio: string | null;
            location: string | null;
            joinedAt: Date;
            avatarUrl: string | null;
            role: import("@prisma/client").$Enums.Role;
            status: string;
            _count: {
                ownedBusinesses: number;
                articles: number;
                followers: number;
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
    updateUserStatus(id: string, status: string): Promise<{
        id: string;
        email: string;
        name: string;
        status: string;
    }>;
    getAdminUserDetails(id: string): Promise<{
        ownedBusinesses: {
            id: string;
            name: string;
            status: string;
            slug: string;
            industry: string;
            createdAt: Date;
        }[];
        articles: {
            id: string;
            status: string;
            slug: string;
            viewCount: number;
            createdAt: Date;
            title: string;
        }[];
        _count: {
            comments: number;
            followers: number;
            following: number;
        };
        id: string;
        email: string;
        name: string;
        bio: string | null;
        location: string | null;
        joinedAt: Date;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.Role;
        status: string;
    } | null>;
}
