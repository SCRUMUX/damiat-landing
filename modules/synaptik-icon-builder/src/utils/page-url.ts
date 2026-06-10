import { slugify } from '../paths.js';

export function sameOrigin(urlA: string, urlB: string): boolean {
  try {
    const a = new URL(urlA.trim());
    const b = new URL(urlB.trim());
    return a.protocol === b.protocol && a.hostname === b.hostname;
  } catch {
    return false;
  }
}

/** Stable folder slug for a page URL (home for `/`). */
export function pageSlugFromUrl(url: string): string {
  try {
    const u = new URL(url.trim());
    const p = u.pathname.replace(/\/+$/, '') || '/';
    if (p === '/') return 'home';
    return slugify(p.replace(/^\//, '')) || 'page';
  } catch {
    return slugify(url) || 'page';
  }
}

/** Short label for UI, e.g. `/pricing`. */
export function shortPagePath(url: string): string {
  try {
    const u = new URL(url.trim());
    const p = u.pathname.replace(/\/+$/, '') || '/';
    return p;
  } catch {
    return url;
  }
}
