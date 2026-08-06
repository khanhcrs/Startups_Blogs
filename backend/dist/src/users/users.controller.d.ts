import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllUsers(page?: string, limit?: string, role?: string): Promise<{
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
        success: boolean;
        data: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
    updateUserStatus(id: string, status: string): Promise<{
        success: boolean;
        data: {
            id: string;
            email: string;
            name: string;
            status: string;
        };
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
    adminUpdateUser(id: string, updateProfileDto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        name: string;
        bio: string | null;
        location: string | null;
        joinedAt: Date;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.Role;
        status: string;
    }>;
    getProfile(req: any): Promise<{
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
    getPublicProfile(id: string): Promise<{
        id: string;
        name: string;
        bio: string | null;
        avatarUrl: string | null;
        location: string | null;
        followersCount: number;
        publishedCount: number;
    } | null>;
    updateProfile(req: any, updateProfileDto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        name: string;
        bio: string | null;
        location: string | null;
        joinedAt: Date;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.Role;
        status: string;
    }>;
}
