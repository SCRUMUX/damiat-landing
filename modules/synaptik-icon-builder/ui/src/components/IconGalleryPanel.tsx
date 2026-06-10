import { useMemo, useState } from 'react';
import { Badge } from '@ai-ds/core/components/Badge';
import { Button } from '@ai-ds/core/components/Button';
import { Card } from '@ai-ds/core/components/Card';
import { t } from '../i18n/ru.js';
import { groupCardsByBlock } from '../utils/groupCards.js';
import type { ContentBlock } from '../types.js';
import {
  contentStackTightClass,
  rowActionsClass,
  sectionStackClass,
  synaptikCardClass,
} from '../layout.js';
import type { Card as ContentCard, CardUiState, ConceptSet, IconStatusEntry } from '../types.js';
import { IconDetailModal } from './IconDetailModal.js';

type GalleryFilter = 'all' | 'preview' | 'outdated' | 'qa';

interface IconGalleryPanelProps {
  cards: ContentCard[];
  blocks?: ContentBlock[];
  searchQuery?: string;
  cardUi: Record<string, CardUiState>;
  iconStatus: Record<string, IconStatusEntry>;
  conceptSets: Record<string, ConceptSet>;
  selections: Record<string, string>;
  projectSlug: string;
  sessionId: string;
  busy: boolean;
  onSelectConcept: (cardId: string, conceptId: string) => void;
  onPreview: (cardId: string) => void;
  onPublish: (cardId: string) => void;
  onPreviewError: () => void;
  onPreviewVersionActive?: (
    cardId: string,
    payload: {
      previewSrc: string;
      conceptId?: string;
      failedQa?: boolean;
      qualityWarnings?: string[];
    },
  ) => void;
}

function tileBadge(st: CardUiState | undefined): { appearance: 'success' | 'info' | 'warning' | 'base'; label: string } {
  if (st?.needsRepublish) return { appearance: 'warning', label: t.badgeNewVersion };
  if (st?.phase === 'published') return { appearance: 'success', label: t.badgePublished };
  if (st?.failedQa) return { appearance: 'warning', label: t.badgeQaFailed };
  if (st?.previewSrc) return { appearance: 'info', label: t.badgeRendered };
  return { appearance: 'base', label: t.badgePickMetaphor };
}

function matchesFilter(
  filter: GalleryFilter,
  cardId: string,
  st: CardUiState | undefined,
  status: IconStatusEntry | undefined,
): boolean {
  if (filter === 'all') return true;
  if (filter === 'preview') return Boolean(st?.previewSrc);
  if (filter === 'outdated') {
    return Boolean(st?.needsRepublish || status?.catalogStatus === 'outdated');
  }
  if (filter === 'qa') return Boolean(st?.failedQa || status?.failedQa);
  return true;
}

export function IconGalleryPanel({
  cards,
  blocks,
  searchQuery = '',
  cardUi,
  iconStatus,
  conceptSets,
  selections,
  projectSlug,
  sessionId,
  busy,
  onSelectConcept,
  onPreview,
  onPublish,
  onPreviewError,
  onPreviewVersionActive,
}: IconGalleryPanelProps) {
  const [filter, setFilter] = useState<GalleryFilter>('all');
  const [detailCardId, setDetailCardId] = useState<string | null>(null);

  const filters: { id: GalleryFilter; label: string }[] = [
    { id: 'all', label: t.galleryFilterAll },
    { id: 'preview', label: t.galleryFilterPreview },
    { id: 'outdated', label: t.galleryFilterOutdated },
    { id: 'qa', label: t.galleryFilterQa },
  ];

  const grouped = useMemo(() => {
    const all = groupCardsByBlock(cards, blocks, searchQuery);
    return all
      .map((g) => ({
        ...g,
        cards: g.cards.filter((c) =>
          matchesFilter(filter, c.id, cardUi[c.id], iconStatus[c.id]),
        ),
      }))
      .filter((g) => g.cards.length > 0);
  }, [blocks, cards, cardUi, filter, iconStatus, searchQuery]);

  const detailCard = detailCardId ? cards.find((c) => c.id === detailCardId) : undefined;

  return (
    <section id="step-gallery" className="w-full">
      <Card variant="filled" size="md" title={t.galleryTitle} className={synaptikCardClass}>
        <div className={sectionStackClass}>
          <p className="text-style-body-sm text-[var(--color-text-secondary)] m-0">
            {t.galleryHint}
          </p>
          <div className={rowActionsClass} role="tablist" aria-label={t.galleryTitle}>
            {filters.map((f) => (
              <Button
                key={f.id}
                appearance={filter === f.id ? 'brand' : 'outline'}
                size="sm"
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </Button>
            ))}
          </div>

          {grouped.length === 0 && (
            <p className="text-style-body-sm text-[var(--color-text-secondary)] m-0">
              {t.galleryNoMatch}
            </p>
          )}

          {grouped.map((group) => (
            <div key={group.blockKey} className={sectionStackClass}>
              <h3 className="text-style-h4 text-[var(--color-text-primary)] m-0">
                {group.blockTitle}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-[var(--space-content-m)]">
                {group.cards.map((card) => {
                  const st = cardUi[card.id];
                  const badge = tileBadge(st);
                  const thumb = st?.previewSrc ?? st?.publishedSrc;
                  return (
                    <button
                      key={card.id}
                      type="button"
                      className="flex flex-col gap-[var(--space-content-s)] p-[var(--space-inset-s)] rounded-[var(--radius-default)] border border-[var(--color-border-base)] bg-[var(--color-surface-1)] text-left hover:bg-[var(--color-surface-2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]"
                      onClick={() => setDetailCardId(card.id)}
                    >
                      <div className="aspect-square w-full flex items-center justify-center rounded-[var(--radius-default)] bg-[var(--color-surface-2)] overflow-hidden">
                        {thumb ? (
                          <img
                            src={thumb}
                            alt=""
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <span className="text-style-caption text-[var(--color-text-secondary)] px-[var(--space-inset-s)] text-center">
                            {t.galleryPlaceholder}
                          </span>
                        )}
                      </div>
                      <span className="text-style-body-sm text-[var(--color-text-primary)] line-clamp-2">
                        {card.title}
                      </span>
                      <Badge appearance={badge.appearance} size="sm">
                        {badge.label}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {detailCard && (
        <IconDetailModal
          card={detailCard}
          sessionId={sessionId}
          conceptSet={conceptSets[detailCard.id]}
          selectedConcept={selections[detailCard.id]}
          ui={cardUi[detailCard.id]}
          projectSlug={projectSlug}
          busy={busy}
          onClose={() => setDetailCardId(null)}
          onSelectConcept={(conceptId) => onSelectConcept(detailCard.id, conceptId)}
          onPreview={() => {
            void onPreview(detailCard.id);
          }}
          onPublish={() => onPublish(detailCard.id)}
          onPreviewError={onPreviewError}
          onPreviewVersionActive={(payload) =>
            onPreviewVersionActive?.(detailCard.id, payload)
          }
        />
      )}
    </section>
  );
}
