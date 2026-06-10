export interface CaseStudyInlineStat {
  value: string;
  label: string;
}

export interface CaseStudyInlineStatsBlockProps {
  title?: string;
  stats: CaseStudyInlineStat[];
  sectionId?: string;
  className?: string;
}
