export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:8080';

/** Shown on the brand portal for support (mailto link). */
export const ADMIN_CONTACT_EMAIL =
  import.meta.env.VITE_ADMIN_CONTACT_EMAIL?.trim() || '';

/** APK or app package download URL (defaults to bundled file under public/downloads/). */
export const APP_DOWNLOAD_URL =
  import.meta.env.VITE_APP_DOWNLOAD_URL?.trim() ||
  `${import.meta.env.BASE_URL}downloads/healthy-way.apk`;

export function publicStaticUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  // Same-origin /api paths: Vite dev proxy + production nginx forward to the API.
  if (normalized.startsWith('/api/')) {
    return normalized;
  }
  const base = API_BASE_URL.replace(/\/$/, '');
  return `${base}${normalized}`;
}
