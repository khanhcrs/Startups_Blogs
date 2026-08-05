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
        createdAt: Date;
        content: string;
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
            createdAt: Date;
            content: string;
            authorId: string;
            articleId: string;
            parentId: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        content: string;
        authorId: string;
        articleId: string;
        parentId: string | null;
    })[]>;
    remove(id: string, authorId: string): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        authorId: string;
        articleId: string;
        parentId: string | null;
    }>;
}
