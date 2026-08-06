import { ProposalsService } from './proposals.service';
export declare class ProposalsController {
    private readonly proposalsService;
    constructor(proposalsService: ProposalsService);
    getMyProposals(req: any): Promise<{
        success: boolean;
        data: {
            entityName: string;
            entitySlug: string;
            proposer: {
                id: string;
                email: string;
                name: string;
            };
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            entityType: string;
            entityId: string;
            proposedChanges: import("@prisma/client/runtime/client").JsonValue;
            proposerId: string;
        }[];
    }>;
    getProposal(id: string, req: any): Promise<{
        success: boolean;
        data: {
            proposal: {
                proposer: {
                    id: string;
                    name: string;
                };
            } & {
                id: string;
                status: string;
                createdAt: Date;
                updatedAt: Date;
                entityType: string;
                entityId: string;
                proposedChanges: import("@prisma/client/runtime/client").JsonValue;
                proposerId: string;
            };
            currentData: any;
        };
    }>;
    approveProposal(id: string, req: any): Promise<{
        success: boolean;
        data: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            entityType: string;
            entityId: string;
            proposedChanges: import("@prisma/client/runtime/client").JsonValue;
            proposerId: string;
        };
    }>;
    rejectProposal(id: string, req: any): Promise<{
        success: boolean;
        data: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            entityType: string;
            entityId: string;
            proposedChanges: import("@prisma/client/runtime/client").JsonValue;
            proposerId: string;
        };
    }>;
}
