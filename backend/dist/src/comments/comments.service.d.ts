import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class CommentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(articleId: string, createCommentDto: CreateCommentDto, authorId: string): Promise<{
        author: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        content: string;
        createdAt: Date;
        authorId: string;
        articleId: string;
        parentId: string | null;
    }>;
    findAllByArticle(articleId: string): Promise<({
        author: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
        replies: ({
            author: {
                id: string;
                name: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            content: string;
            createdAt: Date;
            authorId: string;
            articleId: string;
            parentId: string | null;
        })[];
    } & {
        id: string;
        content: string;
        createdAt: Date;
        authorId: string;
        articleId: string;
        parentId: string | null;
    })[]>;
    update(id: string, content: string, authorId: string): Promise<{
        id: string;
        content: string;
        createdAt: Date;
        authorId: string;
        articleId: string;
        parentId: string | null;
    }>;
    removeAdmin(id: string): Promise<{
        id: string;
        content: string;
        createdAt: Date;
        authorId: string;
        articleId: string;
        parentId: string | null;
    }>;
    remove(id: string, requesterId: string): Promise<{
        id: string;
        content: string;
        createdAt: Date;
        authorId: string;
        articleId: string;
        parentId: string | null;
    }>;
}
