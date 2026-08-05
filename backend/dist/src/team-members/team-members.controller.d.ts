import { TeamMembersService } from './team-members.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
export declare class TeamMembersController {
    private readonly teamMembersService;
    constructor(teamMembersService: TeamMembersService);
    create(businessId: string, createTeamMemberDto: CreateTeamMemberDto, req: any): Promise<{
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
    update(businessId: string, id: string, updateTeamMemberDto: UpdateTeamMemberDto, req: any): Promise<{
        id: string;
        name: string;
        bio: string | null;
        avatarUrl: string | null;
        role: string;
        userId: string | null;
        businessId: string;
    }>;
    remove(businessId: string, id: string, req: any): Promise<{
        id: string;
        name: string;
        bio: string | null;
        avatarUrl: string | null;
        role: string;
        userId: string | null;
        businessId: string;
    }>;
}
