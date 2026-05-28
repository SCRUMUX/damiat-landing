import type React from 'react';

export interface TrustPillarItem {
  id?: string;
  title: string;
  description: string;
  /** First pillar — brand card with cover media. */
  featured?: boolean;
  imageSrc?: string;
  imageAlt?: string;
  /** Cover slot for Storybook render() — not CSF args. */
  cover?: React.ReactNode;
}

export interface TrustStandardItem {
  id?: string;
  title: string;
  description: string;
  href?: string;
}

export interface TrustBlockProps {
  title?: string;
  pillars: TrustPillarItem[];
  standardsTitle?: string;
  standards: TrustStandardItem[];
  className?: string;
}
