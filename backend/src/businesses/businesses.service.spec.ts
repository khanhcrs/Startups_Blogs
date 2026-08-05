import { Test, TestingModule } from '@nestjs/testing';
import { BusinessesService } from './businesses.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('BusinessesService', () => {
  let service: BusinessesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    business: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<BusinessesService>(BusinessesService);
    prisma = module.get<PrismaService>(PrismaService);
    
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a business with generated slug', async () => {
      const dto = {
        name: 'My Startup',
        description: 'Desc',
        businessType: 'B2B',
        businessStage: 'Seed',
        industry: 'Tech',
        location: 'VN',
      };
      
      mockPrismaService.business.create.mockResolvedValueOnce({ id: '1', ...dto, slug: 'mock-slug', ownerId: 'user1' });

      const result = await service.create(dto, 'user1');
      expect(result).toHaveProperty('id', '1');
      expect(prisma.business.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          ...dto,
          ownerId: 'user1',
          slug: expect.stringMatching(/my-startup-\d+/),
        }),
      });
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if business not found', async () => {
      mockPrismaService.business.findUnique.mockResolvedValueOnce(null);
      await expect(service.update('1', { name: 'New' }, 'user1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not owner', async () => {
      mockPrismaService.business.findUnique.mockResolvedValueOnce({ id: '1', ownerId: 'user2' });
      await expect(service.update('1', { name: 'New' }, 'user1')).rejects.toThrow(ForbiddenException);
    });

    it('should update business successfully', async () => {
      mockPrismaService.business.findUnique.mockResolvedValueOnce({ id: '1', ownerId: 'user1' });
      mockPrismaService.business.update.mockResolvedValueOnce({ id: '1', name: 'New' });

      const result = await service.update('1', { name: 'New' }, 'user1');
      expect(result).toEqual({ id: '1', name: 'New' });
      expect(prisma.business.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { name: 'New' },
      });
    });
  });

  describe('remove', () => {
    it('should delete business if owner', async () => {
      mockPrismaService.business.findUnique.mockResolvedValueOnce({ id: '1', ownerId: 'user1' });
      mockPrismaService.business.delete.mockResolvedValueOnce({ id: '1' });

      const result = await service.remove('1', 'user1');
      expect(result).toEqual({ id: '1' });
      expect(prisma.business.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });
});
