import { BookmarksService } from './bookmarks.service';
export declare class BookmarksController {
    private readonly bookmarksService;
    constructor(bookmarksService: BookmarksService);
    create(articleId: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        articleId: string;
    }>;
    remove(articleId: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        articleId: string;
    }>;
    findAll(req: any): Promise<({
        article: {
            id: string;
            slug: string;
            title: string;
            summary: string;
            createdAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        articleId: string;
    })[]>;
}
