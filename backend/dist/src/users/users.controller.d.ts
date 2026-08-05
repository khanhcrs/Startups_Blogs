import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllUsers(page?: string, limit?: string): Promise<{
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
        success: boolean;
        data: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
        };
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
    }>;
}
