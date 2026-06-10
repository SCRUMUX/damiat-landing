export interface CaseStudyAnchorItem {
  id: string;
  label: string;
}

export interface CaseStudyAnchorNavProps {
  items: CaseStudyAnchorItem[];
  activeId?: string;
  className?: string;
  onNavigate?: (id: string) => void;
}
