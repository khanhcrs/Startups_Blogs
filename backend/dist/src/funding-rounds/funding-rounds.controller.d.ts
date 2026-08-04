import { FundingRoundsService } from './funding-rounds.service';
import { CreateFundingRoundDto } from './dto/create-funding-round.dto';
import { UpdateFundingRoundDto } from './dto/update-funding-round.dto';
export declare class FundingRoundsController {
    private readonly fundingRoundsService;
    constructor(fundingRoundsService: FundingRoundsService);
    create(businessId: string, createFundingRoundDto: CreateFundingRoundDto, req: any): Promise<{
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
    update(businessId: string, id: string, updateFundingRoundDto: UpdateFundingRoundDto, req: any): Promise<{
        id: string;
        businessId: string;
        roundName: string;
        amount: number;
        currency: string;
        date: Date;
        investors: string;
        isVerified: boolean;
    }>;
    remove(businessId: string, id: string, req: any): Promise<{
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
