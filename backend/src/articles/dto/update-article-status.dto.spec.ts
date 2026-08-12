import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateArticleDto } from './create-article.dto';
import { UpdateArticleDto } from './update-article.dto';
import { UpdateArticleStatusDto } from './update-article-status.dto';

describe('UpdateArticleStatusDto', () => {
  it.each(['DRAFT', 'PUBLISHED', 'ARCHIVED'])('accepts %s', async (status) => {
    const dto = new UpdateArticleStatusDto();
    dto.status = status as UpdateArticleStatusDto['status'];

    await expect(validate(dto)).resolves.toHaveLength(0);
  });

  it('rejects an unknown article status', async () => {
    const dto = new UpdateArticleStatusDto();
    dto.status = 'REMOVED' as UpdateArticleStatusDto['status'];

    await expect(validate(dto)).resolves.not.toHaveLength(0);
  });

  it('enforces the same status contract on create and proposal/update DTOs', async () => {
    const createDto = plainToInstance(CreateArticleDto, {
      title: 'Title',
      summary: 'Summary',
      content: 'Content',
      category: 'Technology',
      status: 'PENDING',
    });
    const updateDto = plainToInstance(UpdateArticleDto, {
      status: 'REJECTED',
    });

    await expect(validate(createDto)).resolves.not.toHaveLength(0);
    await expect(validate(updateDto)).resolves.not.toHaveLength(0);
  });
});
