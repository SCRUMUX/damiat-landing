export type AdminContentKind = 'case' | 'event';

export type AdminPublishStatus = 'draft' | 'published';

export type AdminEditorSectionId =
  | 'general'
  | 'navigation'
  | 'hero'
  | 'intro'
  | 'stats'
  | 'implemented'
  | 'sections'
  | 'event-card'
  | 'event-body'
  | 'publish';

export interface AdminAnchorItem {
  id: string;
  label: string;
}

export interface AdminHighlightPair {
  label: string;
  value: string;
}

export interface AdminStatPair {
  value: string;
  label: string;
}

export interface AdminNarrativeSection {
  id?: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  quoteText?: string;
  quoteAttribution?: string;
}

export interface AdminContentDraftBase {
  id: string;
  kind: AdminContentKind;
  title: string;
  status: AdminPublishStatus;
  updatedAt: string;
  slug: string;
  seoTitle: string;
  anchorNav: AdminAnchorItem[];
}

export interface AdminCaseDraft extends AdminContentDraftBase {
  kind: 'case';
  heroBreadcrumbs: string[];
  heroTitle: string;
  heroSubtitle?: string;
  leadParagraphs: string[];
  highlights: AdminHighlightPair[];
  trailParagraphs: string[];
  businessStats: AdminStatPair[];
  implementedIntro?: string;
  implementedItems: string[];
  narrativeSections: AdminNarrativeSection[];
}

export interface AdminEventDraft extends AdminContentDraftBase {
  kind: 'event';
  format: 'online' | 'offline' | 'hybrid';
  date: string;
  eventTitle: string;
  location?: string;
  href?: string;
  paragraphs: string[];
}

export type AdminContentDraft = AdminCaseDraft | AdminEventDraft;

export interface AdminUserRecord {
  id: string;
  organization: string;
  email: string;
  role: string;
  passwordStatus: 'active' | 'pending' | 'expired';
  lastLogin?: string;
}

export interface AdminPartnerRecord {
  id: string;
  name: string;
  imageSrc?: string;
  href?: string;
}
