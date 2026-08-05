import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getStats(): Promise<{
        success: boolean;
        data: {
            totalUsers: number;
            totalBusinesses: number;
            pendingBusinesses: number;
            totalArticles: number;
        };
    }>;
    proposeBusinessChange(id: string, changes: any, req: any): Promise<{
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
    proposeArticleChange(id: string, changes: any, req: any): Promise<{
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
