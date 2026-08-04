import { BookmarksService } from './bookmarks.service';
export declare class BookmarksController {
    private readonly bookmarksService;
    constructor(bookmarksService: BookmarksService);
    create(articleId: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        articleId: string;
        userId: string;
    }>;
    remove(articleId: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        articleId: string;
        userId: string;
    }>;
    findAll(req: any): Promise<({
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
