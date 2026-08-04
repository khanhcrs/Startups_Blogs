import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
export declare class BusinessesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createBusinessDto: CreateBusinessDto, ownerId: string): Promise<{
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
    findAll(skip?: number, take?: number): Promise<({
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
    findOneBySlug(slug: string): Promise<{
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
    update(id: string, updateBusinessDto: UpdateBusinessDto, ownerId: string): Promise<{
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
    remove(id: string, ownerId: string): Promise<{
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
