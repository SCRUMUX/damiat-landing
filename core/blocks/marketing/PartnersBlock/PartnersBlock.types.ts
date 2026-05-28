import type React from 'react';

export interface PartnerItem {
  id?: string;
  name: string;
  href?: string;
  imageSrc?: string;
  imageAlt?: string;
  /** Logo slot for Storybook render() — not CSF args. */
  logo?: React.ReactNode;
}

export interface PartnersBlockProps {
  title?: string;
  partners: PartnerItem[];
  /** Marquee speed in px/s — Cortel default 80. */
  speed?: number;
  className?: string;
}
