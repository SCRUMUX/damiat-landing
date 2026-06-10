import type React from 'react';

export type ChooseUsCardSize = 'wide' | 'narrow';

export interface ChooseUsCardItem {
  id?: string;
  title: string;
  description: string;
  /** Cortel desktop mosaic — first two cards are wide, next three are narrow. */
  size: ChooseUsCardSize;
  icon?: React.ReactNode;
}

export interface ChooseUsFeaturedItem {
  title: string;
  titleBreakBefore?: string;
  description: string;
  media?: React.ReactNode;
  imageSrc?: string;
  imageSrcMobile?: string;
  imageAlt?: string;
}

export interface ChooseUsBlockProps {
  title?: string;
  /** Substring rendered in brand color (Cortel «нас выбирают» accent). */
  titleAccent?: string;
  /** Optional section title weight / typography override. */
  titleClassName?: string;
  /** Optional card title weight / typography override. */
  cardTitleClassName?: string;
  /** Featured panel — vertical alignment of copy (default: bottom, Cortel). */
  featuredContentAlign?: 'top' | 'bottom';
  /** Optional featured title typography override. */
  featuredTitleClassName?: string;
  cards: ChooseUsCardItem[];
  featured: ChooseUsFeaturedItem;
  className?: string;
}
