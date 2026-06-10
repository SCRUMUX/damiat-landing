import { useCallback, useEffect, useState } from 'react';
import { Button } from '@ai-ds/core/components/Button';
import { apiFetch } from '../api/client.js';
import { t } from '../i18n/ru.js';
import { rowActionsClass } from '../layout.js';

export interface PreviewVersionItem {
  id: string;
  createdAt: string;
  previewUrl: string;
  isActive: boolean;
  conceptId?: string;
  failedQa?: boolean;
}

interface PreviewVersionSliderProps {
  sessionId: string;
  cardId: string;
  /** Current display URL (active render at root). */
  activePreviewUrl: string;
  alt: string;
  busy?: boolean;
  onPreviewError?: () => void;
  onActiveVersionChange?: (payload: {
    previewSrc: string;
    conceptId?: string;
    failedQa?: boolean;
    qualityWarnings?: string[];
  }) => void;
}

export function PreviewVersionSlider({
  sessionId,
  cardId,
  activePreviewUrl,
  alt,
  busy,
  onPreviewError,
  onActiveVersionChange,
}: PreviewVersionSliderProps) {
  const [versions, setVersions] = useState<PreviewVersionItem[]>([]);
  const [activeVersionId, setActiveVersionId] = useState<string>('');
  const [viewIndex, setViewIndex] = useState(0);
  const [applying, setApplying] = useState(false);

  const loadVersions = useCallback(async () => {
    try {
      const data = await apiFetch<{
        activeVersionId: string;
        versions: PreviewVersionItem[];
      }>(`/session/${sessionId}/preview/${cardId}/versions`);
      setVersions(data.versions);
      setActiveVersionId(data.activeVersionId);
      const activeIdx = data.versions.findIndex((v) => v.id === data.activeVersionId);
      setViewIndex(activeIdx >= 0 ? activeIdx : 0);
    } catch {
      setVersions([]);
    }
  }, [sessionId, cardId]);

  useEffect(() => {
    void loadVersions();
  }, [loadVersions, activePreviewUrl]);

  if (versions.length <= 1) {
    return (
      <img
        src={activePreviewUrl}
        alt={alt}
        className="mt-[var(--space-content-m)] max-w-full rounded-[var(--radius-default)] border border-[var(--color-border-base)]"
        onError={onPreviewError}
      />
    );
  }

  const current = versions[viewIndex];
  const displayUrl = current
    ? `${current.previewUrl}?t=${viewIndex}`
    : activePreviewUrl;
  const isViewingActive = current?.id === activeVersionId;

  const go = (delta: number) => {
    setViewIndex((i) => {
      const next = i + delta;
      if (next < 0) return versions.length - 1;
      if (next >= versions.length) return 0;
      return next;
    });
  };

  const applyVersion = async () => {
    if (!current || isViewingActive) return;
    setApplying(true);
    try {
      const data = await apiFetch<{
        previewUrl: string;
        previewDataUrl?: string;
        conceptId?: string;
        failedQa?: boolean;
        qualityWarnings?: string[];
      }>(`/session/${sessionId}/preview/${cardId}/active-version`, {
        versionId: current.id,
      });
      const cacheBust = Date.now();
      const previewSrc = data.previewDataUrl?.startsWith('data:')
        ? data.previewDataUrl
        : `${data.previewUrl}?t=${cacheBust}`;
      setActiveVersionId(current.id);
      onActiveVersionChange?.({
        previewSrc,
        conceptId: data.conceptId,
        failedQa: data.failedQa,
        qualityWarnings: data.qualityWarnings,
      });
      await loadVersions();
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="mt-[var(--space-content-m)] flex flex-col gap-[var(--space-content-s)]">
      <img
        src={displayUrl}
        alt={alt}
        className="max-w-full rounded-[var(--radius-default)] border border-[var(--color-border-base)]"
        onError={onPreviewError}
      />
      <div className={rowActionsClass}>
        <Button
          appearance="outline"
          size="sm"
          disabled={busy || applying}
          onClick={() => go(-1)}
          aria-label={t.previewVersionPrev}
        >
          ←
        </Button>
        <span className="text-style-body-sm text-[var(--color-text-secondary)] flex-1 text-center">
          {t.previewVersionCounter(viewIndex + 1, versions.length)}
          {current?.conceptId ? ` · ${current.conceptId}` : ''}
          {isViewingActive ? ` · ${t.previewVersionActive}` : ''}
        </span>
        <Button
          appearance="outline"
          size="sm"
          disabled={busy || applying}
          onClick={() => go(1)}
          aria-label={t.previewVersionNext}
        >
          →
        </Button>
      </div>
      {!isViewingActive && (
        <Button
          appearance="brand"
          size="sm"
          disabled={busy || applying}
          onClick={() => void applyVersion()}
        >
          {t.previewVersionUseThis}
        </Button>
      )}
      <p className="text-style-caption text-[var(--color-text-secondary)] m-0">
        {t.previewVersionHint}
      </p>
    </div>
  );
}
