import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
export declare class ArticlesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createArticleDto: CreateArticleDto, authorId: string): Promise<{
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
    findAll(query: {
        category?: string;
        businessId?: string;
        skip?: number;
        take?: number;
    }): Promise<({
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
    findOneBySlug(slug: string): Promise<{
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
    update(id: string, updateArticleDto: UpdateArticleDto, authorId: string): Promise<{
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
    remove(id: string, authorId: string): Promise<{
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
