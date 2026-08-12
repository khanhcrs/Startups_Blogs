/* eslint-disable @typescript-eslint/unbound-method -- decorators are inspected without invoking handlers */
import { GUARDS_METADATA } from '@nestjs/common/constants';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';

describe('ArticlesController admin detail', () => {
  const findOneForAdmin = jest.fn();
  const controller = new ArticlesController({
    findOneForAdmin,
  } as unknown as ArticlesService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('requires a verified ADMIN role', () => {
    const handler = ArticlesController.prototype.getArticleForAdmin;

    expect(Reflect.getMetadata(ROLES_KEY, handler)).toEqual([Role.ADMIN]);
    expect(Reflect.getMetadata(GUARDS_METADATA, handler)).toEqual([
      JwtAuthGuard,
      RolesGuard,
    ]);
  });

  it('returns the protected admin article detail', async () => {
    findOneForAdmin.mockResolvedValue({ id: 'article-1', status: 'DRAFT' });

    await expect(controller.getArticleForAdmin('article-1')).resolves.toEqual({
      success: true,
      data: { id: 'article-1', status: 'DRAFT' },
    });
    expect(findOneForAdmin).toHaveBeenCalledWith('article-1');
  });
});
