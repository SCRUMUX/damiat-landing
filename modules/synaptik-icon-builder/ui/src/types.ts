export interface Card {
  id: string;
  title: string;
  description?: string;
  blockId?: string;
  blockTitle?: string;
  sourcePageUrl?: string;
  sourcePageTitle?: string;
  skipped?: boolean;
}

export interface ContentBlock {
  id: string;
  title: string;
  description?: string;
  cards: Array<{
    id?: string;
    title: string;
    description?: string;
    sourceRegion?: string;
    skipped?: boolean;
  }>;
  skipped?: boolean;
  sourcePageUrl?: string;
  sourcePageTitle?: string;
  sortOrder?: number;
}

export interface SessionPageEntry {
  url: string;
  pageSlug: string;
  capturedAt: string;
  pageTitle?: string;
}

export interface SessionSummary {
  sessionId: string;
  projectSlug: string;
  sourceUrl?: string;
  createdAt: string;
  styleLabel?: string;
  cardCount: number;
  renderedCount: number;
}

export type CatalogStatus = 'none' | 'current' | 'outdated';

export interface IconStatusEntry {
  previewUrl: string;
  publishedUrl?: string;
  conceptId?: string;
  promptHash?: string;
  iconSetStyleId?: string;
  renderedAt?: string;
  publishedAt?: string;
  publishedConceptId?: string;
  publishedPromptHash?: string;
  catalogStatus: CatalogStatus;
  failedQa?: boolean;
  qualityWarnings?: string[];
}

export interface StructureAuditSummary {
  warnings: string[];
  duplicateBlockIds: string[];
  duplicateCardIds: string[];
  emptyBlocks: string[];
  blockCount: number;
  cardCount: number;
}

export interface SessionState {
  sessionId: string;
  sourceUrl?: string;
  dna: Record<string, unknown>;
  cards: Card[];
  selections: Array<{ cardId: string; conceptId: string }>;
  conceptCardIds: string[];
  previews: Record<string, { previewUrl: string }>;
  iconStatus?: Record<string, IconStatusEntry>;
  renderMeta?: Record<
    string,
    { failedQa?: boolean; qualityWarnings?: string[] }
  >;
  publishedCardIds: string[];
  pages?: SessionPageEntry[];
  blocks?: ContentBlock[];
  iconStyleBlock?: string;
  iconSetStyleId?: string;
  iconSetStyleLabel?: string;
  progress: { step: number; analyzed: boolean };
  structureAudit?: StructureAuditSummary;
}

export interface IconSetStyleOption {
  id: string;
  labelRu: string;
  labelEn: string;
}

export interface Concept {
  id: string;
  label: string;
  visualObject?: string;
  iconSubject?: string;
  renderStyle?: string;
  description?: string;
}

export interface ConceptSet {
  cardId: string;
  cardTitle: string;
  iconSubject?: string;
  concepts: Concept[];
}

export interface RegistryIcon {
  projectSlug: string;
  iconSlug: string;
  name: string;
}

export type CardPhase = 'pick' | 'rendered' | 'published';

export interface CardUiState {
  phase: CardPhase;
  previewSrc?: string;
  publishedSrc?: string;
  /** Concept id used for the current previewSrc (A/B/C). */
  renderedConceptId?: string;
  /** Shown after user changed metaphor or style without regenerating. */
  previewStale?: boolean;
  previewStaleReason?: 'concept' | 'style';
  failedQa?: boolean;
  qualityWarnings?: string[];
  needsRepublish?: boolean;
  catalogStatus?: CatalogStatus;
}
