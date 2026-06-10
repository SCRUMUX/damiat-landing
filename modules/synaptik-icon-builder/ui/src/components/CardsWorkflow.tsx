import { forwardRef, useMemo, useState } from 'react';
import { apiFetch } from '../api/client.js';
import { PromptDebugPanel, type PromptPreviewData } from './PromptDebugPanel.js';
import { PreviewVersionSlider } from './PreviewVersionSlider.js';
import { Accordion } from '@ai-ds/core/components/Accordion';
import { Badge } from '@ai-ds/core/components/Badge';
import { Button } from '@ai-ds/core/components/Button';
import { Card } from '@ai-ds/core/components/Card';
import { RadioButton, RadioGroup } from '@ai-ds/core/components/RadioButton';
import { Alert } from '@ai-ds/core/components/Alert';
import { t } from '../i18n/ru.js';
import { BlockSectionHeader } from './BlockSectionHeader.js';
import { blockStats, groupCardsByBlock } from '../utils/groupCards.js';
import { conceptMetaphorLabel } from '../utils/conceptLabel.js';
import { findDuplicatePreviewCardIds } from '../utils/duplicatePreviews.js';
import {
  contentStackTightClass,
  fullWidthSectionClass,
  rowActionsClass,
  sectionStackClass,
  sectionStackLooseClass,
  synaptikCardClass,
} from '../layout.js';
import type {
  Card as ContentCard,
  CardUiState,
  ConceptSet,
  ContentBlock,
} from '../types.js';

function phaseBadge(st: CardUiState | undefined) {
  if (st?.needsRepublish) {
    return { appearance: 'warning' as const, label: t.badgeNewVersion };
  }
  if (st?.phase === 'published') return { appearance: 'success' as const, label: t.badgePublished };
  if (st?.phase === 'rendered' && st.failedQa) {
    return { appearance: 'warning' as const, label: t.badgeQaFailed };
  }
  if (st?.phase === 'rendered') return { appearance: 'info' as const, label: t.badgeRendered };
  return { appearance: 'warning' as const, label: t.badgePickMetaphor };
}

interface CardsWorkflowProps {
  sessionId: string;
  cards: ContentCard[];
  blocks?: ContentBlock[];
  searchQuery?: string;
  dna: Record<string, unknown> | null;
  iconStyleBlock?: string;
  conceptSets: Record<string, ConceptSet>;
  selections: Record<string, string>;
  cardUi: Record<string, CardUiState>;
  busy: boolean;
  onSelectConcept: (cardId: string, conceptId: string) => void;
  onPreview: (cardId: string, force?: boolean) => void;
  onPublish: (cardId: string) => void;
  onPreviewError: () => void;
  onPromptCheckError?: (message: string) => void;
  onToggleSkipped?: (cardId: string, skipped: boolean) => void;
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

export const CardsWorkflow = forwardRef<HTMLElement, CardsWorkflowProps>(function CardsWorkflow(
  {
    sessionId,
    cards,
    blocks,
    searchQuery = '',
    dna,
    iconStyleBlock,
    conceptSets,
    selections,
    cardUi,
    busy,
    onSelectConcept,
    onPreview,
    onPublish,
    onPreviewError,
    onPromptCheckError,
    onToggleSkipped,
    onPreviewVersionActive,
  },
  ref,
) {
  const [promptDebug, setPromptDebug] = useState<Record<string, PromptPreviewData>>({});

  const duplicatePreviewIds = useMemo(
    () => findDuplicatePreviewCardIds(cardUi, cards.map((c) => c.id)),
    [cardUi, cards],
  );
  const groups = groupCardsByBlock(cards, blocks, searchQuery);

  return (
    <section ref={ref} id="step-cards" className="w-full">
      <Card variant="filled" size="md" title={t.stepCardsTitle(cards.length)} className={synaptikCardClass}>
        <div className={sectionStackClass}>
          <p className="text-style-body-sm text-[var(--color-text-secondary)] m-0">{t.stepCardsHint}</p>

          {iconStyleBlock && (
            <Accordion
              size="sm"
              fullWidth
              defaultOpen={false}
              content={
                <pre className="m-0 overflow-auto rounded-[var(--radius-default)] bg-[var(--color-surface-2)] p-[var(--space-inset-m)] text-style-body-xs text-[var(--color-text-secondary)] whitespace-pre-wrap">
                  {iconStyleBlock}
                </pre>
              }
            >
              {t.styleBlockSummary}
            </Accordion>
          )}
          {dna && (
            <Accordion
              size="sm"
              fullWidth
              defaultOpen={false}
              content={
                <div className={sectionStackClass}>
                  <p className="text-style-caption text-[var(--color-text-secondary)] m-0">
                    {t.dnaSiteOnlyHint}
                  </p>
                  <pre className="m-0 overflow-auto rounded-[var(--radius-default)] bg-[var(--color-surface-2)] p-[var(--space-inset-m)] text-style-body-xs text-[var(--color-text-secondary)]">
                    {JSON.stringify(dna, null, 2)}
                  </pre>
                </div>
              }
            >
              {t.dnaSummary}
            </Accordion>
          )}

          {duplicatePreviewIds.length > 0 && (
            <Alert
              appearance="warning"
              showTitle={false}
              paragraph={t.duplicatePreviewWarning}
              showLeftIcon
              className={`${fullWidthSectionClass} !justify-start !items-start`}
            />
          )}

          {cards.length === 0 && (
            <Alert appearance="warning" showTitle={false} paragraph={t.noCards} showLeftIcon />
          )}

          {groups.map((group, blockIdx) => {
            const stats = blockStats(group.cards, cardUi);
            const defaultOpen = blockIdx === 0 || stats.outdated > 0;
            return (
            <Accordion
              key={group.blockKey}
              size="md"
              fullWidth
              defaultOpen={defaultOpen}
              content={
            <section
              id={`block-${group.blockKey}`}
              className={sectionStackLooseClass}
            >
              {group.cards.map((card, index) => {
                const set = conceptSets[card.id];
                const st = cardUi[card.id];
                const selected = selections[card.id];
                const badge = phaseBadge(st);
                const isSkipped = Boolean(card.skipped);
                const canPublish =
                  !isSkipped && st?.phase === 'rendered' && !st?.failedQa;
                const publishLabel = st?.needsRepublish
                  ? t.republishStorybook
                  : t.publishStorybook;
                return (
                  <Card
                    key={card.id}
                    variant="outlined"
                    size="md"
                    className={synaptikCardClass}
                    header={
                      <div className={rowActionsClass}>
                        <Badge appearance="base" size="sm">
                          {index + 1}
                        </Badge>
                        <span className="text-style-body-strong text-[var(--color-text-primary)] flex-1 min-w-0">
                          {card.title}
                        </span>
                        <Badge appearance={badge.appearance} size="sm">
                          {badge.label}
                        </Badge>
                      </div>
                    }
                    footer={
                      <div className={sectionStackClass}>
                      <label className="flex items-center gap-[var(--space-content-s)] text-style-body-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSkipped}
                          disabled={busy}
                          onChange={(e) =>
                            onToggleSkipped?.(card.id, e.target.checked)
                          }
                        />
                        {t.cardSkipLabel}
                      </label>
                      <div className={rowActionsClass}>
                        <Button
                          appearance="outline"
                          size="sm"
                          disabled={busy || !selected || isSkipped}
                          onClick={async () => {
                            if (!selected) return;
                            try {
                              const data = await apiFetch<PromptPreviewData>(
                                `/session/${sessionId}/prompt-preview/${card.id}?concept=${selected}`,
                              );
                              setPromptDebug((p) => ({ ...p, [card.id]: data }));
                            } catch (e) {
                              onPromptCheckError?.(
                                e instanceof Error ? e.message : t.errorPromptCheck,
                              );
                            }
                          }}
                        >
                          {t.checkPrompt}
                        </Button>
                        <Button
                          appearance="brand"
                          size="sm"
                          disabled={busy || !selected || isSkipped}
                          onClick={() => onPreview(card.id)}
                        >
                          {t.previewRender}
                        </Button>
                        <Button
                          appearance="brand"
                          size="sm"
                          disabled={busy || !canPublish}
                          onClick={() => onPublish(card.id)}
                        >
                          {publishLabel}
                        </Button>
                      </div>
                      </div>
                    }
                  >
                    {isSkipped && (
                      <p className="text-style-body-sm text-[var(--color-text-secondary)] m-0">
                        {t.cardSkippedHint}
                      </p>
                    )}
                    {!set?.concepts.length && (
                      <p className="text-style-body-sm text-[var(--color-text-secondary)] m-0">
                        {t.conceptsMissing}
                      </p>
                    )}
                    {set && set.concepts.length > 0 && (
                      <>
                      <RadioGroup
                        value={selected ?? ''}
                        onValueChange={(v) => onSelectConcept(card.id, v)}
                        name={`concept-${card.id}`}
                        className={sectionStackClass}
                      >
                        {set.concepts.map((c) => (
                          <RadioButton
                            key={c.id}
                            size="md"
                            value={c.id}
                            label={
                              <span className={contentStackTightClass}>
                                <span className="text-style-body-strong text-[var(--color-text-primary)]">
                                  {c.id}. {c.label}
                                </span>
                                {conceptMetaphorLabel(c) && (
                                  <span className="text-style-body-sm text-[var(--color-text-secondary)]">
                                    {conceptMetaphorLabel(c)}
                                  </span>
                                )}
                              </span>
                            }
                          />
                        ))}
                      </RadioGroup>
                      {st?.previewStale && (
                        <p className="text-style-body-sm text-[var(--color-text-warning)] m-0">
                          {st.previewStaleReason === 'style'
                            ? t.previewStaleStyleHint
                            : t.previewStaleHint}
                        </p>
                      )}
                      </>
                    )}
                    {promptDebug[card.id] && (
                      <PromptDebugPanel data={promptDebug[card.id]!} />
                    )}
                    {(st?.previewSrc || st?.publishedSrc) && (
                      <>
                        {st.previewSrc && (
                          <PreviewVersionSlider
                            sessionId={sessionId}
                            cardId={card.id}
                            activePreviewUrl={st.previewSrc}
                            alt={t.previewAlt(card.title)}
                            busy={busy}
                            onPreviewError={onPreviewError}
                            onActiveVersionChange={(payload) =>
                              onPreviewVersionActive?.(card.id, payload)
                            }
                          />
                        )}
                        {st.needsRepublish && (
                          <p className="text-style-body-sm text-[var(--color-text-secondary)] m-0 mt-[var(--space-content-s)]">
                            {t.successPreviewRepublish}
                          </p>
                        )}
                        {st.failedQa && (
                          <p className="text-style-body-sm text-[var(--color-text-warning)] m-0 mt-[var(--space-content-s)]">
                            {t.qaFailedHint}
                          </p>
                        )}
                      </>
                    )}
                  </Card>
                );
              })}
            </section>
              }
            >
              <BlockSectionHeader group={group} stats={stats} />
            </Accordion>
            );
          })}
        </div>
      </Card>
    </section>
  );
});
