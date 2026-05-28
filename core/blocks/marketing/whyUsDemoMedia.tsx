import React from 'react';
import { WHY_US_DEMO_ICONS } from './WhyUsBlock/WhyUsBlockIcons';
import type { WhyUsBlockProps, WhyUsCardItem } from './WhyUsBlock';

function attachCardIcon(card: WhyUsCardItem): WhyUsCardItem {
  if (card.icon || !card.id) return card;

  const icon = WHY_US_DEMO_ICONS[card.id as keyof typeof WHY_US_DEMO_ICONS];
  return icon ? { ...card, icon } : card;
}

/** Attach mock SVG illustrations to WhyUs demo cards by `id`. */
export function withWhyUsDemoIcons<T extends Pick<WhyUsBlockProps, 'primaryCards' | 'secondaryCards'>>(
  content: T,
): T {
  return {
    ...content,
    primaryCards: content.primaryCards.map(attachCardIcon),
    secondaryCards: content.secondaryCards.map(attachCardIcon),
  };
}
