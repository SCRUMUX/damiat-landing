import React from 'react';
import { cn } from '../../../components/primitives/_shared';
import {
  WHY_US_CARD_BODY_CLASS,
  WHY_US_CARD_CLASS,
  WHY_US_CARD_DESCRIPTION_CLASS,
  WHY_US_CARD_ICON_SLOT_CLASS,
  WHY_US_CARD_TITLE_CLASS,
} from '../../_shared/blockLayout';
import type { WhyUsCardItem } from './WhyUsBlock.types';

export interface WhyUsCardProps extends WhyUsCardItem {
  className?: string;
  titleClassName?: string;
}

export const WhyUsCard: React.FC<WhyUsCardProps> = ({
  title,
  description,
  icon,
  className,
  titleClassName,
}) => (
  <article className={cn(WHY_US_CARD_CLASS, className)}>
    <div className={WHY_US_CARD_BODY_CLASS}>
      <h3 className={cn(WHY_US_CARD_TITLE_CLASS, titleClassName)}>{title}</h3>
      <p className={WHY_US_CARD_DESCRIPTION_CLASS}>{description}</p>
    </div>
    {icon ? (
      <div className={WHY_US_CARD_ICON_SLOT_CLASS}>
        <div className="flex h-full w-full items-end justify-end">{icon}</div>
      </div>
    ) : null}
  </article>
);

WhyUsCard.displayName = 'WhyUsCard';
