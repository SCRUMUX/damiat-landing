export interface CaseStudyHighlight {
  label: string;
  value: string;
}

export interface CaseStudyIntroBlockProps {
  /** Opening paragraphs before highlight metrics. */
  leadParagraphs?: string[];
  /** @deprecated Use leadParagraphs + trailParagraphs */
  paragraphs?: string[];
  highlights?: CaseStudyHighlight[];
  /** Closing context after highlight metrics. */
  trailParagraphs?: string[];
  /** Render content only — no SectionShell (inside CaseStudyArticle). */
  embedded?: boolean;
  className?: string;
}
