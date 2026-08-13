import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

const mockPrismaService = {
  article: {
    count: jest.fn(),
    create: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  business: {
    findUnique: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
};

describe('ArticlesService', () => {
  let service: ArticlesService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an article successfully', async () => {
      const dto = {
        title: 'Test Article',
        summary: 'Sum',
        content: 'Cont',
        category: 'Cat',
      };
      prisma.article.create.mockResolvedValue({ id: '1', ...dto });

      const result = await service.create(dto, 'user1');
      expect(result).toEqual({ id: '1', ...dto });
      expect(prisma.article.create).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if business owner does not match', async () => {
      const dto = {
        title: 'T',
        summary: 'S',
        content: 'C',
        category: 'C',
        businessId: 'b1',
      };
      prisma.business.findUnique.mockResolvedValue({
        id: 'b1',
        ownerId: 'otherUser',
      });

      await expect(service.create(dto, 'user1')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it.each(['NEWS', 'News', ' news '])(
      'protects the News category regardless of casing (%s)',
      async (category) => {
        prisma.user.findUnique.mockResolvedValue({ role: 'USER' });
        const dto = {
          title: 'News',
          summary: 'Summary',
          content: 'Content',
          category,
        };

        await expect(service.create(dto, 'user1')).rejects.toThrow(
          ForbiddenException,
        );
        expect(prisma.article.create).not.toHaveBeenCalled();
      },
    );
  });

  describe('findMyArticles', () => {
    it('should return articles belonging to user', async () => {
      prisma.article.findMany.mockResolvedValue([
        { id: '1', title: 'My Article' },
      ]);
      const result = await service.findMyArticles('user1');
      expect(result).toEqual([{ id: '1', title: 'My Article' }]);
      expect(prisma.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { authorId: 'user1' },
        }),
      );
    });
  });

  describe('findOneForAdmin', () => {
    it('returns the admin detail without incrementing the public view count', async () => {
      const article = {
        id: 'article-1',
        title: 'Draft article',
        status: 'DRAFT',
        viewCount: 7,
      };
      prisma.article.findUnique.mockResolvedValue(article);

      await expect(service.findOneForAdmin('article-1')).resolves.toEqual(
        article,
      );
      expect(prisma.article.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'article-1' } }),
      );
      expect(prisma.article.update).not.toHaveBeenCalled();
    });

    it('throws when the requested admin article does not exist', async () => {
      prisma.article.findUnique.mockResolvedValue(null);

      await expect(service.findOneForAdmin('missing')).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.article.update).not.toHaveBeenCalled();
    });
  });

  describe('findOne public moderation gate', () => {
    it('only queries a published article before incrementing its view count', async () => {
      prisma.article.findFirst.mockResolvedValue(null);

      await expect(service.findOne('draft-slug')).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.article.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { slug: 'draft-slug', status: 'PUBLISHED' },
        }),
      );
      expect(prisma.article.update).not.toHaveBeenCalled();
    });
  });

  describe('getAllArticles', () => {
    it('applies the validated canonical status filter', async () => {
      prisma.article.findMany.mockResolvedValue([]);
      prisma.article.count.mockResolvedValue(0);

      await service.getAllArticles({
        page: 1,
        limit: 10,
        status: 'ARCHIVED',
      });

      expect(prisma.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'ARCHIVED' },
          skip: 0,
          take: 10,
        }),
      );
      expect(prisma.article.count).toHaveBeenCalledWith({
        where: { status: 'ARCHIVED' },
      });
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException if article not found', async () => {
      prisma.article.findUnique.mockResolvedValue(null);
      await expect(service.remove('1', 'user1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user is not author', async () => {
      prisma.article.findUnique.mockResolvedValue({
        id: '1',
        authorId: 'user2',
      });
      await expect(service.remove('1', 'user1')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should delete article successfully if user is author', async () => {
      prisma.article.findUnique.mockResolvedValue({
        id: '1',
        authorId: 'user1',
      });
      prisma.article.delete.mockResolvedValue({ id: '1' });

      const result = await service.remove('1', 'user1');
      expect(result).toEqual({ id: '1' });
      expect(prisma.article.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
