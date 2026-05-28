import React from 'react';
import { SectionShell } from '../../_shared/SectionShell';
import {
  WHY_US_ROW_BOTTOM_CLASS,
  WHY_US_ROW_TOP_CLASS,
  WHY_US_TITLE_CLASS,
} from '../../_shared/blockLayout';
import { cn } from '../../../components/primitives/_shared';
import { WhyUsCard } from './WhyUsCard';
import { WhyUsFeaturedCard } from './WhyUsFeaturedCard';
import type { WhyUsBlockProps } from './WhyUsBlock.types';

export type { WhyUsBlockProps, WhyUsCardItem, WhyUsFeaturedItem } from './WhyUsBlock.types';

function WhyUsTitle({
  title,
  titleBreakBefore,
}: Pick<WhyUsBlockProps, 'title' | 'titleBreakBefore'>) {
  if (!titleBreakBefore || !title?.includes(titleBreakBefore)) {
    return <h2 className={WHY_US_TITLE_CLASS}>{title}</h2>;
  }

  const [before, after] = title.split(titleBreakBefore);

  return (
    <h2 className={WHY_US_TITLE_CLASS}>
      {before}
      <br className="min-[1024px]:hidden" />
      {titleBreakBefore}
      {after}
    </h2>
  );
}

export const WhyUsBlock: React.FC<WhyUsBlockProps> = ({
  title = 'Почему с AICADS работают продуктовые команды',
  titleBreakBefore = ' продуктовые команды',
  primaryCards,
  secondaryCards,
  featured,
  className,
}) => {
  if (primaryCards.length === 0 && secondaryCards.length === 0) return null;

  return (
    <SectionShell
      recipe="section.why-us"
      appearance="muted"
      className={cn(
        'bg-[var(--color-surface-2)] min-[1024px]:bg-[var(--color-bg-base)]',
        '!py-[var(--space-64)] min-[1024px]:!py-[var(--space-80)]',
        className,
      )}
      aria-label="Why us"
    >
      <WhyUsTitle title={title} titleBreakBefore={titleBreakBefore} />

      <div className={WHY_US_ROW_TOP_CLASS}>
        {primaryCards.map((card) => (
          <WhyUsCard key={card.id ?? card.title} {...card} />
        ))}
        <WhyUsFeaturedCard {...featured} className="max-lg:hidden" />
      </div>

      <div className={WHY_US_ROW_BOTTOM_CLASS}>
        {secondaryCards.map((card) => (
          <WhyUsCard key={card.id ?? card.title} {...card} />
        ))}
        <WhyUsFeaturedCard {...featured} className="min-[1024px]:hidden" />
      </div>
    </SectionShell>
  );
};

WhyUsBlock.displayName = 'WhyUsBlock';
