import React from 'react';
import { cn } from '../../../components/primitives/_shared';
import { useScrollSpy } from '../../../hooks/useScrollSpy';
import {
  CASE_STUDY_ARTICLE_CONTENT_STACK_CLASS,
  CASE_STUDY_ARTICLE_SPLIT_CLASS,
} from '../../_shared/blockLayout';
import { CaseStudyAnchorNav, type CaseStudyAnchorNavProps } from '../CaseStudyAnchorNav';

export interface CaseStudyArticleSplitProps {
  nav: Pick<CaseStudyAnchorNavProps, 'items'>;
  children: React.ReactNode;
  className?: string;
}

export const CaseStudyArticleSplit: React.FC<CaseStudyArticleSplitProps> = ({
  nav,
  children,
  className,
}) => {
  const sectionIds = (nav.items ?? []).map((item) => item.id);
  const activeId = useScrollSpy(sectionIds);

  return (
    <div className={cn(CASE_STUDY_ARTICLE_SPLIT_CLASS, className)}>
      <CaseStudyAnchorNav items={nav.items} activeId={activeId} />
      <div className={CASE_STUDY_ARTICLE_CONTENT_STACK_CLASS}>{children}</div>
    </div>
  );
};

CaseStudyArticleSplit.displayName = 'CaseStudyArticleSplit';
