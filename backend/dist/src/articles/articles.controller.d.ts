import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
export declare class ArticlesController {
    private readonly articlesService;
    constructor(articlesService: ArticlesService);
    create(createArticleDto: CreateArticleDto, req: any): Promise<{
        id: string;
        status: string;
        slug: string;
        viewCount: number;
        createdAt: Date;
        title: string;
        summary: string;
        content: string;
        category: string;
        coverImage: string | null;
        tags: string[];
        likesCount: number;
        publishedAt: Date | null;
        authorId: string;
        businessId: string | null;
    }>;
    findMyArticles(req: any): Promise<({
        business: {
            id: string;
            name: string;
            slug: string;
            logoUrl: string | null;
        } | null;
    } & {
        id: string;
        status: string;
        slug: string;
        viewCount: number;
        createdAt: Date;
        title: string;
        summary: string;
        content: string;
        category: string;
        coverImage: string | null;
        tags: string[];
        likesCount: number;
        publishedAt: Date | null;
        authorId: string;
        businessId: string | null;
    })[]>;
    findAll(category?: string, businessId?: string, authorId?: string, tag?: string, search?: string, startDate?: string, endDate?: string, skip?: string, take?: string): Promise<{
        data: ({
            business: {
                id: string;
                name: string;
                slug: string;
                logoUrl: string | null;
            } | null;
            author: {
                id: string;
                name: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            status: string;
            slug: string;
            viewCount: number;
            createdAt: Date;
            title: string;
            summary: string;
            content: string;
            category: string;
            coverImage: string | null;
            tags: string[];
            likesCount: number;
            publishedAt: Date | null;
            authorId: string;
            businessId: string | null;
        })[];
        total: number;
    }>;
    getAllTags(): Promise<string[]>;
    getAllArticles(page?: string, limit?: string, category?: string, search?: string, tag?: string, startDate?: string, endDate?: string): Promise<{
        data: ({
            comments: ({
                author: {
                    id: string;
                    name: string;
                };
            } & {
                id: string;
                createdAt: Date;
                content: string;
                authorId: string;
                articleId: string;
                parentId: string | null;
            })[];
            author: {
                id: string;
                email: string;
                name: string;
            };
        } & {
            id: string;
            status: string;
            slug: string;
            viewCount: number;
            createdAt: Date;
            title: string;
            summary: string;
            content: string;
            category: string;
            coverImage: string | null;
            tags: string[];
            likesCount: number;
            publishedAt: Date | null;
            authorId: string;
            businessId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateArticleStatus(id: string, status: string): Promise<{
        success: boolean;
        data: {
            id: string;
            status: string;
            slug: string;
            viewCount: number;
            createdAt: Date;
            title: string;
            summary: string;
            content: string;
            category: string;
            coverImage: string | null;
            tags: string[];
            likesCount: number;
            publishedAt: Date | null;
            authorId: string;
            businessId: string | null;
        };
    }>;
    deleteArticleAdmin(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    findOne(idOrSlug: string): Promise<{
        business: {
            id: string;
            name: string;
            slug: string;
            logoUrl: string | null;
        } | null;
        author: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        status: string;
        slug: string;
        viewCount: number;
        createdAt: Date;
        title: string;
        summary: string;
        content: string;
        category: string;
        coverImage: string | null;
        tags: string[];
        likesCount: number;
        publishedAt: Date | null;
        authorId: string;
        businessId: string | null;
    }>;
    update(id: string, updateArticleDto: UpdateArticleDto, req: any): Promise<{
        id: string;
        status: string;
        slug: string;
        viewCount: number;
        createdAt: Date;
        title: string;
        summary: string;
        content: string;
        category: string;
        coverImage: string | null;
        tags: string[];
        likesCount: number;
        publishedAt: Date | null;
        authorId: string;
        businessId: string | null;
    }>;
    remove(id: string, req: any): Promise<{
        id: string;
        status: string;
        slug: string;
        viewCount: number;
        createdAt: Date;
        title: string;
        summary: string;
        content: string;
        category: string;
        coverImage: string | null;
        tags: string[];
        likesCount: number;
        publishedAt: Date | null;
        authorId: string;
        businessId: string | null;
    }>;
}
