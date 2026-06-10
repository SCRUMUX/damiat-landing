import { Button } from '@ai-ds/core/components/Button';
import { Card } from '@ai-ds/core/components/Card';
import { Alert } from '@ai-ds/core/components/Alert';
import { Badge } from '@ai-ds/core/components/Badge';
import { SkeletonCard } from '@ai-ds/core/components/SkeletonCard';
import { formatDateRu, t } from '../i18n/ru.js';
import {
  contentStackTightClass,
  fullWidthSectionClass,
  listStackClass,
  rowActionsClass,
  sectionStackClass,
  synaptikCardClass,
} from '../layout.js';
import type { SessionSummary } from '../types.js';

interface SessionsPanelProps {
  sessionList: SessionSummary[];
  activeSessionId: string;
  sessionsError: string;
  sessionsLoading: boolean;
  apiUnavailable: boolean;
  busy: boolean;
  onOpen: (sessionId: string) => void;
  onRefresh: () => void;
  onCloseActive?: () => void;
  onDeleteSession?: (sessionId: string) => void;
}

export function SessionsPanel({
  sessionList,
  activeSessionId,
  sessionsError,
  sessionsLoading,
  apiUnavailable,
  busy,
  onOpen,
  onRefresh,
  onCloseActive,
  onDeleteSession,
}: SessionsPanelProps) {
  return (
    <Card
      variant="outlined"
      size="md"
      title={t.savedProjects}
      description={t.savedProjectsHint}
      className={synaptikCardClass}
    >
      <div className={sectionStackClass}>
        {sessionsLoading && (
          <>
            <p className="text-style-body-sm text-[var(--color-text-secondary)] m-0">
              {t.loadingSessions}
            </p>
            <SkeletonCard size="sm" shimmer />
            <SkeletonCard size="sm" shimmer />
          </>
        )}
        {!sessionsLoading && sessionsError && (
          <Alert
            appearance="danger"
            showTitle={false}
            paragraph={sessionsError}
            showLeftIcon
            className={`${fullWidthSectionClass} !justify-start !items-start [&_span]:w-full`}
          />
        )}
        {!sessionsLoading && apiUnavailable && (
          <p className="text-style-body-sm text-[var(--color-text-secondary)] m-0">
            {t.sessionsUnavailableHint}
          </p>
        )}
        {!sessionsLoading && sessionList.length === 0 && !sessionsError && !apiUnavailable && (
          <p className="text-style-body-sm text-[var(--color-text-secondary)] m-0">{t.noSessions}</p>
        )}
        {!sessionsLoading && (
          <ul className={`m-0 list-none p-0 ${listStackClass}`}>
            {sessionList.map((s) => {
              const active = s.sessionId === activeSessionId;
              return (
                <li key={s.sessionId}>
                  <Card
                    variant={active ? 'elevated' : 'outlined'}
                    size="sm"
                    className={synaptikCardClass}
                    footer={
                      <div className={rowActionsClass}>
                        {active && (
                          <Badge appearance="brand" size="sm">
                            {t.activeSessionBadge}
                          </Badge>
                        )}
                        {active && onCloseActive && (
                          <Button
                            appearance="ghost"
                            size="sm"
                            disabled={busy}
                            onClick={onCloseActive}
                          >
                            {t.closeSession}
                          </Button>
                        )}
                        <Button
                          appearance="outline"
                          size="sm"
                          disabled={busy}
                          onClick={() => onOpen(s.sessionId)}
                        >
                          {t.open}
                        </Button>
                        {onDeleteSession && (
                          <Button
                            appearance="ghost"
                            size="sm"
                            disabled={busy}
                            onClick={() => onDeleteSession(s.sessionId)}
                          >
                            {t.deleteSession}
                          </Button>
                        )}
                      </div>
                    }
                  >
                    <div className={`${contentStackTightClass} min-w-0`}>
                      <span className="text-style-body-strong text-[var(--color-text-primary)]">
                        {s.projectSlug}
                      </span>
                      <span className="text-style-caption text-[var(--color-text-secondary)]">
                        {s.sessionId} · {formatDateRu(s.createdAt)}
                      </span>
                      {s.sourceUrl && (
                        <span className="text-style-caption text-[var(--color-text-secondary)] truncate">
                          {s.sourceUrl}
                        </span>
                      )}
                      <span className="text-style-caption text-[var(--color-text-secondary)]">
                        {t.sessionStats(s.cardCount, s.renderedCount)}
                        {s.styleLabel ? ` · ${s.styleLabel}` : ''}
                      </span>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
        <div className={`${rowActionsClass} justify-start`}>
          <Button
            appearance="ghost"
            size="sm"
            className="w-fit self-start"
            disabled={busy || sessionsLoading}
            onClick={onRefresh}
          >
            {t.refreshList}
          </Button>
        </div>
      </div>
    </Card>
  );
}
