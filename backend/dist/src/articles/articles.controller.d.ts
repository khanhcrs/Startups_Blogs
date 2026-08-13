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
        title: string;
        summary: string;
        content: string;
        category: string;
        coverImage: string | null;
        tags: string[];
        authorId: string;
        businessId: string | null;
        viewCount: number;
        likesCount: number;
        createdAt: Date;
        publishedAt: Date | null;
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
        title: string;
        summary: string;
        content: string;
        category: string;
        coverImage: string | null;
        tags: string[];
        authorId: string;
        businessId: string | null;
        viewCount: number;
        likesCount: number;
        createdAt: Date;
        publishedAt: Date | null;
    })[]>;
    findAll(category?: string, businessId?: string, authorId?: string, tag?: string, search?: string, startDate?: string, endDate?: string, skip?: string, take?: string): Promise<{
        data: ({
            author: {
                id: string;
                name: string;
                avatarUrl: string | null;
            };
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
            title: string;
            summary: string;
            content: string;
            category: string;
            coverImage: string | null;
            tags: string[];
            authorId: string;
            businessId: string | null;
            viewCount: number;
            likesCount: number;
            createdAt: Date;
            publishedAt: Date | null;
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
                content: string;
                authorId: string;
                createdAt: Date;
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
            title: string;
            summary: string;
            content: string;
            category: string;
            coverImage: string | null;
            tags: string[];
            authorId: string;
            businessId: string | null;
            viewCount: number;
            likesCount: number;
            createdAt: Date;
            publishedAt: Date | null;
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
            title: string;
            summary: string;
            content: string;
            category: string;
            coverImage: string | null;
            tags: string[];
            authorId: string;
            businessId: string | null;
            viewCount: number;
            likesCount: number;
            createdAt: Date;
            publishedAt: Date | null;
        };
    }>;
    deleteArticleAdmin(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    findOne(idOrSlug: string): Promise<{
        author: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
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
        title: string;
        summary: string;
        content: string;
        category: string;
        coverImage: string | null;
        tags: string[];
        authorId: string;
        businessId: string | null;
        viewCount: number;
        likesCount: number;
        createdAt: Date;
        publishedAt: Date | null;
    }>;
    update(id: string, updateArticleDto: UpdateArticleDto, req: any): Promise<{
        id: string;
        status: string;
        slug: string;
        title: string;
        summary: string;
        content: string;
        category: string;
        coverImage: string | null;
        tags: string[];
        authorId: string;
        businessId: string | null;
        viewCount: number;
        likesCount: number;
        createdAt: Date;
        publishedAt: Date | null;
    }>;
    remove(id: string, req: any): Promise<{
        id: string;
        status: string;
        slug: string;
        title: string;
        summary: string;
        content: string;
        category: string;
        coverImage: string | null;
        tags: string[];
        authorId: string;
        businessId: string | null;
        viewCount: number;
        likesCount: number;
        createdAt: Date;
        publishedAt: Date | null;
    }>;
}
