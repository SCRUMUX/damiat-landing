import type { Card, CardUiState, IconStatusEntry, SessionState } from '../types.js';

function selectionConceptId(state: SessionState, cardId: string): string | undefined {
  return state.selections.find((s) => s.cardId === cardId)?.conceptId;
}

export function buildCardUiForCard(
  card: Card,
  state: SessionState,
  publishedSet: Set<string>,
): CardUiState {
  const status = state.iconStatus?.[card.id];
  const preview = state.previews[card.id];
  const rm = state.renderMeta?.[card.id];
  const cacheBust = `?t=${Date.now()}`;
  const selectedConceptId = selectionConceptId(state, card.id);
  const renderedConceptId = status?.conceptId;
  const conceptStale = Boolean(
    preview &&
      selectedConceptId &&
      renderedConceptId &&
      selectedConceptId !== renderedConceptId,
  );
  const styleStale = Boolean(
    preview &&
      state.iconSetStyleId &&
      status?.iconSetStyleId &&
      status.iconSetStyleId !== state.iconSetStyleId,
  );
  const previewStale = conceptStale || styleStale;

  if (previewStale) {
    const publishedSrc = status?.publishedUrl
      ? `${status.publishedUrl}${cacheBust}`
      : undefined;
    return {
      phase: 'pick',
      previewStale: true,
      previewStaleReason: styleStale ? 'style' : 'concept',
      renderedConceptId,
      publishedSrc,
      failedQa: status?.failedQa ?? rm?.failedQa,
      qualityWarnings: status?.qualityWarnings ?? rm?.qualityWarnings,
      needsRepublish: status?.catalogStatus === 'outdated' || status?.catalogStatus === 'current',
      catalogStatus: status?.catalogStatus ?? 'none',
    };
  }

  if (status?.catalogStatus === 'outdated' && preview) {
    return {
      phase: 'rendered',
      previewSrc: `${preview.previewUrl}${cacheBust}`,
      renderedConceptId: renderedConceptId ?? selectedConceptId,
      publishedSrc: status.publishedUrl ? `${status.publishedUrl}${cacheBust}` : undefined,
      failedQa: status.failedQa ?? rm?.failedQa,
      qualityWarnings: status.qualityWarnings ?? rm?.qualityWarnings,
      needsRepublish: true,
      catalogStatus: 'outdated',
    };
  }

  if (status?.catalogStatus === 'current' && preview) {
    return {
      phase: 'published',
      previewSrc: `${preview.previewUrl}${cacheBust}`,
      renderedConceptId: renderedConceptId ?? selectedConceptId,
      publishedSrc: status.publishedUrl ? `${status.publishedUrl}${cacheBust}` : undefined,
      catalogStatus: 'current',
    };
  }

  if (publishedSet.has(card.id) && preview) {
    return {
      phase: 'published',
      previewSrc: `${preview.previewUrl}${cacheBust}`,
      renderedConceptId: renderedConceptId ?? selectedConceptId,
      publishedSrc: status?.publishedUrl ? `${status.publishedUrl}${cacheBust}` : undefined,
      catalogStatus: status?.catalogStatus ?? 'current',
    };
  }

  if (publishedSet.has(card.id)) {
    return {
      phase: 'published',
      publishedSrc: status?.publishedUrl ? `${status.publishedUrl}${cacheBust}` : undefined,
      catalogStatus: status?.catalogStatus ?? 'current',
    };
  }

  if (preview) {
    return {
      phase: 'rendered',
      previewSrc: `${preview.previewUrl}${cacheBust}`,
      renderedConceptId: renderedConceptId ?? selectedConceptId,
      failedQa: status?.failedQa ?? rm?.failedQa,
      qualityWarnings: status?.qualityWarnings ?? rm?.qualityWarnings,
      catalogStatus: status?.catalogStatus ?? 'none',
    };
  }

  return { phase: 'pick' };
}

export function iconStatusFromState(state: SessionState): Record<string, IconStatusEntry> {
  return state.iconStatus ?? {};
}
