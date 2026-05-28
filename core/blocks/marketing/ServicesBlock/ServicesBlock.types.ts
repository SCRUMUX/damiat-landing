import type React from 'react';

export interface ServiceItemAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  image?: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  action?: ServiceItemAction;
}

export interface ServiceCategory {
  id: string;
  label: string;
  items: ServiceItem[];
}

export interface ServicesBlockProps {
  title?: string;
  subtitle?: string;
  categories: ServiceCategory[];
  /** Cards revealed per page — default 3. */
  pageSize?: number;
  showMoreLabel?: string;
  /** Pin section title + tabs while scrolling — default true. */
  stickyHeader?: boolean;
  className?: string;
}
