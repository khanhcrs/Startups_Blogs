import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
export declare class TeamMembersService {
    private prisma;
    constructor(prisma: PrismaService);
    private checkBusinessOwnership;
    create(businessId: string, createTeamMemberDto: CreateTeamMemberDto, ownerId: string): Promise<{
        id: string;
        name: string;
        bio: string | null;
        avatarUrl: string | null;
        role: string;
        userId: string | null;
        businessId: string;
    }>;
    findAll(businessId: string): Promise<{
        id: string;
        name: string;
        bio: string | null;
        avatarUrl: string | null;
        role: string;
        userId: string | null;
        businessId: string;
    }[]>;
    update(businessId: string, id: string, updateTeamMemberDto: UpdateTeamMemberDto, ownerId: string): Promise<{
        id: string;
        name: string;
        bio: string | null;
        avatarUrl: string | null;
        role: string;
        userId: string | null;
        businessId: string;
    }>;
    remove(businessId: string, id: string, ownerId: string): Promise<{
        id: string;
        name: string;
        bio: string | null;
        avatarUrl: string | null;
        role: string;
        userId: string | null;
        businessId: string;
    }>;
}
