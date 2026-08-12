import { describe, expect, it } from 'vitest';
import { isAdminApiRequest } from './adminRequest';

describe('isAdminApiRequest', () => {
  it.each([
    '/admin/stats',
    '/users/admin/all?page=1',
    '/businesses/admin/123/status',
    'https://api.example.com/articles/admin/123',
    '/comments/admin/123',
  ])('recognizes protected admin API paths: %s', (url) => {
    expect(isAdminApiRequest(url)).toBe(true);
  });

  it.each(['/articles', '/users/me', '/administrator/stats']) (
    'does not classify normal API paths as admin paths: %s',
    (url) => {
      expect(isAdminApiRequest(url)).toBe(false);
    },
  );
});
