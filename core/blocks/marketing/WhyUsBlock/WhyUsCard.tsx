import React from 'react';
import { cn } from '../../../components/primitives/_shared';
import {
  WHY_US_CARD_BODY_CLASS,
  WHY_US_CARD_CLASS,
  WHY_US_CARD_DESCRIPTION_CLASS,
  WHY_US_CARD_ICON_SLOT_CLASS,
} from '../../_shared/blockLayout';
import type { WhyUsCardItem } from './WhyUsBlock.types';

export interface WhyUsCardProps extends WhyUsCardItem {
  className?: string;
}

export const WhyUsCard: React.FC<WhyUsCardProps> = ({ title, description, icon, className }) => (
  <article className={cn(WHY_US_CARD_CLASS, className)}>
    <div className={WHY_US_CARD_BODY_CLASS}>
      <div className="font-medium text-style-h4 text-[var(--color-text-primary)] min-[1024px]:text-style-body-lg">
        {title}
      </div>
      <p className={WHY_US_CARD_DESCRIPTION_CLASS}>{description}</p>
    </div>
    {icon ? <div className={WHY_US_CARD_ICON_SLOT_CLASS}>{icon}</div> : null}
  </article>
);

WhyUsCard.displayName = 'WhyUsCard';
