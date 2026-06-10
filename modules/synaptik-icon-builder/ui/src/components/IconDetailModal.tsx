import { useEffect, useState } from 'react';
import { Accordion } from '@ai-ds/core/components/Accordion';
import { Button } from '@ai-ds/core/components/Button';
import { Card } from '@ai-ds/core/components/Card';
import { RadioButton, RadioGroup } from '@ai-ds/core/components/RadioButton';
import { apiFetch } from '../api/client.js';
import { t } from '../i18n/ru.js';
import { conceptMetaphorLabel } from '../utils/conceptLabel.js';
import { useStorybookUrl } from '../hooks/useStorybookUrl.js';
import {
  contentStackTightClass,
  rowActionsClass,
  sectionStackClass,
  synaptikCardClass,
} from '../layout.js';
import { PreviewVersionSlider } from './PreviewVersionSlider.js';
import type { Card as ContentCard, CardUiState, ConceptSet } from '../types.js';

interface IconDetailModalProps {
  card: ContentCard;
  sessionId?: string;
  conceptSet: ConceptSet | undefined;
  selectedConcept: string | undefined;
  ui: CardUiState | undefined;
  projectSlug: string;
  busy: boolean;
  onClose: () => void;
  onSelectConcept: (conceptId: string) => void;
  onPreview: () => void;
  onPublish: () => void;
  onPreviewError: () => void;
  onPreviewVersionActive?: (
    payload: {
      previewSrc: string;
      conceptId?: string;
      failedQa?: boolean;
      qualityWarnings?: string[];
    },
  ) => void;
}

export function IconDetailModal({
  card,
  sessionId,
  conceptSet,
  selectedConcept,
  ui,
  projectSlug,
  busy,
  onClose,
  onSelectConcept,
  onPreview,
  onPublish,
  onPreviewError,
  onPreviewVersionActive,
}: IconDetailModalProps) {
  const [fluxPrompt, setFluxPrompt] = useState<string | null>(null);
  const { url: storybookUrl, loading: storybookLoading } = useStorybookUrl(projectSlug);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    setFluxPrompt(null);
    void apiFetch<{ text: string }>(`/session/${sessionId}/prompt/${card.id}`)
      .then((data) => {
        if (!cancelled) setFluxPrompt(data.text);
      })
      .catch(() => {
        if (!cancelled) setFluxPrompt(null);
      });
    return () => {
      cancelled = true;
    };
  }, [sessionId, card.id]);
  const canPublish = ui?.phase === 'rendered' && !ui?.failedQa;
  const publishLabel = ui?.needsRepublish ? t.republishStorybook : t.publishStorybook;
  const showCompare = Boolean(ui?.needsRepublish && ui.publishedSrc && ui.previewSrc);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-[var(--space-inset-l)] bg-[color:var(--effect-scrim-strong)]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="icon-detail-title"
    >
      <Card
        variant="filled"
        size="md"
        title={t.detailTitle(card.title)}
        className={`${synaptikCardClass} max-h-[90vh] overflow-auto w-full max-w-[calc(var(--space-container-content-max)*1.25)]`}
      >
        <span id="icon-detail-title" className="sr-only">
          {t.detailTitle(card.title)}
        </span>
        <div className={sectionStackClass}>
          {conceptSet && conceptSet.concepts.length > 0 && (
            <>
              <RadioGroup
                value={selectedConcept ?? ''}
                onValueChange={onSelectConcept}
                name={`gallery-concept-${card.id}`}
                className={sectionStackClass}
              >
                {conceptSet.concepts.map((c) => (
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
              <p className="text-style-caption text-[var(--color-text-secondary)] m-0">
                {t.detailConceptHint}
              </p>
            </>
          )}

          <div
            className={`grid gap-[var(--space-content-m)] ${
              showCompare ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
            }`}
          >
            {ui?.previewSrc && sessionId && (
              <div className={contentStackTightClass}>
                <p className="text-style-body-sm text-[var(--color-text-secondary)] m-0">
                  {t.detailCatalogDraft}
                </p>
                <PreviewVersionSlider
                  sessionId={sessionId}
                  cardId={card.id}
                  activePreviewUrl={ui.previewSrc}
                  alt={t.previewAlt(card.title)}
                  busy={busy}
                  onPreviewError={onPreviewError}
                  onActiveVersionChange={onPreviewVersionActive}
                />
              </div>
            )}
            {showCompare && ui?.publishedSrc && (
              <div className={contentStackTightClass}>
                <p className="text-style-body-sm text-[var(--color-text-secondary)] m-0">
                  {t.detailCatalogLive}
                </p>
                <img
                  src={ui.publishedSrc}
                  alt={t.detailCatalogLive}
                  className="w-full max-h-[var(--space-320)] object-contain rounded-[var(--radius-default)] border border-[var(--color-border-base)] bg-[var(--color-surface-1)]"
                />
              </div>
            )}
          </div>

          {ui?.failedQa && (
            <p className="text-style-body-sm text-[var(--color-text-warning)] m-0">
              {t.qaFailedHint}
            </p>
          )}

          {sessionId && (
            <Accordion
              size="sm"
              fullWidth
              defaultOpen={false}
              content={
                fluxPrompt ? (
                  <pre className="m-0 overflow-auto rounded-[var(--radius-default)] bg-[var(--color-surface-2)] p-[var(--space-inset-m)] text-style-body-xs text-[var(--color-text-secondary)] whitespace-pre-wrap">
                    {fluxPrompt}
                  </pre>
                ) : (
                  <p className="text-style-caption text-[var(--color-text-secondary)] m-0">
                    {t.fluxPromptMissing}
                  </p>
                )
              }
            >
              {t.fluxPromptSummary}
            </Accordion>
          )}

          <div className={rowActionsClass}>
            <Button appearance="ghost" size="md" onClick={onClose}>
              {t.detailClose}
            </Button>
            <Button
              appearance="outline"
              size="md"
              disabled={busy || !selectedConcept}
              onClick={onPreview}
            >
              {t.previewRender}
            </Button>
            <Button
              appearance="brand"
              size="md"
              disabled={busy || !canPublish}
              onClick={onPublish}
            >
              {publishLabel}
            </Button>
            <Button
              appearance="outline"
              size="md"
              disabled={storybookLoading || !storybookUrl}
              onClick={() => {
                if (storybookUrl) window.open(storybookUrl, '_blank', 'noopener,noreferrer');
              }}
            >
              {storybookLoading ? t.storybookLinkLoading : t.detailOpenStorybook}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
