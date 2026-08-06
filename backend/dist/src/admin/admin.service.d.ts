import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        totalUsers: number;
        totalBusinesses: number;
        pendingBusinesses: number;
        totalArticles: number;
    }>;
    createProposal(entityType: string, entityId: string, changes: any, proposerId: string): Promise<{
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
