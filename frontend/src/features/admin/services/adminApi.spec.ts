import { beforeEach, describe, expect, it, vi } from 'vitest';
import { api } from '../../../lib/axios';
import { adminApi } from './adminApi';

describe('adminApi.getStats', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('loads the protected dashboard statistics from the backend service', async () => {
    const stats = {
      totalUsers: 12,
      totalBusinesses: 4,
      pendingBusinesses: 2,
      totalArticles: 8,
    };
    const get = vi.spyOn(api, 'get').mockResolvedValue({
      data: { success: true, data: stats },
    });

    await expect(adminApi.getStats()).resolves.toEqual(stats);
    expect(get).toHaveBeenCalledWith('/admin/stats');
  });

  it('rejects a malformed backend response instead of rendering bad data', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({
      data: {
        success: true,
        data: { totalUsers: 'not-a-number' },
      },
    });

    await expect(adminApi.getStats()).rejects.toThrow();
  });
});
