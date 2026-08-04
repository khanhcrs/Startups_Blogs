import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
export declare class ArticlesController {
    private readonly articlesService;
    constructor(articlesService: ArticlesService);
    create(createArticleDto: CreateArticleDto, req: any): Promise<{
        id: string;
        slug: string;
        viewCount: number;
        createdAt: Date;
        title: string;
        summary: string;
        content: string;
        status: string;
        category: string;
        publishedAt: Date | null;
        businessId: string | null;
        authorId: string;
    }>;
    findAll(category?: string, businessId?: string, skip?: string, take?: string): Promise<({
        business: {
            name: string;
            id: string;
            slug: string;
            logoUrl: string | null;
        } | null;
        author: {
            name: string;
            id: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        slug: string;
        viewCount: number;
        createdAt: Date;
        title: string;
        summary: string;
        content: string;
        status: string;
        category: string;
        publishedAt: Date | null;
        businessId: string | null;
        authorId: string;
    })[]>;
    findOne(slug: string): Promise<{
        business: {
            name: string;
            id: string;
            slug: string;
            logoUrl: string | null;
        } | null;
        author: {
            name: string;
            id: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        slug: string;
        viewCount: number;
        createdAt: Date;
        title: string;
        summary: string;
        content: string;
        status: string;
        category: string;
        publishedAt: Date | null;
        businessId: string | null;
        authorId: string;
    }>;
    update(id: string, updateArticleDto: UpdateArticleDto, req: any): Promise<{
        id: string;
        slug: string;
        viewCount: number;
        createdAt: Date;
        title: string;
        summary: string;
        content: string;
        status: string;
        category: string;
        publishedAt: Date | null;
        businessId: string | null;
        authorId: string;
    }>;
    remove(id: string, req: any): Promise<{
        id: string;
        slug: string;
        viewCount: number;
        createdAt: Date;
        title: string;
        summary: string;
        content: string;
        status: string;
        category: string;
        publishedAt: Date | null;
        businessId: string | null;
        authorId: string;
    }>;
}
