import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AdminBusinessQueryDto } from './admin-business-query.dto';
import { BUSINESS_STATUSES } from './update-business-status.dto';

describe('AdminBusinessQueryDto', () => {
  it('applies safe pagination defaults', async () => {
    const dto = plainToInstance(AdminBusinessQueryDto, {});

    await expect(validate(dto)).resolves.toHaveLength(0);
    expect(dto).toMatchObject({ skip: 0, take: 10 });
  });

  it.each(BUSINESS_STATUSES)(
    'accepts canonical business status %s',
    async (status) => {
      const dto = plainToInstance(AdminBusinessQueryDto, {
        skip: '20',
        take: '100',
        status,
        search: 'startup',
        stage: 'Growing',
        industry: 'Technology',
        startDate: '2026-08-01',
        endDate: '2026-08-31',
      });

      await expect(validate(dto)).resolves.toHaveLength(0);
      expect(dto.skip).toBe(20);
      expect(dto.take).toBe(100);
    },
  );

  it('rejects unsafe pagination, malformed dates and unsupported status', async () => {
    const dto = plainToInstance(AdminBusinessQueryDto, {
      skip: '-1',
      take: '101',
      status: 'DELETED',
      startDate: 'not-a-date',
      endDate: 'also-not-a-date',
    });

    await expect(validate(dto)).resolves.toHaveLength(5);
  });
});
