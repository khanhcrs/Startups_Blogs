import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
