import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    create(articleId: string, createCommentDto: CreateCommentDto, req: any): Promise<{
        author: {
            name: string;
            id: string;
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
    findAll(articleId: string): Promise<({
        author: {
            name: string;
            id: string;
            avatarUrl: string | null;
        };
        replies: ({
            author: {
                name: string;
                id: string;
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
}
export declare class CommentsRootController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    remove(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        authorId: string;
        articleId: string;
        parentId: string | null;
    }>;
}
