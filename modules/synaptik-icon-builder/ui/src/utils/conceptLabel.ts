import type { Concept } from '../types.js';

const PHOTOREAL_RE = /photoreal|photograph|dslr|hyperreal|cinematic photo/i;

export function isLegacyRenderStyle(text: string | undefined): boolean {
  if (!text?.trim()) return false;
  return PHOTOREAL_RE.test(text) || text.length > 120;
}

/** UI subtitle for A/B/C — prefer concrete visualObject. */
export function conceptMetaphorLabel(c: Concept): string {
  const vo = (c as Concept & { visualObject?: string }).visualObject?.trim();
  if (vo) return vo;
  if (c.iconSubject?.trim()) {
    const s = c.iconSubject.trim();
    const idx = s.indexOf(':');
    if (idx >= 0 && idx < s.length - 2) return s.slice(idx + 1).trim();
    return s;
  }
  if (c.description?.trim() && !isLegacyRenderStyle(c.description)) {
    return c.description.trim();
  }
  return '';
}
