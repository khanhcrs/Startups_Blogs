import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
export declare class ArticlesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createArticleDto: CreateArticleDto, authorId: string): Promise<{
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
    findMyArticles(authorId: string): Promise<({
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
    findAll(query: {
        category?: string;
        businessId?: string;
        authorId?: string;
        tag?: string;
        search?: string;
        startDate?: string;
        endDate?: string;
        skip?: number;
        take?: number;
    }): Promise<{
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
    update(id: string, updateArticleDto: UpdateArticleDto, authorId: string): Promise<{
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
    remove(id: string, authorId: string): Promise<{
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
    getAllTags(): Promise<string[]>;
    getAllArticles(page?: number, limit?: number, category?: string, search?: string, tag?: string, startDate?: string, endDate?: string): Promise<{
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
    deleteArticleAdmin(id: string): Promise<{
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
