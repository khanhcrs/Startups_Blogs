import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AdminArticleQueryDto } from './admin-article-query.dto';
import { ArticleListQueryDto } from './article-list-query.dto';

describe('article query DTOs', () => {
  it('transforms and accepts valid admin filters', async () => {
    const dto = plainToInstance(AdminArticleQueryDto, {
      page: '2',
      limit: '25',
      status: 'ARCHIVED',
      startDate: '2026-08-01',
    });

    await expect(validate(dto)).resolves.toHaveLength(0);
    expect(dto.page).toBe(2);
    expect(dto.limit).toBe(25);
  });

  it.each(['PENDING', 'REJECTED', 'published'])(
    'rejects non-canonical article status %s',
    async (status) => {
      const dto = plainToInstance(AdminArticleQueryDto, { status });

      await expect(validate(dto)).resolves.not.toHaveLength(0);
    },
  );

  it('rejects unsafe pagination and malformed dates', async () => {
    const adminQuery = plainToInstance(AdminArticleQueryDto, {
      page: '0',
      limit: '1000',
      endDate: 'not-a-date',
    });
    const publicQuery = plainToInstance(ArticleListQueryDto, {
      skip: '-1',
      take: '0',
    });

    await expect(validate(adminQuery)).resolves.toHaveLength(3);
    await expect(validate(publicQuery)).resolves.toHaveLength(2);
  });
});
