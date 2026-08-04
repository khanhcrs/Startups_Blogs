import { PrismaService } from '../prisma/prisma.service';
export declare class BookmarksService {
    private prisma;
    constructor(prisma: PrismaService);
    create(articleId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        articleId: string;
        userId: string;
    }>;
    remove(articleId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        articleId: string;
        userId: string;
    }>;
    findAll(userId: string): Promise<({
        article: {
            id: string;
            slug: string;
            createdAt: Date;
            title: string;
            summary: string;
        };
    } & {
        id: string;
        createdAt: Date;
        articleId: string;
        userId: string;
    })[]>;
}
