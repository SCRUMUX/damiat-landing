import React from 'react';
import {
  BLOCK_CARD_STANDARD_RADIUS_CLASS,
  BLOCK_GLASS_CHROME_PANEL_CLASS,
} from '../../_shared/blockLayout';
import { cn } from '../../../components/primitives/_shared';
import { RadixAccordion } from '../../../components/primitives/_internal/Accordion';
import {
  ShowcasePanelActionIcon,
  ShowcasePanelBulletIcon,
  ShowcasePanelCloseIcon,
  ShowcasePanelPlusIcon,
} from './ShowcasePanelBlockIcons';
import type { ShowcasePanelItem } from './ShowcasePanelBlock.types';

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
  'min-[1024px]:p-[var(--space-inset-xl)]',
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
  'min-[1024px]:data-[state=open]:flex min-[1024px]:data-[state=open]:min-h-0 min-[1024px]:data-[state=open]:flex-1 min-[1024px]:data-[state=open]:flex-col',
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

function ShowcasePanelBullets({ bullets }: { bullets: string[] }) {
  return (
    <ul className="m-0 flex list-none flex-col p-0" style={{ gap: 'var(--space-section-stack-m)' }}>
      {bullets.map((bullet) => (
        <li
          key={bullet}
          className="flex gap-[var(--space-section-stack-s)] min-[1024px]:gap-[var(--space-section-content-m)]"
        >
          <span className="text-[var(--color-brand-primary)]">
            <ShowcasePanelBulletIcon />
          </span>
          <span className="text-style-body-sm text-[var(--color-text-secondary)] min-[1024px]:text-style-body">
            {bullet}
          </span>
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

function ShowcasePanelItemBody({ panel, expanded }: { panel: ShowcasePanelItem; expanded?: boolean }) {
  return (
    <div
      className={cn(
        'flex flex-col',
        expanded && 'min-[1024px]:h-full min-[1024px]:min-h-0 min-[1024px]:justify-between',
      )}
      style={{ gap: 'var(--space-section-content-m)' }}
    >
      <div className="flex flex-col min-[1024px]:gap-[var(--space-section-content-l)]" style={{ gap: 'var(--space-section-content-m)' }}>
        <ShowcasePanelBullets bullets={panel.bullets} />
        <ShowcasePanelInlinePreview
          imageSrc={panel.imageSrc}
          imageAlt={panel.imageAlt}
          preview={panel.preview}
        />
      </div>
      {panel.action ? (
        <div className="min-[1024px]:mt-auto min-[1024px]:pt-[var(--space-section-content-m)]">
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
                'px-[var(--space-inset-l)] pb-[var(--space-inset-l)]',
                'min-[1024px]:flex min-[1024px]:h-full min-[1024px]:min-h-0 min-[1024px]:flex-1 min-[1024px]:flex-col',
                'min-[1024px]:px-[var(--space-inset-xl)] min-[1024px]:pb-[var(--space-inset-xl)]',
              )}
            >
              <ShowcasePanelItemBody panel={panel} expanded={isOpen} />
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
