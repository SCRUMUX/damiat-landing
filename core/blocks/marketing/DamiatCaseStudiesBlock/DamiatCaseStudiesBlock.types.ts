import type React from 'react';

export interface CaseStudyStat {
  value: string;
  label: string;
}

export interface CaseStudyItem {
  id?: string;
  title: string;
  /** Region, year, stored volume — shown in card header. */
  meta: string;
  stats: CaseStudyStat[];
  href?: string;
  imageSrc?: string;
  imageAlt?: string;
  /** Per-card satellite crop anchor. */
  imageObjectPosition?: string;
  /** Optional cover slot — Storybook render(). */
  cover?: React.ReactNode;
}

export interface CaseStudiesViewAllAction {
  label?: string;
  href: string;
}

export interface DamiatCaseStudiesBlockProps {
  title?: string;
  subtitle?: string;
  cases: CaseStudyItem[];
  viewAll?: CaseStudiesViewAllAction;
  showNavigation?: boolean;
  /** Light-on-photo section shell (case band inside BrandPhotoHeroSection). */
  embeddedInPhotoHero?: boolean;
  className?: string;
}
