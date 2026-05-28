import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../../components/primitives/_shared';
import { Link } from '../../../components/primitives/Link';
import { Tabs, TabList, Tab, TabPanel } from '../../../components/primitives/Tab';
import {
  BLOCK_CONTENT_CLASS,
  BLOCK_GLASS_SCRIM_CLASS,
  BLOCK_GRID_BASE_CLASS,
  BLOCK_GRID_COL_CLASS,
} from '../../_shared/blockLayout';
import type { NavbarServiceCategory } from './NavbarBlock.types';
import { lockScrollRoot } from './navbarTheme';

const CHROME_HEIGHT_FALLBACK = 72;

export interface NavbarServicesPanelProps {
  open: boolean;
  categories: NavbarServiceCategory[];
  onClose: () => void;
  layout?: 'inline' | 'portal';
  chromeHeight?: number;
  returnFocusRef?: React.RefObject<HTMLElement>;
  id?: string;
}

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true');
}

function ServicesPanelBody({
  categories,
  id,
  panelRef,
}: {
  categories: NavbarServiceCategory[];
  id: string;
  panelRef: React.RefObject<HTMLDivElement>;
}) {
  const defaultTab = categories[0]?.id ?? '';

  return (
    <div
      id={id}
      ref={panelRef}
      role="region"
      aria-label="Services menu"
      className={cn(
        'w-full border-t border-[var(--color-border-base)] bg-[var(--color-surface-1)] shadow-elevation-2',
        'animate-fade-in overflow-y-auto max-h-[70dvh]',
      )}
    >
      <div className={BLOCK_CONTENT_CLASS}>
        <div className="py-[var(--space-section-y-m)]">
          <Tabs defaultValue={defaultTab} orientation="vertical" className="w-full">
            <div className="flex w-full min-w-0 flex-col gap-[var(--space-section-content-m)] min-[768px]:flex-row min-[768px]:gap-[var(--space-section-content-l)]">
              <TabList
                className={cn(
                  'flex w-full shrink-0 flex-row gap-[var(--space-2)] overflow-x-auto pb-[var(--space-4)]',
                  'min-[768px]:w-[var(--space-280)] min-[768px]:flex-col min-[768px]:items-stretch min-[768px]:overflow-visible min-[768px]:pb-0',
                  'border-b border-[var(--color-border-base)] min-[768px]:border-b-0 min-[768px]:border-r min-[768px]:pr-[var(--space-section-content-m)]',
                )}
              >
                {categories.map((cat) => (
                  <Tab
                    key={cat.id}
                    value={cat.id}
                    appearance="brand"
                    size="sm"
                    className="shrink-0 justify-start whitespace-nowrap text-left min-[768px]:w-full"
                  >
                    {cat.label}
                  </Tab>
                ))}
              </TabList>
              <div className="min-w-0 flex-1 pt-[var(--space-4)] min-[768px]:pt-0">
                {categories.map((cat) => (
                  <TabPanel key={cat.id} value={cat.id}>
                    {renderServiceGrid(cat.items)}
                  </TabPanel>
                ))}
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

/** Fixed scrim below chrome — does not cover the navbar. */
export function NavbarServicesScrim({
  chromeHeight,
  onClose,
}: {
  chromeHeight: number;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === 'undefined') return null;

  const topPx = Math.max(chromeHeight, CHROME_HEIGHT_FALLBACK);

  return createPortal(
    <button
      type="button"
      aria-label="Close services menu"
      className={cn(
        'fixed left-0 right-0 bottom-0 z-[var(--z-modal)]',
        BLOCK_GLASS_SCRIM_CLASS,
      )}
      style={{ top: topPx }}
      onClick={onClose}
    />,
    document.body,
  );
}

/**
 * Mega menu — inline (in-tree chrome expansion) or legacy portal layout.
 * Panel surface is opaque `surface-1` (readable dropdown) — not BLOCK_GLASS_*; scrim uses BLOCK_GLASS_SCRIM_CLASS.
 */
export const NavbarServicesPanel: React.FC<NavbarServicesPanelProps> = ({
  open,
  categories,
  onClose,
  layout = 'inline',
  chromeHeight = CHROME_HEIGHT_FALLBACK,
  returnFocusRef,
  id = 'navbar-services-panel',
}) => {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    return lockScrollRoot(true);
  }, [open]);

  useEffect(() => {
    if (!open || !panelRef.current) return undefined;

    const first = getFocusable(panelRef.current)[0];
    first?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = getFocusable(panelRef.current);
        if (focusables.length === 0) return;
        const firstEl = focusables[0];
        const lastEl = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) return undefined;
    returnFocusRef?.current?.focus();
    return undefined;
  }, [open, returnFocusRef]);

  if (!open || categories.length === 0) return null;

  if (layout === 'inline') {
    if (!mounted) return null;
    return <ServicesPanelBody categories={categories} id={id} panelRef={panelRef} />;
  }

  if (!mounted || typeof document === 'undefined') return null;

  const topPx = Math.max(chromeHeight, CHROME_HEIGHT_FALLBACK);
  const panelMaxHeight = `calc(100dvh - ${topPx}px)`;

  return createPortal(
    <>
      <NavbarServicesScrim chromeHeight={chromeHeight} onClose={onClose} />
      <div
        id={id}
        ref={panelRef}
        role="region"
        aria-label="Services menu"
        className={cn(
          'fixed left-0 right-0 z-[calc(var(--z-modal)+1)]',
          'border-b border-[var(--color-border-base)] bg-[var(--color-surface-1)] shadow-elevation-2',
          'animate-fade-in overflow-y-auto',
        )}
        style={{ top: topPx, maxHeight: panelMaxHeight }}
      >
        <div className={BLOCK_CONTENT_CLASS}>
          <div className="py-[var(--space-section-y-m)]">
            <Tabs defaultValue={categories[0]?.id ?? ''} orientation="vertical" className="w-full">
              <div className="flex w-full min-w-0 flex-col gap-[var(--space-section-content-m)] min-[768px]:flex-row min-[768px]:gap-[var(--space-section-content-l)]">
                <TabList
                  className={cn(
                    'flex w-full shrink-0 flex-row gap-[var(--space-2)] overflow-x-auto pb-[var(--space-4)]',
                    'min-[768px]:w-[var(--space-280)] min-[768px]:flex-col min-[768px]:items-stretch min-[768px]:overflow-visible min-[768px]:pb-0',
                    'border-b border-[var(--color-border-base)] min-[768px]:border-b-0 min-[768px]:border-r min-[768px]:pr-[var(--space-section-content-m)]',
                  )}
                >
                  {categories.map((cat) => (
                    <Tab
                      key={cat.id}
                      value={cat.id}
                      appearance="brand"
                      size="sm"
                      className="shrink-0 justify-start whitespace-nowrap text-left min-[768px]:w-full"
                    >
                      {cat.label}
                    </Tab>
                  ))}
                </TabList>
                <div className="min-w-0 flex-1 pt-[var(--space-4)] min-[768px]:pt-0">
                  {categories.map((cat) => (
                    <TabPanel key={cat.id} value={cat.id}>
                      {renderServiceGrid(cat.items)}
                    </TabPanel>
                  ))}
                </div>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
};

function renderServiceGrid(items: NavbarServiceCategory['items']) {
  return (
    <ul
      className={cn(BLOCK_GRID_BASE_CLASS, BLOCK_GRID_COL_CLASS[2], 'min-[1024px]:grid-cols-3')}
    >
      {items.map((item) => (
        <li key={item.href} className="min-w-0">
          <Link
            href={item.href}
            size="md"
            showRightIcon={false}
            className="flex flex-col items-start gap-[var(--space-2)] no-underline"
          >
            <span className="text-style-body-strong text-[var(--color-text-primary)]">
              {item.label}
            </span>
            {item.description ? (
              <span className="text-style-body-sm text-[var(--color-text-secondary)]">
                {item.description}
              </span>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}

NavbarServicesPanel.displayName = 'NavbarServicesPanel';
