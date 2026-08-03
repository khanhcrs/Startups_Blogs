import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PageQueryDto } from './page-query.dto';

describe('PageQueryDto', () => {
  it('applies safe defaults', async () => {
    const value = plainToInstance(PageQueryDto, {});
    expect(await validate(value)).toHaveLength(0);
    expect(value).toMatchObject({ page: 1, limit: 20 });
  });

  it('rejects a limit above 100', async () => {
    const value = plainToInstance(PageQueryDto, { page: '1', limit: '101' });
    expect(await validate(value)).not.toHaveLength(0);
  });
});
