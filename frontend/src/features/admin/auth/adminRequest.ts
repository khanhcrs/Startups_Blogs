const ADMIN_PATH_SEGMENT = /(^|\/)admin(?:\/|$)/;

export function isAdminApiRequest(url?: string): boolean {
  if (!url) return false;

  try {
    const pathname = new URL(url, 'http://localhost').pathname;
    return ADMIN_PATH_SEGMENT.test(pathname);
  } catch {
    return ADMIN_PATH_SEGMENT.test(url.split('?')[0]);
  }
}
