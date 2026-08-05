import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

const mockPrismaService = {
  article: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  business: {
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
      const dto = { title: 'Test Article', summary: 'Sum', content: 'Cont', category: 'Cat' };
      prisma.article.create.mockResolvedValue({ id: '1', ...dto });
      
      const result = await service.create(dto, 'user1');
      expect(result).toEqual({ id: '1', ...dto });
      expect(prisma.article.create).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if business owner does not match', async () => {
      const dto = { title: 'T', summary: 'S', content: 'C', category: 'C', businessId: 'b1' };
      prisma.business.findUnique.mockResolvedValue({ id: 'b1', ownerId: 'otherUser' });
      
      await expect(service.create(dto, 'user1')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findMyArticles', () => {
    it('should return articles belonging to user', async () => {
      prisma.article.findMany.mockResolvedValue([{ id: '1', title: 'My Article' }]);
      const result = await service.findMyArticles('user1');
      expect(result).toEqual([{ id: '1', title: 'My Article' }]);
      expect(prisma.article.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { authorId: 'user1' }
      }));
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException if article not found', async () => {
      prisma.article.findUnique.mockResolvedValue(null);
      await expect(service.remove('1', 'user1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not author', async () => {
      prisma.article.findUnique.mockResolvedValue({ id: '1', authorId: 'user2' });
      await expect(service.remove('1', 'user1')).rejects.toThrow(ForbiddenException);
    });

    it('should delete article successfully if user is author', async () => {
      prisma.article.findUnique.mockResolvedValue({ id: '1', authorId: 'user1' });
      prisma.article.delete.mockResolvedValue({ id: '1' });
      
      const result = await service.remove('1', 'user1');
      expect(result).toEqual({ id: '1' });
      expect(prisma.article.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });
});
