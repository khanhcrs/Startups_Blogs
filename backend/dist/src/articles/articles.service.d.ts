import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
export declare class ArticlesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createArticleDto: CreateArticleDto, authorId: string): Promise<{
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
    findMyArticles(authorId: string): Promise<({
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
    findAll(query: {
        category?: string;
        businessId?: string;
        skip?: number;
        take?: number;
    }): Promise<({
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
    update(id: string, updateArticleDto: UpdateArticleDto, authorId: string): Promise<{
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
    remove(id: string, authorId: string): Promise<{
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
