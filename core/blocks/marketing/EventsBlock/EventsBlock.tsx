import React, { useCallback, useState } from 'react';
import { SectionShell } from '../../_shared/SectionShell';
import { BlockSectionHeader } from '../../_shared/BlockSectionHeader';
import {
  BLOCK_EVENT_LIST_CARD_CLASS,
  BLOCK_ON_BRAND_ICON_BUTTON_CLASS,
  EVENTS_FEATURED_SPLIT_CLASS,
} from '../../_shared/blockLayout';
import { Badge } from '../../../components/primitives/Badge';
import { Divider } from '../../../components/primitives/Divider';
import { Tag } from '../../../components/primitives/Tag';
import { cn } from '../../../components/primitives/_shared';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, DotIcon } from './EventsBlockIcons';

export type EventFormat = 'online' | 'offline' | 'hybrid';

export interface EventItem {
  id?: string;
  format: EventFormat;
  /** Display label — default derived from `format` (онлайн / офлайн / гибрид). */
  formatLabel?: string;
  date: string;
  title: string;
  href?: string;
  location?: string;
}

export interface EventsBlockProps {
  title?: string;
  subtitle?: string;
  /** Section title size — `compact` for smaller band headings (e.g. «Мероприятия» on photo hero). */
  titleScale?: 'display' | 'section' | 'compact';
  events: EventItem[];
  /** Cortel-style brand band with carousel, or stacked list rows. */
  variant?: 'featured' | 'list';
  /** Carousel prev/next in featured mode — default true. */
  showNavigation?: boolean;
  /** Override SectionShell vertical padding (wins over recipe inline styles). */
  sectionStyle?: React.CSSProperties;
  className?: string;
}

const FORMAT_LABELS: Record<EventFormat, string> = {
  online: 'онлайн',
  offline: 'офлайн',
  hybrid: 'гибрид',
};

const ON_BRAND_BAND_BORDER = 'border-b border-[var(--color-text-on-brand)]/20';

const ON_BRAND_META_TAG_CLASS =
  'border-transparent bg-[var(--color-text-on-brand)]/15 text-[var(--color-text-on-brand)]';

function FormatDotIcon({ format }: { format: EventFormat }) {
  return (
    <DotIcon
      className={cn(
        format === 'online'
          ? 'text-[var(--color-success-base)]'
          : 'text-[var(--color-text-on-brand)]',
      )}
    />
  );
}

function EventMetaTags({ event }: { event: EventItem }) {
  const formatLabel = event.formatLabel ?? FORMAT_LABELS[event.format];

  return (
    <div
      className="flex w-full min-w-0 flex-wrap items-center"
      style={{ gap: 'var(--space-section-stack-s)' }}
    >
      <Tag
        appearance="ghost"
        size="sm"
        showLeftIcon
        iconLeft={<FormatDotIcon format={event.format} />}
        className={ON_BRAND_META_TAG_CLASS}
      >
        {formatLabel}
      </Tag>
      <Tag
        appearance="ghost"
        size="sm"
        showLeftIcon
        iconLeft={<CalendarIcon />}
        className={ON_BRAND_META_TAG_CLASS}
      >
        <time dateTime={event.date}>{event.date}</time>
      </Tag>
      {event.location ? (
        <Tag appearance="ghost" size="sm" className={ON_BRAND_META_TAG_CLASS}>
          {event.location}
        </Tag>
      ) : null}
    </div>
  );
}

function EventTitle({ event, onBrand = false }: { event: EventItem; onBrand?: boolean }) {
  const titleClass = cn(
    'm-0 max-w-[var(--space-640)] text-style-body font-normal leading-relaxed',
    onBrand ? 'text-inherit' : 'text-[var(--color-text-primary)]',
  );

  if (event.href) {
    return (
      <a href={event.href} className={cn(titleClass, 'no-underline transition-opacity hover:opacity-90')}>
        {event.title}
      </a>
    );
  }

  return <p className={titleClass}>{event.title}</p>;
}

function EventsNavigation({
  onPrevious,
  onNext,
  canPrevious,
  canNext,
}: {
  onPrevious: () => void;
  onNext: () => void;
  canPrevious: boolean;
  canNext: boolean;
}) {
  return (
    <div
      className="flex items-center"
      style={{ gap: 'var(--space-section-stack-s)' }}
      aria-label="Навигация по событиям"
    >
      <button
        type="button"
        disabled={!canPrevious}
        onClick={onPrevious}
        aria-label="Предыдущее событие"
        className={BLOCK_ON_BRAND_ICON_BUTTON_CLASS}
      >
        <ChevronLeftIcon />
      </button>
      <button
        type="button"
        disabled={!canNext}
        onClick={onNext}
        aria-label="Следующее событие"
        className={BLOCK_ON_BRAND_ICON_BUTTON_CLASS}
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
}

function FeaturedEventPanel({ event }: { event: EventItem }) {
  return (
    <article
      className="flex w-full min-w-0 flex-col"
      style={{ gap: 'var(--space-section-content-m)' }}
      aria-live="polite"
    >
      <EventMetaTags event={event} />
      <EventTitle event={event} onBrand />
    </article>
  );
}

function ListEventRow({ event }: { event: EventItem }) {
  const formatLabel = event.formatLabel ?? FORMAT_LABELS[event.format];

  return (
    <article
      className={cn(
        BLOCK_EVENT_LIST_CARD_CLASS,
        'flex w-full min-w-0 flex-col',
        'gap-[var(--space-section-stack-m)]',
        'min-[768px]:flex-row min-[768px]:items-center min-[768px]:gap-0',
      )}
    >
      <div className="flex shrink-0 items-center min-[768px]:pr-[var(--space-section-content-l)]">
        <Badge appearance="outline" size="sm">
          {formatLabel}
        </Badge>
      </div>

      <Divider
        orientation="vertical"
        size="sm"
        className="hidden min-[768px]:block self-stretch"
        style={{ height: 'auto', alignSelf: 'stretch' }}
      />

      <div
        className={cn(
          'flex shrink-0 flex-col gap-[var(--space-1)]',
          'min-[768px]:px-[var(--space-section-content-l)]',
        )}
      >
        <time
          dateTime={event.date}
          className="text-style-body font-medium text-[var(--color-text-primary)]"
        >
          {event.date}
        </time>
        {event.location ? (
          <span className="text-style-body-sm text-[var(--color-text-secondary)]">
            {event.location}
          </span>
        ) : null}
      </div>

      <Divider
        orientation="vertical"
        size="sm"
        className="hidden min-[768px]:block self-stretch"
        style={{ height: 'auto', alignSelf: 'stretch' }}
      />

      <div className="min-w-0 flex-1 min-[768px]:pl-[var(--space-section-content-l)]">
        <EventTitle event={event} />
      </div>
    </article>
  );
}

export const EventsBlock: React.FC<EventsBlockProps> = ({
  title = 'Ближайшие события',
  subtitle,
  titleScale,
  events,
  variant = 'featured',
  showNavigation = true,
  sectionStyle,
  className,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const safeIndex = events.length > 0 ? Math.min(activeIndex, events.length - 1) : 0;
  const activeEvent = events[safeIndex];

  const goPrevious = useCallback(() => {
    setActiveIndex((index) => Math.max(0, index - 1));
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((index) => Math.min(events.length - 1, index + 1));
  }, [events.length]);

  if (events.length === 0 || !activeEvent) return null;

  if (variant === 'list') {
    return (
      <SectionShell recipe="section.events" className={className} aria-label="Events">
        <BlockSectionHeader title={title} subtitle={subtitle} titleScale={titleScale} />
        <div
          className="flex w-full min-w-0 flex-col"
          style={{ gap: 'var(--space-section-stack-m)' }}
        >
          {events.map((event) => (
            <ListEventRow key={event.id ?? `${event.date}-${event.title}`} event={event} />
          ))}
        </div>
      </SectionShell>
    );
  }

  return (
    <SectionShell
      recipe="section.events"
      appearance="brand"
      style={sectionStyle}
      className={cn(ON_BRAND_BAND_BORDER, className)}
      aria-label="Events"
    >
      <div className={EVENTS_FEATURED_SPLIT_CLASS}>
        <div
          className="flex w-full min-w-0 max-w-[var(--space-280)] flex-col"
          style={{ gap: 'var(--space-section-content-m)' }}
        >
          <BlockSectionHeader title={title} subtitle={subtitle} onBrand titleScale={titleScale} />
          {showNavigation ? (
            <EventsNavigation
              onPrevious={goPrevious}
              onNext={goNext}
              canPrevious={safeIndex > 0}
              canNext={safeIndex < events.length - 1}
            />
          ) : null}
        </div>

        <FeaturedEventPanel event={activeEvent} />
      </div>
    </SectionShell>
  );
};

EventsBlock.displayName = 'EventsBlock';
