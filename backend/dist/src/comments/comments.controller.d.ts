import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    create(articleId: string, createCommentDto: CreateCommentDto, req: any): Promise<{
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
    findAll(articleId: string): Promise<({
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
}
export declare class CommentsRootController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    removeAdmin(id: string): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        authorId: string;
        articleId: string;
        parentId: string | null;
    }>;
    update(id: string, body: {
        content: string;
    }, req: any): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        authorId: string;
        articleId: string;
        parentId: string | null;
    }>;
    remove(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        authorId: string;
        articleId: string;
        parentId: string | null;
    }>;
}
