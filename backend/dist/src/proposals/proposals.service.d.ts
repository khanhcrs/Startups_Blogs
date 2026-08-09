import { PrismaService } from '../prisma/prisma.service';
export declare class ProposalsService {
    private prisma;
    constructor(prisma: PrismaService);
    getMyProposals(userId: string): Promise<{
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
    }[]>;
    getProposal(id: string, userId: string): Promise<{
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
    }>;
    approveProposal(id: string, userId: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        entityType: string;
        entityId: string;
        proposedChanges: import("@prisma/client/runtime/client").JsonValue;
        proposerId: string;
    }>;
    rejectProposal(id: string, userId: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        entityType: string;
        entityId: string;
        proposedChanges: import("@prisma/client/runtime/client").JsonValue;
        proposerId: string;
    }>;
}
