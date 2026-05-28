import type React from 'react';

export interface SolutionItem {
  id?: string;
  /** Industry / vertical label — e.g. «Retail», «Энергетика». */
  category: string;
  categoryIcon?: React.ReactNode;
  title: string;
  /** Plain description — hidden on desktop hover when image reveals. */
  description?: string;
  /** Metric highlights — alternative body (also hidden on hover). */
  highlights?: string[];
  client: string;
  date: string;
  href?: string;
  imageSrc?: string;
  imageAlt?: string;
  /** Cover media slot — use in render(), not Storybook args. */
  cover?: React.ReactNode;
}

export interface SolutionCatalogItem {
  id?: string;
  title: string;
  description: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface SolutionsViewAllAction {
  label?: string;
  href: string;
}

interface SolutionsShowcaseBlockProps {
  variant?: 'showcase';
  title?: string;
  subtitle?: string;
  solutions: SolutionItem[];
  /** Desktop mosaic grid shows this many cards — default 6 (2 rows). */
  desktopVisibleCount?: number;
  viewAll?: SolutionsViewAllAction;
  className?: string;
}

interface SolutionsCatalogBlockProps {
  variant: 'catalog';
  /** Catalog page omits section title — hero carries «Решения» heading. */
  items: SolutionCatalogItem[];
  className?: string;
}

export type SolutionsBlockProps = SolutionsShowcaseBlockProps | SolutionsCatalogBlockProps;
