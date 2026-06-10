import type { CardUiState } from '../types.js';

/** cardIds that share the same preview URL (possible render dir collision). */
export function findDuplicatePreviewCardIds(
  cardUi: Record<string, CardUiState>,
  cardIds: string[],
): string[] {
  const bySrc = new Map<string, string[]>();
  for (const id of cardIds) {
    const src = cardUi[id]?.previewSrc?.split('?')[0];
    if (!src) continue;
    const list = bySrc.get(src) ?? [];
    list.push(id);
    bySrc.set(src, list);
  }
  const dupes = new Set<string>();
  for (const ids of bySrc.values()) {
    if (ids.length > 1) ids.forEach((id) => dupes.add(id));
  }
  return [...dupes];
}
