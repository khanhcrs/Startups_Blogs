import type { PrismaService } from '../prisma/prisma.service';
import { BusinessesService } from './businesses.service';

describe('BusinessesService admin query', () => {
  const findMany = jest.fn();
  const count = jest.fn();
  const service = new BusinessesService({
    business: { findMany, count },
  } as unknown as PrismaService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('applies validated pagination and all supported filters', async () => {
    findMany.mockResolvedValue([]);
    count.mockResolvedValue(0);

    await expect(
      service.findAllForAdmin({
        skip: 10,
        take: 25,
        status: 'SUSPENDED',
        search: 'Acme',
        stage: 'Growing',
        industry: 'Technology',
        startDate: '2026-08-01',
        endDate: '2026-08-31',
      }),
    ).resolves.toEqual({ data: [], meta: { total: 0, totalPages: 0 } });

    const inclusiveEndDate = new Date('2026-08-31');
    inclusiveEndDate.setHours(23, 59, 59, 999);
    const expectedWhere = {
      status: 'SUSPENDED',
      name: { contains: 'Acme', mode: 'insensitive' },
      businessStage: 'Growing',
      industry: { contains: 'Technology', mode: 'insensitive' },
      createdAt: {
        gte: new Date('2026-08-01'),
        lte: inclusiveEndDate,
      },
    };
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expectedWhere,
        skip: 10,
        take: 25,
      }),
    );
    expect(count).toHaveBeenCalledWith({ where: expectedWhere });
  });
});
