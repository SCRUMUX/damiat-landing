import type React from 'react';

export interface WhyUsCardItem {
  id?: string;
  title: string;
  description: string;
  /** Optional illustration or icon slot — bottom-right of the card (Cortel self-end area). */
  icon?: React.ReactNode;
}

export interface WhyUsFeaturedItem {
  title: string;
  /** Line break anchor for responsive title wrapping (Cortel `<br/>`). */
  titleBreakBefore?: string;
  description: string;
  media?: React.ReactNode;
  videoSrc?: string;
  videoPoster?: string;
  /** Brand-primary shell (on-brand text). Default for DAMIAT featured panels. */
  variant?: 'primary' | 'neutral';
}

export interface WhyUsBlockProps {
  title?: string;
  titleBreakBefore?: string;
  /** Optional override for card title weight / typography (e.g. DAMIAT device intro). */
  cardTitleClassName?: string;
  /** First desktop row — two text cards left of featured media. */
  primaryCards: WhyUsCardItem[];
  /** Second desktop row — three text cards; featured media follows on mobile. */
  secondaryCards: WhyUsCardItem[];
  featured: WhyUsFeaturedItem;
  className?: string;
}
