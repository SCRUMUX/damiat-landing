import React from 'react';
import { cn } from '../../../components/primitives/_shared';
import {
  CASE_STUDY_ANCHOR_LINK_ACTIVE_CLASS,
  CASE_STUDY_ANCHOR_LINK_CLASS,
  CASE_STUDY_ANCHOR_LIST_CLASS,
  CASE_STUDY_ANCHOR_NAV_STICKY_CLASS,
} from '../../_shared/blockLayout';
import type { CaseStudyAnchorNavProps } from './CaseStudyAnchorNav.types';

export type { CaseStudyAnchorNavProps, CaseStudyAnchorItem } from './CaseStudyAnchorNav.types';

function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export const CaseStudyAnchorNav: React.FC<CaseStudyAnchorNavProps> = ({
  items,
  activeId,
  className,
  onNavigate,
}) => (
  <nav
    className={cn(CASE_STUDY_ANCHOR_NAV_STICKY_CLASS, className)}
    aria-label="Case study sections"
  >
    <ul className={CASE_STUDY_ANCHOR_LIST_CLASS}>
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={active ? CASE_STUDY_ANCHOR_LINK_ACTIVE_CLASS : CASE_STUDY_ANCHOR_LINK_CLASS}
              aria-current={active ? 'true' : undefined}
              onClick={(event) => {
                event.preventDefault();
                scrollToSection(item.id);
                onNavigate?.(item.id);
              }}
            >
              {item.label}
            </a>
          </li>
        );
      })}
    </ul>
  </nav>
);

CaseStudyAnchorNav.displayName = 'CaseStudyAnchorNav';
