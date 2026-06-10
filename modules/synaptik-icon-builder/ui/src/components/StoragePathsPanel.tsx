import { useEffect, useState } from 'react';
import { Card } from '@ai-ds/core/components/Card';
import { apiFetch } from '../api/client.js';
import { t } from '../i18n/ru.js';
import { contentStackTightClass, synaptikCardClass } from '../layout.js';

interface StoragePathsResponse {
  sessionRendersDirRel?: string;
  catalogRootRel: string;
  catalogProjectDirRel?: string;
  projectSlug?: string;
  publishReadyCount?: number;
}

interface StoragePathsPanelProps {
  sessionId: string;
  publishReadyCount?: number;
}

export function StoragePathsPanel({
  sessionId,
  publishReadyCount = 0,
}: StoragePathsPanelProps) {
  const [paths, setPaths] = useState<StoragePathsResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    void apiFetch<StoragePathsResponse>(
      `/storage-paths?sessionId=${encodeURIComponent(sessionId)}`,
    )
      .then((data) => {
        if (!cancelled) setPaths(data);
      })
      .catch(() => {
        if (!cancelled) setPaths(null);
      });
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (!paths) return null;

  return (
    <Card variant="outlined" size="sm" title={t.storagePathsTitle} className={synaptikCardClass}>
      <div className={`${contentStackTightClass} text-style-caption text-[var(--color-text-secondary)]`}>
        <p className="m-0">{t.storagePathsHint}</p>
        {paths.sessionRendersDirRel && (
          <p className="m-0">
            <strong>{t.storagePreviewPath}:</strong>{' '}
            <code className="text-style-caption">{paths.sessionRendersDirRel}</code>
          </p>
        )}
        <p className="m-0">
          <strong>{t.storageCatalogPath}:</strong>{' '}
          <code className="text-style-caption">
            {paths.catalogProjectDirRel ?? paths.catalogRootRel}
          </code>
          {paths.projectSlug ? ` (${paths.projectSlug})` : ''}
        </p>
        {publishReadyCount > 0 && (
          <p className="m-0 text-[var(--color-text-primary)]">{t.publishReadyCount(publishReadyCount)}</p>
        )}
      </div>
    </Card>
  );
}
