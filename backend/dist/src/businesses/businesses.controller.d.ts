import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
export declare class BusinessesController {
    private readonly businessesService;
    constructor(businessesService: BusinessesService);
    create(createBusinessDto: CreateBusinessDto, req: any): Promise<{
        name: string;
        id: string;
        location: string;
        slug: string;
        legalName: string | null;
        description: string;
        detailedOverview: string | null;
        businessType: string;
        businessStage: string;
        industry: string;
        website: string | null;
        logoUrl: string | null;
        coverUrl: string | null;
        savedCount: number;
        viewCount: number;
        createdAt: Date;
        ownerId: string;
    }>;
    findAll(skip?: string, take?: string): Promise<({
        owner: {
            name: string;
            id: string;
            avatarUrl: string | null;
        };
    } & {
        name: string;
        id: string;
        location: string;
        slug: string;
        legalName: string | null;
        description: string;
        detailedOverview: string | null;
        businessType: string;
        businessStage: string;
        industry: string;
        website: string | null;
        logoUrl: string | null;
        coverUrl: string | null;
        savedCount: number;
        viewCount: number;
        createdAt: Date;
        ownerId: string;
    })[]>;
    findOne(slug: string): Promise<{
        owner: {
            name: string;
            id: string;
            avatarUrl: string | null;
        };
    } & {
        name: string;
        id: string;
        location: string;
        slug: string;
        legalName: string | null;
        description: string;
        detailedOverview: string | null;
        businessType: string;
        businessStage: string;
        industry: string;
        website: string | null;
        logoUrl: string | null;
        coverUrl: string | null;
        savedCount: number;
        viewCount: number;
        createdAt: Date;
        ownerId: string;
    }>;
    update(id: string, updateBusinessDto: UpdateBusinessDto, req: any): Promise<{
        name: string;
        id: string;
        location: string;
        slug: string;
        legalName: string | null;
        description: string;
        detailedOverview: string | null;
        businessType: string;
        businessStage: string;
        industry: string;
        website: string | null;
        logoUrl: string | null;
        coverUrl: string | null;
        savedCount: number;
        viewCount: number;
        createdAt: Date;
        ownerId: string;
    }>;
    remove(id: string, req: any): Promise<{
        name: string;
        id: string;
        location: string;
        slug: string;
        legalName: string | null;
        description: string;
        detailedOverview: string | null;
        businessType: string;
        businessStage: string;
        industry: string;
        website: string | null;
        logoUrl: string | null;
        coverUrl: string | null;
        savedCount: number;
        viewCount: number;
        createdAt: Date;
        ownerId: string;
    }>;
}
