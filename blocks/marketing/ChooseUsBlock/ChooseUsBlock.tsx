import React from 'react';
import { SectionShell } from '../../_shared/SectionShell';
import {
  CHOOSE_US_BODY_CLASS,
  CHOOSE_US_CARD_LIST_CLASS,
  CHOOSE_US_TITLE_CLASS,
} from '../../_shared/blockLayout';
import { cn } from '../../../components/primitives/_shared';
import { ChooseUsCard } from './ChooseUsCard';
import { ChooseUsFeaturedCard } from './ChooseUsFeaturedCard';
import type { ChooseUsBlockProps } from './ChooseUsBlock.types';

export type {
  ChooseUsBlockProps,
  ChooseUsCardItem,
  ChooseUsFeaturedItem,
  ChooseUsCardSize,
} from './ChooseUsBlock.types';

function ChooseUsTitle({
  title,
  titleAccent,
  titleClassName,
}: Pick<ChooseUsBlockProps, 'title' | 'titleAccent' | 'titleClassName'>) {
  if (!titleAccent || !title?.includes(titleAccent)) {
    return <h2 className={cn(CHOOSE_US_TITLE_CLASS, titleClassName)}>{title}</h2>;
  }

  const [before, after] = title.split(titleAccent);

  return (
    <h2 className={cn(CHOOSE_US_TITLE_CLASS, titleClassName)}>
      {before}
      <span className="text-[var(--color-brand-primary)]">{titleAccent}</span>
      {after}
    </h2>
  );
}

export const ChooseUsBlock: React.FC<ChooseUsBlockProps> = ({
  title = 'Почему нас выбирают',
  titleAccent = 'нас выбирают',
  titleClassName,
  cardTitleClassName,
  featuredContentAlign = 'bottom',
  featuredTitleClassName,
  cards,
  featured,
  className,
}) => {
  if (cards.length === 0) return null;

  return (
    <SectionShell
      recipe="section.choose-us"
      appearance="muted"
      className={cn(
        'bg-[var(--color-surface-2)]',
        '[--choose-us-pt:var(--space-80)] [--choose-us-pb:var(--space-64)]',
        'desktop:[--choose-us-pt:var(--space-112)] desktop:[--choose-us-pb:var(--space-80)]',
        className,
      )}
      style={{
        paddingTop: 'var(--choose-us-pt)',
        paddingBottom: 'var(--choose-us-pb)',
      }}
      aria-label="Why choose us"
    >
      <ChooseUsTitle title={title} titleAccent={titleAccent} titleClassName={titleClassName} />

      <div className={CHOOSE_US_BODY_CLASS}>
        <ul className={CHOOSE_US_CARD_LIST_CLASS}>
          {cards.map((card) => (
            <ChooseUsCard
              key={card.id ?? card.title}
              {...card}
              titleClassName={cardTitleClassName}
            />
          ))}
        </ul>
        <ChooseUsFeaturedCard
          {...featured}
          contentAlign={featuredContentAlign}
          titleClassName={featuredTitleClassName}
        />
      </div>
    </SectionShell>
  );
};

ChooseUsBlock.displayName = 'ChooseUsBlock';
