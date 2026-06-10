import React from 'react';
import {
  BLOCK_CARD_STANDARD_RADIUS_CLASS,
  BLOCK_GLASS_CHROME_PANEL_CLASS,
  BLOCK_STATUS_PILL_ALERT_CLASS,
  BLOCK_STATUS_PILL_OK_CLASS,
  BLOCK_STATUS_PILL_WATCH_CLASS,
} from '../../_shared/blockLayout';
import { cn } from '../../../components/primitives/_shared';
import { RadixAccordion } from '../../../components/primitives/_internal/Accordion';
import {
  ShowcasePanelActionIcon,
  ShowcasePanelBulletIcon,
  ShowcasePanelCloseIcon,
  ShowcasePanelPlusIcon,
} from './ShowcasePanelBlockIcons';
import type {
  ShowcasePanelItem,
  ShowcasePanelAlert,
  ShowcasePanelMetric,
  ShowcasePanelHarvestStatus,
  ShowcasePanelOperationMode,
  ShowcasePanelResource,
} from './ShowcasePanelBlock.types';

const ITEM_SHELL_CLASS = cn(
  'group flex flex-col overflow-hidden',
  BLOCK_CARD_STANDARD_RADIUS_CLASS,
  'bg-[var(--color-surface-1)] text-[var(--color-text-primary)]',
  'transition-[flex-grow,background-color] duration-500 ease-in-out',
  'hover:bg-[var(--color-surface-2)]',
  'min-[1024px]:data-[state=closed]:shrink-0 min-[1024px]:data-[state=closed]:flex-none',
  'min-[1024px]:data-[state=open]:min-h-0 min-[1024px]:data-[state=open]:flex-1',
);

const TRIGGER_CLASS = cn(
  'flex w-full min-w-0 items-center gap-[var(--space-section-content-m)]',
  'border-0 bg-transparent text-left cursor-pointer text-[var(--color-text-primary)]',
  'px-[var(--space-inset-l)] pb-[var(--space-22)] pt-[var(--space-inset-l)]',
  'min-[1024px]:px-[var(--space-inset-l)] min-[1024px]:py-[var(--space-inset-m)]',
  'outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]',
);

const TOGGLE_SHELL_CLASS = cn(
  'relative hidden h-[var(--space-40)] w-[var(--space-40)] shrink-0',
  'items-center justify-center rounded-[var(--radius-medium)]',
  'border border-[var(--color-border-base)] bg-[var(--color-surface-1)] text-[var(--color-text-primary)]',
  'transition-colors duration-200',
  'group-hover:border-[var(--color-brand-primary)] group-hover:bg-[var(--color-brand-primary)] group-hover:text-[var(--color-text-on-brand)]',
  'group-data-[state=open]:border-[var(--color-brand-primary)] group-data-[state=open]:bg-[var(--color-brand-primary)] group-data-[state=open]:text-[var(--color-text-on-brand)]',
  'min-[1024px]:flex',
);

const CONTENT_CLASS = cn(
  'overflow-hidden',
  'data-[state=closed]:animate-accordion-close data-[state=open]:animate-accordion-open',
  'min-[1024px]:!animate-none',
  'min-[1024px]:data-[state=closed]:hidden',
  'min-[1024px]:data-[state=open]:flex min-[1024px]:data-[state=open]:min-h-0 min-[1024px]:data-[state=open]:flex-1 min-[1024px]:data-[state=open]:flex-col min-[1024px]:data-[state=open]:overflow-hidden',
);

function ShowcaseToggleIcons() {
  return (
    <span className={TOGGLE_SHELL_CLASS} aria-hidden="true">
      <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 group-data-[state=open]:opacity-0">
        <ShowcasePanelPlusIcon />
      </span>
      <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-data-[state=open]:opacity-100">
        <ShowcasePanelCloseIcon />
      </span>
    </span>
  );
}

const PANEL_SECTION_GAP_CLASS = 'gap-[var(--space-8)] min-[1024px]:gap-[var(--space-8)]';

const COMPACT_TILE_CLASS =
  'rounded-[var(--radius-medium)] border border-[var(--color-border-base)] bg-[var(--color-surface-2)] px-[var(--space-8)] py-[var(--space-6)]';

function ShowcasePanelBullets({ bullets, secondary, compact }: { bullets: string[]; secondary?: boolean; compact?: boolean }) {
  if (bullets.length === 0) return null;

  return (
    <ul
      className={cn(
        'm-0 flex list-none flex-col p-0',
        compact && 'min-[1024px]:hidden',
      )}
      style={{ gap: 'var(--space-section-stack-m)' }}
    >
      {bullets.map((bullet) => (
        <li
          key={bullet}
          className="flex gap-[var(--space-section-stack-s)] min-[1024px]:gap-[var(--space-section-content-m)]"
        >
          <span className={cn('text-[var(--color-brand-primary)]', secondary && 'opacity-70')}>
            <ShowcasePanelBulletIcon />
          </span>
          <span
            className={cn(
              'text-style-body-sm min-[1024px]:text-style-body',
              secondary
                ? 'font-normal text-[var(--color-text-muted)]'
                : 'text-[var(--color-text-secondary)]',
            )}
          >
            {bullet}
          </span>
        </li>
      ))}
    </ul>
  );
}

const METRIC_TREND_LABEL: Record<NonNullable<ShowcasePanelMetric['trend']>, string> = {
  up: '↑ растёт',
  down: '↓ снижается',
  stable: '→ стабильно',
};

export function ShowcasePanelStatusPill({ status }: { status: ShowcasePanelHarvestStatus }) {
  return (
    <span
      className={cn(
        status.level === 'ok' && BLOCK_STATUS_PILL_OK_CLASS,
        status.level === 'watch' && BLOCK_STATUS_PILL_WATCH_CLASS,
        status.level === 'alert' && BLOCK_STATUS_PILL_ALERT_CLASS,
      )}
    >
      {status.label}
    </span>
  );
}

/** @deprecated Use `ShowcasePanelStatusPill` */
const ShowcasePanelHarvestStatusPill = ShowcasePanelStatusPill;

function ShowcasePanelMetrics({
  metrics,
  compact,
}: {
  metrics: ShowcasePanelMetric[];
  compact?: boolean;
}) {
  if (metrics.length === 0) return null;

  return (
    <ul
      className={cn(
        'm-0 list-none p-0 gap-[var(--space-6)]',
        compact && metrics.length > 1
          ? 'grid grid-cols-1 min-[1024px]:grid-cols-2 min-[1024px]:gap-[var(--space-8)]'
          : 'flex flex-col',
      )}
    >
      {metrics.map((metric) => (
        <li key={metric.label} className={COMPACT_TILE_CLASS}>
          <div className="flex items-start justify-between gap-[var(--space-6)]">
            <span className="min-w-0 text-style-caption font-normal leading-snug text-[var(--color-text-muted)]">
              {metric.label}
            </span>
            {metric.trend ? (
              <span className="shrink-0 text-style-caption font-normal text-[var(--color-text-muted)]">
                {METRIC_TREND_LABEL[metric.trend]}
              </span>
            ) : null}
          </div>
          <p className="m-0 mt-[var(--space-2)] text-style-body-sm font-normal leading-snug text-[var(--color-text-primary)]">
            <span className="font-medium">
              {metric.value}
              {metric.unit ? `\u00a0${metric.unit}` : ''}
            </span>
            <span className="text-[var(--color-text-muted)]">
              {' · '}
              {metric.min}–{metric.max}
              {metric.unit ? `\u00a0${metric.unit}` : ''}
            </span>
          </p>
        </li>
      ))}
    </ul>
  );
}

function ShowcasePanelModeSwitcher({
  modes,
  status,
  modesLabel = 'Режим генератора',
}: {
  modes: ShowcasePanelOperationMode[];
  status?: ShowcasePanelHarvestStatus;
  modesLabel?: string;
}) {
  if (modes.length === 0) return null;

  return (
    <div className="flex flex-col gap-[var(--space-4)]">
      <span className="text-style-caption font-normal leading-snug text-[var(--color-text-muted)]">
        {modesLabel}
      </span>
      <div className="flex flex-col gap-[var(--space-6)] min-[1024px]:flex-row min-[1024px]:items-center min-[1024px]:gap-[var(--space-8)]">
        <div
          role="group"
          aria-label={modesLabel}
          className="grid min-w-0 flex-1 gap-[var(--space-2)] rounded-[var(--radius-medium)] border border-[var(--color-border-base)] bg-[var(--color-surface-2)] p-[var(--space-2)]"
          style={{ gridTemplateColumns: `repeat(${modes.length}, minmax(0, 1fr))` }}
        >
          {modes.map((mode) => (
            <div
              key={mode.id}
              aria-current={mode.active ? 'true' : undefined}
              className={cn(
                'rounded-[calc(var(--radius-medium)-var(--space-2))] px-[var(--space-6)] py-[var(--space-4)] text-center',
                'text-style-caption font-normal leading-snug transition-colors',
                mode.active
                  ? 'bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] shadow-[0_1px_2px_color-mix(in_srgb,var(--color-text-primary)_12%,transparent)]'
                  : 'text-[var(--color-text-secondary)]',
              )}
            >
              {mode.label}
            </div>
          ))}
        </div>
        {status ? <ShowcasePanelHarvestStatusPill status={status} /> : null}
      </div>
    </div>
  );
}

function ShowcasePanelMonitoringHeader({
  modes,
  status,
  modesLabel,
}: {
  modes?: ShowcasePanelOperationMode[];
  status?: ShowcasePanelHarvestStatus;
  modesLabel?: string;
}) {
  if (!modes?.length && !status) return null;

  const inactiveMode = modes?.find((mode) => !mode.active && mode.description);

  return (
    <div className={cn('flex flex-col', PANEL_SECTION_GAP_CLASS)}>
      {modes?.length ? (
        <ShowcasePanelModeSwitcher modes={modes} status={status} modesLabel={modesLabel} />
      ) : status ? (
        <ShowcasePanelHarvestStatusPill status={status} />
      ) : null}
      {inactiveMode ? (
        <p className="m-0 text-style-caption font-normal leading-snug text-[var(--color-text-muted)]">
          {inactiveMode.description}
        </p>
      ) : null}
    </div>
  );
}

function ShowcasePanelResources({ resources }: { resources: ShowcasePanelResource[] }) {
  if (resources.length === 0) return null;

  return (
    <ul className="m-0 flex list-none flex-col p-0 gap-[var(--space-6)]">
      {resources.map((resource) => (
        <li key={resource.label} className={COMPACT_TILE_CLASS}>
          <div className="flex items-start justify-between gap-[var(--space-6)]">
            <span className="min-w-0 text-style-caption font-normal leading-snug text-[var(--color-text-muted)]">
              {resource.label}
            </span>
            {resource.trend ? (
              <span className="shrink-0 text-style-caption font-normal text-[var(--color-text-muted)]">
                {METRIC_TREND_LABEL[resource.trend]}
              </span>
            ) : null}
          </div>
          <p className="m-0 mt-[var(--space-2)] text-style-body-sm font-normal leading-snug text-[var(--color-text-primary)]">
            <span className="font-medium">
              {resource.level}
              {resource.unit ? `\u00a0${resource.unit}` : ''}
            </span>
            {resource.consumption ? (
              <span className="text-[var(--color-text-muted)]"> · {resource.consumption}</span>
            ) : null}
          </p>
        </li>
      ))}
    </ul>
  );
}

function ShowcasePanelSignals({
  metrics,
  resources,
}: {
  metrics?: ShowcasePanelMetric[];
  resources?: ShowcasePanelResource[];
}) {
  const hasMetrics = Boolean(metrics?.length);
  const hasResources = Boolean(resources?.length);
  if (!hasMetrics && !hasResources) return null;

  const useGrid = hasMetrics && hasResources;

  return (
    <div
      className={cn(
        useGrid &&
          'grid grid-cols-1 gap-[var(--space-6)] min-[1024px]:grid-cols-2 min-[1024px]:gap-[var(--space-8)]',
        !useGrid && 'flex flex-col gap-[var(--space-6)]',
      )}
    >
      {hasMetrics ? (
        <div className={useGrid ? 'min-w-0' : undefined}>
          <ShowcasePanelMetrics metrics={metrics!} compact />
        </div>
      ) : null}
      {hasResources ? (
        <div className={useGrid ? 'min-w-0' : undefined}>
          <ShowcasePanelResources resources={resources!} />
        </div>
      ) : null}
    </div>
  );
}

function ShowcasePanelAlertCard({
  alert,
  compact,
}: {
  alert: ShowcasePanelAlert;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        'shrink-0 rounded-[var(--radius-medium)] border px-[var(--space-8)] py-[var(--space-6)]',
        alert.level === 'warning' &&
          'border-[var(--color-danger-base)] bg-[color-mix(in_srgb,var(--color-danger-subtle)_75%,var(--color-surface-1))]',
        alert.level === 'info' &&
          'border-[var(--color-border-base)] bg-[var(--color-surface-2)]',
        alert.level === 'success' &&
          'border-[var(--color-brand-primary)] bg-[var(--color-brand-muted)]',
      )}
    >
      {alert.timeframe && !alert.detail ? (
        <p className="m-0 text-style-caption font-normal leading-snug text-[var(--color-text-muted)]">
          {alert.timeframe}
        </p>
      ) : null}
      <p
        className={cn(
          'm-0 text-style-caption font-normal leading-snug text-[var(--color-text-primary)]',
          alert.timeframe && !alert.detail && 'mt-[var(--space-2)]',
          compact && !alert.detail && 'min-[1024px]:line-clamp-2',
        )}
      >
        {alert.level === 'warning' ? '⚠ ' : alert.level === 'success' ? '✓ ' : 'ℹ '}
        {alert.title}
      </p>
      {alert.detail ? (
        <p className="m-0 mt-[var(--space-2)] text-style-caption font-normal leading-snug text-[var(--color-text-muted)] whitespace-pre-line">
          {alert.detail}
        </p>
      ) : alert.timeframe ? (
        <p className="m-0 mt-[var(--space-2)] text-style-caption font-normal leading-snug text-[var(--color-text-muted)]">
          {alert.timeframe}
        </p>
      ) : null}
    </div>
  );
}

function ShowcasePanelAlerts({ alerts, compact }: { alerts: ShowcasePanelAlert[]; compact?: boolean }) {
  if (alerts.length === 0) return null;

  return (
    <ul className="m-0 flex list-none flex-col p-0 gap-[var(--space-6)]">
      {alerts.map((alert) => (
        <li key={`${alert.level}-${alert.title}-${alert.actor ?? ''}`}>
          <ShowcasePanelAlertCard alert={alert} compact={compact} />
        </li>
      ))}
    </ul>
  );
}

function ShowcasePanelInlinePreview({
  imageSrc,
  imageAlt,
  preview,
}: Pick<ShowcasePanelItem, 'imageSrc' | 'imageAlt' | 'preview'>) {
  if (preview) {
    return <div className="min-[1024px]:hidden">{preview}</div>;
  }

  if (!imageSrc) return null;

  return (
    <img
      src={imageSrc}
      alt={imageAlt ?? ''}
      className="block h-auto w-full min-[1024px]:hidden"
    />
  );
}

function ShowcasePanelAction({ panel }: { panel: ShowcasePanelItem }) {
  if (!panel.action) return null;

  const className = cn(
    'inline-flex w-full items-center gap-[var(--space-section-stack-s)]',
    'min-h-[var(--space-56)] rounded-[var(--radius-section)] px-[var(--space-inset-xl)]',
    'bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] no-underline',
    'transition-colors duration-200 hover:bg-[var(--color-brand-hover)]',
    'min-[1024px]:min-h-[var(--space-64)] min-[1024px]:rounded-[var(--radius-large)]',
  );

  const icon = (
    <span className="inline-flex h-[var(--space-24)] w-[var(--space-24)] shrink-0 items-center justify-center rounded-[var(--radius-medium)] bg-[color-mix(in_srgb,var(--color-text-on-brand)_12%,transparent)] min-[1024px]:h-[var(--space-28)] min-[1024px]:w-[var(--space-28)]">
      <ShowcasePanelActionIcon />
    </span>
  );

  if (panel.action.href) {
    return (
      <a
        href={panel.action.href}
        onClick={panel.action.onClick}
        className={className}
        target={panel.action.href.startsWith('http') ? '_blank' : undefined}
        rel={panel.action.href.startsWith('http') ? 'noreferrer' : undefined}
      >
        {icon}
        <span className="text-style-body text-[var(--color-text-on-brand)]">{panel.action.label}</span>
      </a>
    );
  }

  return (
    <button type="button" onClick={panel.action.onClick} className={className}>
      {icon}
      <span className="text-style-body text-[var(--color-text-on-brand)]">{panel.action.label}</span>
    </button>
  );
}

export function ShowcasePanelMonitoringView({
  panel,
  expanded = true,
  layout = 'accordion',
}: {
  panel: ShowcasePanelItem;
  expanded?: boolean;
  layout?: 'accordion' | 'workspace';
}) {
  const hasMonitoringLayout = Boolean(
    panel.modes?.length || panel.status || panel.metrics?.length || panel.resources?.length,
  );
  const isWorkspace = layout === 'workspace';
  const distributeDesktop = Boolean(!isWorkspace && hasMonitoringLayout && expanded);

  return (
    <div
      className={cn(
        'flex min-h-0 flex-1 flex-col',
        distributeDesktop && 'min-[1024px]:justify-between min-[1024px]:overflow-hidden',
        !distributeDesktop && !isWorkspace && expanded && 'min-[1024px]:justify-between',
        isWorkspace && 'gap-[var(--space-content-s)]',
      )}
      style={
        distributeDesktop || isWorkspace ? undefined : { gap: 'var(--space-section-content-m)' }
      }
    >
      {hasMonitoringLayout ? (
        <>
          <div className={cn(distributeDesktop && 'shrink-0')}>
            <ShowcasePanelMonitoringHeader
              modes={panel.modes}
              status={panel.status}
              modesLabel={panel.modesLabel}
            />
          </div>
          <div className={cn(distributeDesktop && 'shrink-0')}>
            <ShowcasePanelSignals metrics={panel.metrics} resources={panel.resources} />
          </div>
        </>
      ) : (
        <div className={cn('flex flex-col', PANEL_SECTION_GAP_CLASS)}>
          {panel.status ? <ShowcasePanelHarvestStatusPill status={panel.status} /> : null}
          {panel.metrics?.length ? <ShowcasePanelMetrics metrics={panel.metrics} /> : null}
        </div>
      )}
      {panel.alerts?.length
        ? distributeDesktop
          ? panel.alerts.map((alert) => (
              <ShowcasePanelAlertCard
                key={`${alert.level}-${alert.title}-${alert.actor ?? ''}`}
                alert={alert}
                compact={hasMonitoringLayout}
              />
            ))
          : (
              <ShowcasePanelAlerts alerts={panel.alerts} compact={hasMonitoringLayout} />
            )
        : null}
      {panel.bullets.length ? (
        <ShowcasePanelBullets
          bullets={panel.bullets}
          secondary={hasMonitoringLayout}
          compact={hasMonitoringLayout}
        />
      ) : null}
      <ShowcasePanelInlinePreview
        imageSrc={panel.imageSrc}
        imageAlt={panel.imageAlt}
        preview={panel.preview}
      />
      {panel.action ? (
        <div
          className={cn(
            'shrink-0',
            !isWorkspace && 'min-[1024px]:pt-[var(--space-section-content-m)]',
          )}
        >
          <ShowcasePanelAction panel={panel} />
        </div>
      ) : null}
    </div>
  );
}

export interface ShowcasePanelAccordionProps {
  panels: ShowcasePanelItem[];
  value: string;
  onValueChange: (value: string) => void;
}

export const ShowcasePanelAccordion: React.FC<ShowcasePanelAccordionProps> = ({
  panels,
  value,
  onValueChange,
}) => (
  <RadixAccordion.Root
    type="single"
    collapsible
    value={value}
    onValueChange={onValueChange}
    className={cn(
      'flex h-full min-h-0 w-full min-w-0 flex-col',
      'gap-[var(--space-section-stack-s)]',
      'min-[1024px]:gap-[var(--space-section-content-m)]',
    )}
    style={{ ['--accordion-transition-duration' as string]: '500ms' }}
  >
    {panels.map((panel) => {
      const isOpen = panel.id === value;

      return (
        <RadixAccordion.Item key={panel.id} value={panel.id} className={ITEM_SHELL_CLASS}>
          <RadixAccordion.Header className="flex shrink-0">
            <RadixAccordion.Trigger className={TRIGGER_CLASS}>
              <span className="min-w-0 flex-1 font-medium text-style-h3 text-[var(--color-text-primary)] min-[1024px]:text-style-h4">
                {panel.title}
              </span>
              <ShowcaseToggleIcons />
            </RadixAccordion.Trigger>
          </RadixAccordion.Header>
          <RadixAccordion.Content className={CONTENT_CLASS}>
            <div
              className={cn(
                'box-border px-[var(--space-inset-l)] pb-[var(--space-inset-l)]',
                'min-[1024px]:flex min-[1024px]:min-h-0 min-[1024px]:flex-1 min-[1024px]:flex-col min-[1024px]:overflow-hidden',
                'min-[1024px]:px-[var(--space-inset-l)] min-[1024px]:pb-[var(--space-inset-l)]',
              )}
            >
              <ShowcasePanelMonitoringView panel={panel} expanded={isOpen} />
            </div>
          </RadixAccordion.Content>
        </RadixAccordion.Item>
      );
    })}
  </RadixAccordion.Root>
);

ShowcasePanelAccordion.displayName = 'ShowcasePanelAccordion';

export interface ShowcasePanelPreviewProps {
  panels: ShowcasePanelItem[];
  activeId: string;
}

export const ShowcasePanelPreview: React.FC<ShowcasePanelPreviewProps> = ({
  panels,
  activeId,
}) => (
  <div
    className={cn(
      'relative h-full min-h-0 w-full overflow-hidden',
      BLOCK_GLASS_CHROME_PANEL_CLASS,
    )}
    aria-hidden="true"
  >
    {panels.map((panel) => {
      const isActive = panel.id === activeId;
      const zIndex = isActive ? 2 : 1;

      if (panel.preview) {
        return (
          <div
            key={panel.id}
            className={cn(
              'absolute inset-0 transition-opacity duration-500',
              isActive ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
            style={{ zIndex }}
          >
            {panel.preview}
          </div>
        );
      }

      if (!panel.imageSrc) return null;

      return (
        <img
          key={panel.id}
          src={panel.imageSrc}
          alt={panel.imageAlt ?? ''}
          className={cn(
            'absolute inset-0 h-full w-full object-contain object-left-top p-[var(--space-6)] transition-opacity duration-500',
            isActive ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
          style={{ zIndex }}
        />
      );
    })}
  </div>
);

ShowcasePanelPreview.displayName = 'ShowcasePanelPreview';
