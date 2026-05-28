import type React from 'react';

export interface BlogPostItem {
  id?: string;
  title: string;
  excerpt: string;
  date: string;
  href?: string;
  imageSrc?: string;
  imageAlt?: string;
  /** Cover slot for Storybook render() — not CSF args. */
  cover?: React.ReactNode;
}

export interface BlogViewAllAction {
  label?: string;
  href: string;
}

export interface BlogBlockProps {
  title?: string;
  subtitle?: string;
  posts: BlogPostItem[];
  viewAll?: BlogViewAllAction;
  /** Desktop prev/next controls — default true. */
  showNavigation?: boolean;
  className?: string;
}
