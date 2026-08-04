import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        name: string;
        id: string;
        email: string;
        bio: string | null;
        location: string | null;
        joinedAt: Date;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.Role;
    } | null>;
}
