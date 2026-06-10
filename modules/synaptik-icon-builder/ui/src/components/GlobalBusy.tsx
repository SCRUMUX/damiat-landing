import { Card } from '@ai-ds/core/components/Card';
import { CircularProgress } from '@ai-ds/core/components/CircularProgress';
import { rowActionsClass, synaptikCardClass } from '../layout.js';

interface GlobalBusyProps {
  busy: boolean;
  label: string;
}

export function GlobalBusy({ busy, label }: GlobalBusyProps) {
  if (!busy || !label) return null;
  return (
    <Card variant="outlined" size="sm" className={synaptikCardClass}>
      <div className={rowActionsClass}>
        <CircularProgress size="sm" />
        <span className="text-style-body-sm text-[var(--color-text-secondary)]" role="status">
          {label}
        </span>
      </div>
    </Card>
  );
}
