import type { Card, CardUiState } from '../types.js';

export function deriveFlowStep(
  sessionId: string,
  cards: Card[],
  cardUi: Record<string, CardUiState>,
): number {
  if (!sessionId) return 1;
  if (cards.length === 0) return 2;

  const phases = cards.map((c) => cardUi[c.id]?.phase);
  const anyPublished = phases.some((p) => p === 'published');
  if (anyPublished) return 4;

  const anyRendered = phases.some((p) => p === 'rendered');
  if (anyRendered) return 3;

  return 2;
}
