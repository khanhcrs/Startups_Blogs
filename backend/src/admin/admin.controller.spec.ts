import type { AuthenticatedRequest } from '../auth/auth.types';
import type { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

describe('AdminController proposals', () => {
  const createProposal = jest.fn();
  const controller = new AdminController({
    createProposal,
  } as unknown as AdminService);
  const request = {
    user: { userId: 'database-admin-id' },
  } as unknown as AuthenticatedRequest;

  beforeEach(() => {
    jest.clearAllMocks();
    createProposal.mockResolvedValue({ id: 'proposal-id' });
  });

  it('uses the authenticated database user id for a business proposal', async () => {
    await controller.proposeBusinessChange(
      'business-id',
      { name: 'Updated name' },
      request,
    );

    expect(createProposal).toHaveBeenCalledWith(
      'BUSINESS',
      'business-id',
      { name: 'Updated name' },
      'database-admin-id',
    );
  });

  it('uses the authenticated database user id for an article proposal', async () => {
    await controller.proposeArticleChange(
      'article-id',
      { title: 'Updated title' },
      request,
    );

    expect(createProposal).toHaveBeenCalledWith(
      'ARTICLE',
      'article-id',
      { title: 'Updated title' },
      'database-admin-id',
    );
  });
});
