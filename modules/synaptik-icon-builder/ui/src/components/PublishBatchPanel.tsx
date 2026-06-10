import { Button } from '@ai-ds/core/components/Button';
import { Card } from '@ai-ds/core/components/Card';
import { t } from '../i18n/ru.js';
import { rowActionsClass, synaptikCardClass } from '../layout.js';

interface PublishBatchPanelProps {
  publishReadyCount: number;
  busy: boolean;
  onPublishAllReady: () => void;
}

export function PublishBatchPanel({
  publishReadyCount,
  busy,
  onPublishAllReady,
}: PublishBatchPanelProps) {
  if (publishReadyCount <= 0) return null;

  return (
    <Card variant="outlined" size="sm" className={synaptikCardClass}>
      <div className={rowActionsClass}>
        <Button
          appearance="primary"
          size="sm"
          disabled={busy}
          onClick={onPublishAllReady}
        >
          {t.publishAllReady} ({publishReadyCount})
        </Button>
        <span className="text-style-caption text-[var(--color-text-secondary)]">
          {t.publishAllReadyHint}
        </span>
      </div>
    </Card>
  );
}
