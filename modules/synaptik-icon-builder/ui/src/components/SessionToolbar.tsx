import { Badge } from '@ai-ds/core/components/Badge';
import { Button } from '@ai-ds/core/components/Button';
import { Card } from '@ai-ds/core/components/Card';
import { t } from '../i18n/ru.js';
import { contentStackTightClass, rowActionsClass, synaptikCardClass } from '../layout.js';

interface SessionToolbarProps {
  sessionId: string;
  projectSlug: string;
  iconSetStyleLabel?: string;
  busy: boolean;
  apiOk: boolean;
  url: string;
  onCloseSession: () => void;
  onNewAnalysis: () => void;
  onForceNew: () => void;
}

export function SessionToolbar({
  sessionId,
  projectSlug,
  iconSetStyleLabel,
  busy,
  apiOk,
  url,
  onCloseSession,
  onNewAnalysis,
  onForceNew,
}: SessionToolbarProps) {
  return (
    <Card variant="outlined" size="md" className={synaptikCardClass}>
      <div className={contentStackTightClass}>
        <div className={rowActionsClass}>
          <Badge appearance="brand" size="sm">
            {t.activeSessionBadge}
          </Badge>
          <span className="text-style-body-sm text-[var(--color-text-primary)]">
            {projectSlug || sessionId}
          </span>
          <span className="text-style-caption text-[var(--color-text-secondary)]">
            {sessionId}
          </span>
          {iconSetStyleLabel && (
            <Badge appearance="outline" size="sm">
              {t.iconSetStyleCurrent(iconSetStyleLabel)}
            </Badge>
          )}
        </div>
        <div className={rowActionsClass}>
          <Button appearance="ghost" size="sm" disabled={busy} onClick={onCloseSession}>
            {t.closeSession}
          </Button>
          <Button
            appearance="outline"
            size="sm"
            disabled={busy || !apiOk || !url.trim()}
            onClick={onNewAnalysis}
          >
            {t.newAnalysis}
          </Button>
          <Button
            appearance="outline"
            size="sm"
            disabled={busy || !apiOk || !url.trim()}
            title={t.forceNewTitle}
            onClick={onForceNew}
          >
            {t.forceNewSession}
          </Button>
        </div>
        <p className="text-style-caption text-[var(--color-text-secondary)] m-0">
          {t.sessionToolbarHint}
        </p>
      </div>
    </Card>
  );
}
