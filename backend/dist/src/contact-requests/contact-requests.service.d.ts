import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class ContactRequestsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(data: {
        businessId: string;
        senderId: string;
        title: string;
        message: string;
    }): Promise<{
        sender: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        title: string;
        businessId: string;
        message: string;
        updatedAt: Date;
        senderId: string;
    }>;
    findByBusiness(businessId: string, userId: string): Promise<({
        sender: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        title: string;
        businessId: string;
        message: string;
        updatedAt: Date;
        senderId: string;
    })[]>;
}
