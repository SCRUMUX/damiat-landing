import type React from 'react';

export interface SupportStatItem {
  id?: string;
  value: string;
  label: string;
  imageSrc?: string;
  imageAlt?: string;
  /** Cover slot for Storybook render() — not CSF args. */
  cover?: React.ReactNode;
}

export interface SupportContactItem {
  id?: string;
  label: string;
  value: string;
  href: string;
  icon?: React.ReactNode;
}

export interface SupportBlockProps {
  titleLine1?: string;
  titleLine2?: string;
  /** Brand-accent phrase appended on the second title line (Cortel-style). */
  titleAccent?: string;
  description: string;
  /** Three stats: [featured compact, side A, side B] on desktop. */
  stats: SupportStatItem[];
  /** Combined mobile hero image (optional — falls back to first stat image). */
  mobileImageSrc?: string;
  mobileImageAlt?: string;
  mobileCover?: React.ReactNode;
  contacts: SupportContactItem[];
  className?: string;
}
