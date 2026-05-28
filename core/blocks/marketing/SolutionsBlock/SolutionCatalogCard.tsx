import React from 'react';
import { cn } from '../../../components/primitives/_shared';
import {
  SOLUTIONS_CATALOG_ARROW_CLASS,
  SOLUTIONS_CATALOG_CARD_LINK_CLASS,
  SOLUTIONS_CATALOG_CARD_SHELL_CLASS,
  SOLUTIONS_CATALOG_DESCRIPTION_CLASS,
  SOLUTIONS_CATALOG_HEADER_ROW_CLASS,
  SOLUTIONS_CATALOG_ICON_CLASS,
  SOLUTIONS_CATALOG_TITLE_CLASS,
} from '../../_shared/blockLayout';
import { ArrowUpRightIcon } from './SolutionsBlockIcons';
import type { SolutionCatalogItem } from './SolutionsBlock.types';

export interface SolutionCatalogCardProps extends SolutionCatalogItem {
  className?: string;
}

export const SolutionCatalogCard: React.FC<SolutionCatalogCardProps> = ({
  title,
  description,
  href,
  icon,
  className,
}) => {
  const content = (
    <>
      <div className={SOLUTIONS_CATALOG_HEADER_ROW_CLASS}>
        {icon ? <div className={SOLUTIONS_CATALOG_ICON_CLASS}>{icon}</div> : null}
        <h3 className={SOLUTIONS_CATALOG_TITLE_CLASS}>{title}</h3>
      </div>
      <p className={SOLUTIONS_CATALOG_DESCRIPTION_CLASS}>{description}</p>
      <span className={SOLUTIONS_CATALOG_ARROW_CLASS} aria-hidden="true">
        <ArrowUpRightIcon className="h-[var(--space-16)] w-[var(--space-16)] min-[1024px]:h-[var(--space-18)] min-[1024px]:w-[var(--space-18)]" />
      </span>
    </>
  );

  return (
    <li className={cn(SOLUTIONS_CATALOG_CARD_SHELL_CLASS, className)}>
      {href ? (
        <a href={href} className={SOLUTIONS_CATALOG_CARD_LINK_CLASS}>
          {content}
        </a>
      ) : (
        <div className={SOLUTIONS_CATALOG_CARD_LINK_CLASS}>{content}</div>
      )}
    </li>
  );
};

SolutionCatalogCard.displayName = 'SolutionCatalogCard';
