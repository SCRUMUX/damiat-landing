import React from 'react';
import { cn } from '../../../components/primitives/_shared';
import {
  CHOOSE_US_CARD_CLASS,
  CHOOSE_US_CARD_BODY_CLASS,
  CHOOSE_US_CARD_DESCRIPTION_CLASS,
  CHOOSE_US_CARD_ICON_SLOT_CLASS,
  CHOOSE_US_CARD_TITLE_CLASS,
  CHOOSE_US_CARD_WIDE_CLASS,
  CHOOSE_US_CARD_NARROW_CLASS,
} from '../../_shared/blockLayout';
import type { ChooseUsCardItem } from './ChooseUsBlock.types';

export interface ChooseUsCardProps extends ChooseUsCardItem {
  className?: string;
  titleClassName?: string;
}

export const ChooseUsCard: React.FC<ChooseUsCardProps> = ({
  title,
  description,
  size,
  icon,
  className,
  titleClassName,
}) => (
  <li
    className={cn(
      CHOOSE_US_CARD_CLASS,
      size === 'wide' ? CHOOSE_US_CARD_WIDE_CLASS : CHOOSE_US_CARD_NARROW_CLASS,
      className,
    )}
  >
    <div className={CHOOSE_US_CARD_BODY_CLASS}>
      <h3 className={cn(CHOOSE_US_CARD_TITLE_CLASS, titleClassName)}>{title}</h3>
      <p className={CHOOSE_US_CARD_DESCRIPTION_CLASS}>{description}</p>
    </div>
    {icon ? <div className={CHOOSE_US_CARD_ICON_SLOT_CLASS}>{icon}</div> : null}
  </li>
);

ChooseUsCard.displayName = 'ChooseUsCard';
