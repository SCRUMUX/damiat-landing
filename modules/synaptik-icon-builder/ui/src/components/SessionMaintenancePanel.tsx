import { Badge } from '@ai-ds/core/components/Badge';
import { Button } from '@ai-ds/core/components/Button';
import { Card } from '@ai-ds/core/components/Card';
import { Select } from '@ai-ds/core/components/Select';
import { t } from '../i18n/ru.js';
import type { IconSetStyleOption } from '../types.js';
import { rowActionsClass, sectionStackClass, synaptikCardClass } from '../layout.js';

interface SessionMaintenancePanelProps {
  iconStyleBlock?: string;
  iconSetStyleId: string;
  appliedIconSetStyleId?: string;
  iconSetStyleLabel?: string;
  styleOptions: IconSetStyleOption[];
  needsStyleRefresh: boolean;
  stylePendingApply: boolean;
  busy: boolean;
  onIconSetStyleChange: (id: string) => void;
  onRefreshStyle: (refreshConcepts: boolean) => void;
  onApplyIconSetStyle: (refreshConcepts: boolean) => void;
}

export function SessionMaintenancePanel({
  iconStyleBlock,
  iconSetStyleId,
  appliedIconSetStyleId,
  iconSetStyleLabel,
  styleOptions,
  needsStyleRefresh,
  stylePendingApply,
  busy,
  onIconSetStyleChange,
  onRefreshStyle,
  onApplyIconSetStyle,
}: SessionMaintenancePanelProps) {
  const appliedLabel =
    styleOptions.find((o) => o.id === appliedIconSetStyleId)?.labelRu ??
    iconSetStyleLabel;

  return (
    <Card variant="outlined" size="md" title={t.maintenanceTitle} className={synaptikCardClass}>
      <div className={sectionStackClass}>
        <p className="text-style-body-sm text-[var(--color-text-secondary)] m-0">
          {t.maintenanceHint}
        </p>
        {appliedLabel && (
          <p className="text-style-body-sm text-[var(--color-text-primary)] m-0">
            {t.iconSetStyleCurrent(appliedLabel)}
          </p>
        )}
        {stylePendingApply && (
          <Badge appearance="warning" size="sm">
            {t.stylePendingApply}
          </Badge>
        )}
        {needsStyleRefresh && !stylePendingApply && (
          <Badge appearance="warning" size="sm">
            {t.maintenanceNeedsRefresh}
          </Badge>
        )}
        <div className={sectionStackClass}>
          <label className="text-style-caption text-[var(--color-text-secondary)]" htmlFor="synaptik-session-icon-style">
            {t.iconSetStyleChange}
          </label>
          <Select
            id="synaptik-session-icon-style"
            size="sm"
            fullWidth
            value={iconSetStyleId}
            onValueChange={onIconSetStyleChange}
            options={styleOptions.map((o) => ({ value: o.id, label: o.labelRu }))}
            disabled={busy || styleOptions.length === 0}
          />
          <p className="text-style-caption text-[var(--color-text-secondary)] m-0">
            {t.iconSetStyleSessionHint}
          </p>
        </div>
        <div className={rowActionsClass}>
          <Button
            appearance="brand"
            size="sm"
            disabled={busy || !iconSetStyleId || !stylePendingApply}
            onClick={() => onApplyIconSetStyle(false)}
          >
            {t.iconSetStyleChange}
          </Button>
          <Button
            appearance="outline"
            size="sm"
            disabled={busy}
            onClick={() => onRefreshStyle(false)}
          >
            {t.maintenanceRefreshBible}
          </Button>
          <Button
            appearance="outline"
            size="sm"
            disabled={busy}
            onClick={() => onApplyIconSetStyle(true)}
          >
            {t.maintenanceRefreshConcepts}
          </Button>
        </div>
        {iconStyleBlock && (
          <p className="text-style-caption text-[var(--color-text-secondary)] m-0 line-clamp-3">
            {iconStyleBlock.split('\n').slice(0, 3).join(' · ')}
          </p>
        )}
      </div>
    </Card>
  );
}
