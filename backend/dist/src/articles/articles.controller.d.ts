import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
export declare class ArticlesController {
    private readonly articlesService;
    constructor(articlesService: ArticlesService);
    create(createArticleDto: CreateArticleDto, req: any): Promise<{
        id: string;
        slug: string;
        status: string;
        viewCount: number;
        createdAt: Date;
        category: string;
        title: string;
        summary: string;
        content: string;
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
        slug: string;
        status: string;
        viewCount: number;
        createdAt: Date;
        category: string;
        title: string;
        summary: string;
        content: string;
        coverImage: string | null;
        tags: string[];
        likesCount: number;
        publishedAt: Date | null;
        authorId: string;
        businessId: string | null;
    })[]>;
    findAll(category?: string, businessId?: string, skip?: string, take?: string): Promise<({
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
        slug: string;
        status: string;
        viewCount: number;
        createdAt: Date;
        category: string;
        title: string;
        summary: string;
        content: string;
        coverImage: string | null;
        tags: string[];
        likesCount: number;
        publishedAt: Date | null;
        authorId: string;
        businessId: string | null;
    })[]>;
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
        slug: string;
        status: string;
        viewCount: number;
        createdAt: Date;
        category: string;
        title: string;
        summary: string;
        content: string;
        coverImage: string | null;
        tags: string[];
        likesCount: number;
        publishedAt: Date | null;
        authorId: string;
        businessId: string | null;
    }>;
    update(id: string, updateArticleDto: UpdateArticleDto, req: any): Promise<{
        id: string;
        slug: string;
        status: string;
        viewCount: number;
        createdAt: Date;
        category: string;
        title: string;
        summary: string;
        content: string;
        coverImage: string | null;
        tags: string[];
        likesCount: number;
        publishedAt: Date | null;
        authorId: string;
        businessId: string | null;
    }>;
    remove(id: string, req: any): Promise<{
        id: string;
        slug: string;
        status: string;
        viewCount: number;
        createdAt: Date;
        category: string;
        title: string;
        summary: string;
        content: string;
        coverImage: string | null;
        tags: string[];
        likesCount: number;
        publishedAt: Date | null;
        authorId: string;
        businessId: string | null;
    }>;
}
