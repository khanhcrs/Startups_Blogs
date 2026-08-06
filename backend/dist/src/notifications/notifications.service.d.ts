import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserNotifications(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        message: string;
        type: import("@prisma/client").$Enums.NotificationType;
        isRead: boolean;
        linkUrl: string | null;
    }[]>;
    markAsRead(notificationId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        message: string;
        type: import("@prisma/client").$Enums.NotificationType;
        isRead: boolean;
        linkUrl: string | null;
    }>;
    markAllAsRead(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    createNotification(data: {
        userId: string;
        title: string;
        message: string;
        type?: 'ANNOUNCEMENT' | 'SYSTEM' | 'CONTACT_REQUEST' | 'GENERAL';
        linkUrl?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        message: string;
        type: import("@prisma/client").$Enums.NotificationType;
        isRead: boolean;
        linkUrl: string | null;
    }>;
}
