import { z } from 'zod';
import { api } from '../../../lib/axios';

const adminStatsSchema = z.object({
  totalUsers: z.number().int().nonnegative(),
  totalBusinesses: z.number().int().nonnegative(),
  pendingBusinesses: z.number().int().nonnegative(),
  totalArticles: z.number().int().nonnegative(),
});

const adminStatsResponseSchema = z.object({
  success: z.literal(true),
  data: adminStatsSchema,
});

export type AdminStats = z.infer<typeof adminStatsSchema>;

export const adminQueryKeys = {
  all: ['admin'] as const,
  stats: ['admin', 'stats'] as const,
  businesses: ['admin', 'businesses'] as const,
  businessLists: ['admin', 'businesses', 'list'] as const,
  businessList: (filters: Record<string, unknown>) =>
    ['admin', 'businesses', 'list', filters] as const,
  business: (id?: string) => ['admin', 'businesses', 'detail', id] as const,
  businessArticles: (id?: string) =>
    ['admin', 'businesses', 'detail', id, 'articles'] as const,
  users: ['admin', 'users'] as const,
  userLists: ['admin', 'users', 'list'] as const,
  userList: (filters: Record<string, unknown>) =>
    ['admin', 'users', 'list', filters] as const,
  user: (id?: string) => ['admin', 'users', 'detail', id] as const,
  articles: ['admin', 'articles'] as const,
  articleLists: ['admin', 'articles', 'list'] as const,
  articleList: (filters: Record<string, unknown>) =>
    ['admin', 'articles', 'list', filters] as const,
  article: (id?: string) => ['admin', 'articles', 'detail', id] as const,
  articleTags: ['admin', 'articles', 'tags'] as const,
};

export const adminApi = {
  async getStats(): Promise<AdminStats> {
    const response = await api.get('/admin/stats');
    return adminStatsResponseSchema.parse(response.data).data;
  },
};
