import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
export declare class ArticlesController {
    private readonly articlesService;
    constructor(articlesService: ArticlesService);
    create(createArticleDto: CreateArticleDto, req: any): Promise<{
        id: string;
        slug: string;
        title: string;
        summary: string;
        content: string;
        status: string;
        category: string;
        coverImage: string | null;
        tags: string[];
        viewCount: number;
        likesCount: number;
        createdAt: Date;
        publishedAt: Date | null;
        authorId: string;
        businessId: string | null;
    }>;
    findMyArticles(req: any): Promise<({
        business: {
            id: string;
            slug: string;
            name: string;
            logoUrl: string | null;
        } | null;
    } & {
        id: string;
        slug: string;
        title: string;
        summary: string;
        content: string;
        status: string;
        category: string;
        coverImage: string | null;
        tags: string[];
        viewCount: number;
        likesCount: number;
        createdAt: Date;
        publishedAt: Date | null;
        authorId: string;
        businessId: string | null;
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
                slug: string;
                name: string;
                logoUrl: string | null;
            } | null;
        } & {
            id: string;
            slug: string;
            title: string;
            summary: string;
            content: string;
            status: string;
            category: string;
            coverImage: string | null;
            tags: string[];
            viewCount: number;
            likesCount: number;
            createdAt: Date;
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
                content: string;
                createdAt: Date;
                authorId: string;
                articleId: string;
                parentId: string | null;
            })[];
            author: {
                id: string;
                name: string;
                email: string;
            };
        } & {
            id: string;
            slug: string;
            title: string;
            summary: string;
            content: string;
            status: string;
            category: string;
            coverImage: string | null;
            tags: string[];
            viewCount: number;
            likesCount: number;
            createdAt: Date;
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
            slug: string;
            title: string;
            summary: string;
            content: string;
            status: string;
            category: string;
            coverImage: string | null;
            tags: string[];
            viewCount: number;
            likesCount: number;
            createdAt: Date;
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
        author: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
        business: {
            id: string;
            slug: string;
            name: string;
            logoUrl: string | null;
        } | null;
    } & {
        id: string;
        slug: string;
        title: string;
        summary: string;
        content: string;
        status: string;
        category: string;
        coverImage: string | null;
        tags: string[];
        viewCount: number;
        likesCount: number;
        createdAt: Date;
        publishedAt: Date | null;
        authorId: string;
        businessId: string | null;
    }>;
    update(id: string, updateArticleDto: UpdateArticleDto, req: any): Promise<{
        id: string;
        slug: string;
        title: string;
        summary: string;
        content: string;
        status: string;
        category: string;
        coverImage: string | null;
        tags: string[];
        viewCount: number;
        likesCount: number;
        createdAt: Date;
        publishedAt: Date | null;
        authorId: string;
        businessId: string | null;
    }>;
    remove(id: string, req: any): Promise<{
        id: string;
        slug: string;
        title: string;
        summary: string;
        content: string;
        status: string;
        category: string;
        coverImage: string | null;
        tags: string[];
        viewCount: number;
        likesCount: number;
        createdAt: Date;
        publishedAt: Date | null;
        authorId: string;
        businessId: string | null;
    }>;
}
