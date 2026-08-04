import { PrismaService } from '../prisma/prisma.service';
import { CreateFundingRoundDto } from './dto/create-funding-round.dto';
import { UpdateFundingRoundDto } from './dto/update-funding-round.dto';
export declare class FundingRoundsService {
    private prisma;
    constructor(prisma: PrismaService);
    private checkBusinessOwnership;
    create(businessId: string, createFundingRoundDto: CreateFundingRoundDto, ownerId: string): Promise<{
        id: string;
        businessId: string;
        roundName: string;
        amount: number;
        currency: string;
        date: Date;
        investors: string;
        isVerified: boolean;
    }>;
    findAll(businessId: string): Promise<{
        id: string;
        businessId: string;
        roundName: string;
        amount: number;
        currency: string;
        date: Date;
        investors: string;
        isVerified: boolean;
    }[]>;
    update(businessId: string, id: string, updateFundingRoundDto: UpdateFundingRoundDto, ownerId: string): Promise<{
        id: string;
        businessId: string;
        roundName: string;
        amount: number;
        currency: string;
        date: Date;
        investors: string;
        isVerified: boolean;
    }>;
    remove(businessId: string, id: string, ownerId: string): Promise<{
        id: string;
        businessId: string;
        roundName: string;
        amount: number;
        currency: string;
        date: Date;
        investors: string;
        isVerified: boolean;
    }>;
}
