import React, { useState } from 'react';
import { SectionShell } from '../../_shared/SectionShell';
import {
  SHOWCASE_PANEL_ACCORDION_COLUMN_CLASS,
  SHOWCASE_PANEL_FRAME_CLASS,
  SHOWCASE_PANEL_PREVIEW_COLUMN_CLASS,
} from '../../_shared/blockLayout';
import { cn } from '../../../components/primitives/_shared';
import { ShowcasePanelAccordion, ShowcasePanelPreview } from './ShowcasePanelAccordion';
import type { ShowcasePanelBlockProps } from './ShowcasePanelBlock.types';

export type { ShowcasePanelBlockProps, ShowcasePanelItem, ShowcasePanelAction } from './ShowcasePanelBlock.types';

function ShowcasePanelTitle({
  title,
  titleBreakBefore,
  onBrand = false,
}: Pick<ShowcasePanelBlockProps, 'title' | 'titleBreakBefore'> & { onBrand?: boolean }) {
  const titleClass = cn(
    'm-0 font-medium text-style-h1',
    onBrand ? 'text-[var(--color-text-on-brand)]' : 'text-[var(--color-text-primary)]',
  );

  if (!titleBreakBefore || !title.includes(titleBreakBefore)) {
    return <h2 className={cn(titleClass, 'min-[1024px]:max-w-[var(--space-640)]')}>{title}</h2>;
  }

  const [before, after] = title.split(titleBreakBefore);

  return (
    <h2 className={cn(titleClass, 'min-[1024px]:max-w-[var(--space-640)]')}>
      {before}
      <br className="min-[1024px]:hidden" />
      {titleBreakBefore}
      {after}
    </h2>
  );
}

export const ShowcasePanelBlock: React.FC<ShowcasePanelBlockProps> = ({
  title = 'Удобно управлять всеми primitives и blocks в одном Storybook',
  titleBreakBefore = ' в одном Storybook',
  panels,
  parallax = 'section',
  className,
}) => {
  const defaultPanel = panels[0]?.id ?? '';
  const [activeId, setActiveId] = useState(defaultPanel);

  if (panels.length === 0) return null;

  const resolvedActive = panels.some((panel) => panel.id === activeId) ? activeId : defaultPanel;

  const handlePanelChange = (nextValue: string) => {
    setActiveId(nextValue || defaultPanel);
  };

  return (
    <SectionShell
      recipe="section.showcase-panel"
      appearance="brand"
      parallax={parallax || false}
      className={className}
      aria-label="Showcase panel"
    >
      <ShowcasePanelTitle title={title} titleBreakBefore={titleBreakBefore} onBrand />

      <div className={SHOWCASE_PANEL_FRAME_CLASS}>
        <div className={SHOWCASE_PANEL_ACCORDION_COLUMN_CLASS}>
          <ShowcasePanelAccordion
            panels={panels}
            value={resolvedActive}
            onValueChange={handlePanelChange}
          />
        </div>
        <div className={SHOWCASE_PANEL_PREVIEW_COLUMN_CLASS}>
          <ShowcasePanelPreview panels={panels} activeId={resolvedActive} />
        </div>
      </div>
    </SectionShell>
  );
};

ShowcasePanelBlock.displayName = 'ShowcasePanelBlock';
