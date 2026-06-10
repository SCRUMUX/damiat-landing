export type CatalogStatus = 'none' | 'current' | 'outdated';

export interface CatalogMetaSlice {
  conceptId?: string;
  promptHash?: string;
  publishedAt?: string;
}

export function resolveCatalogStatus(
  hasCatalogEntry: boolean,
  render: CatalogMetaSlice | null,
  published: CatalogMetaSlice | null,
): CatalogStatus {
  if (!hasCatalogEntry) return 'none';
  if (!render || !published) return 'current';

  const conceptMismatch =
    Boolean(render.conceptId) &&
    Boolean(published.conceptId) &&
    render.conceptId !== published.conceptId;

  const promptMismatch =
    Boolean(render.promptHash) &&
    Boolean(published.promptHash) &&
    render.promptHash !== published.promptHash;

  const renderLostPublishStamp = !render.publishedAt && Boolean(published.publishedAt);

  if (conceptMismatch || promptMismatch || renderLostPublishStamp) {
    return 'outdated';
  }
  return 'current';
}
