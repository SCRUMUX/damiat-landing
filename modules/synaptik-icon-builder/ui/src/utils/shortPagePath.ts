export function shortPagePath(url: string | undefined): string {
  if (!url) return '';
  try {
    const u = new URL(url);
    const p = u.pathname.replace(/\/+$/, '') || '/';
    return p;
  } catch {
    return url;
  }
}
