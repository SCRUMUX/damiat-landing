export interface CaseStudyQuote {
  text: string;
  attribution: string;
  role?: string;
}

export interface CaseStudySection {
  id?: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  quote?: CaseStudyQuote;
}

export interface CaseStudySectionsBlockProps {
  sections: CaseStudySection[];
  /** Render content only — no SectionShell (inside CaseStudyArticle). */
  embedded?: boolean;
  className?: string;
}
