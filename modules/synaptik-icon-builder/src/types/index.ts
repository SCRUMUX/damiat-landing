import { z } from 'zod';
import { IconSetStyleIdSchema } from '../icon-set-styles/index.js';

export { IconSetStyleIdSchema };
export type { IconSetStyleId } from '../icon-set-styles/index.js';

export const StyleDNASchema = z.object({
  projectSlug: z.string().min(1),
  industry: z.string().min(1),
  rendering: z.string(),
  materials: z.array(z.string()),
  palette: z.array(z.string()),
  lighting: z.string(),
  background: z.string(),
  brandCharacter: z.string().optional(),
  styleLabel: z.string().optional(),
  /** Site-only visual description; never copied into icon Flux prompts. */
  siteVisualStyle: z.string().optional(),
  createdAt: z.string().datetime(),
});

export type StyleDNA = z.infer<typeof StyleDNASchema>;

export const DomStructureCardSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
});

export const DomStructureBlockSchema = z.object({
  title: z.string(),
  cards: z.array(DomStructureCardSchema),
});

export const DomStructureSchema = z.object({
  blocks: z.array(DomStructureBlockSchema),
});

export type DomStructure = z.infer<typeof DomStructureSchema>;

export const ContentCardSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  sourceRegion: z.string().optional(),
  blockId: z.string().optional(),
  blockTitle: z.string().optional(),
  sourcePageUrl: z.string().optional(),
  sourcePageTitle: z.string().optional(),
  skipped: z.boolean().optional(),
});

export const BlockCardDraftSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  sourceRegion: z.string().optional(),
  skipped: z.boolean().optional(),
});

export const ContentBlockSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  cards: z.array(BlockCardDraftSchema),
  sourcePageUrl: z.string().optional(),
  sourcePageTitle: z.string().optional(),
  sortOrder: z.number().int().optional(),
  skipped: z.boolean().optional(),
});

export const ContentStructureFileSchema = z.object({
  blocks: z.array(ContentBlockSchema),
  maxBlocks: z.number().optional(),
  maxCardsPerBlock: z.number().optional(),
  generatedAt: z.string().datetime().optional(),
});

export type ContentBlock = z.infer<typeof ContentBlockSchema>;

export const ContentCardsFileSchema = z.object({
  cards: z.array(ContentCardSchema),
  maxCards: z.number().optional(),
  generatedAt: z.string().datetime().optional(),
});

export type ContentCard = z.infer<typeof ContentCardSchema>;

export const ConceptLetterSchema = z.enum(['A', 'B', 'C', 'D', 'E']);
export type ConceptLetter = z.infer<typeof ConceptLetterSchema>;

export const IconConceptSchema = z.object({
  id: ConceptLetterSchema,
  /** Short metaphor name shown in UI, e.g. Sprout, Gauge, Shield. */
  label: z.string(),
  /** English concrete object for Flux — no preset prefix. */
  visualObject: z.string().optional(),
  /** Legacy: prefixed display string; use visualObject for render. */
  iconSubject: z.string().optional(),
  /** Legacy render-style field; not sent to Flux. */
  renderStyle: z.string().optional(),
  description: z.string().optional(),
});

export const IconConceptSetSchema = z.object({
  cardId: z.string(),
  cardTitle: z.string(),
  /** Legacy: shared subject before per-concept iconSubject. */
  iconSubject: z.string().optional(),
  concepts: z.array(IconConceptSchema).min(1).max(5),
  generatedAt: z.string().datetime().optional(),
});

export type IconConceptSet = z.infer<typeof IconConceptSetSchema>;

export const SelectionEntrySchema = z.object({
  cardId: z.string(),
  conceptId: ConceptLetterSchema,
  realismOverride: z.string().optional(),
  descriptionOverride: z.string().optional(),
});

export const SelectionsFileSchema = z.object({
  selections: z.array(SelectionEntrySchema),
});

export const IconQualityWarningSchema = z.enum([
  'non_white_edges',
  'possible_text',
  'cropped_edges',
  'grainy_border',
]);

export type IconQualityWarning = z.infer<typeof IconQualityWarningSchema>;

export const AssetMetaSchema = z.object({
  name: z.string(),
  category: z.string(),
  style: z.string(),
  createdBy: z.string().default('AI Icon Builder'),
  conceptId: z.string().optional(),
  sourceCard: z.string().optional(),
  promptHash: z.string().optional(),
  iconSetStyleId: IconSetStyleIdSchema.optional(),
  sessionId: z.string().optional(),
  cardId: z.string().optional(),
  blockId: z.string().optional(),
  blockTitle: z.string().optional(),
  iconSlug: z.string().optional(),
  publishedAt: z.string().datetime().optional(),
  falSeed: z.number().int().optional(),
  failedQa: z.boolean().optional(),
  qualityWarnings: z.array(IconQualityWarningSchema).optional(),
});

export type AssetMeta = z.output<typeof AssetMetaSchema>;

export const IconStyleBibleSchema = z.object({
  iconSetStyleId: IconSetStyleIdSchema,
  presetVersion: z.literal(1).default(1),
  /** Multiline Flux style contract for the whole session. */
  styleBlock: z.string(),
  forbiddenStyles: z.array(z.string()),
  styleAnchor: z.string().optional(),
  aesthetic: z.string().optional(),
  materialsLine: z.string().optional(),
  paletteLine: z.string().optional(),
  renderMode: z.string().optional(),
  paletteForIcons: z.array(z.string()).optional(),
  materialsAllowed: z.array(z.string()).optional(),
  materialsForbidden: z.array(z.string()).optional(),
  /** @deprecated Legacy fields — used only for migrateLegacyBible */
  globalRenderRules: z.string().optional(),
  lightingForIcons: z.string().optional(),
  compositionRules: z.string().optional(),
  promptPrefix: z.string().optional(),
  promptSuffix: z.string().optional(),
  generatedAt: z.string().datetime(),
});

export type IconStyleBible = z.infer<typeof IconStyleBibleSchema>;

export const CaptureReportSchema = z.object({
  sourceUrl: z.string().optional(),
  screenshotsDir: z.string(),
  capturedAt: z.string().datetime(),
  dominantColors: z.array(z.string()).optional(),
  fontFamilies: z.array(z.string()).optional(),
  viewport: z.object({ width: z.number(), height: z.number() }).optional(),
  pageTitle: z.string().optional(),
  extractedTextSample: z.string().optional(),
  paletteFromImage: z.array(z.string()).optional(),
  domStructure: DomStructureSchema.optional(),
});

export type CaptureReport = z.infer<typeof CaptureReportSchema>;

export const SessionPageEntrySchema = z.object({
  url: z.string(),
  pageSlug: z.string(),
  capturedAt: z.string().datetime(),
  pageTitle: z.string().optional(),
});

export type SessionPageEntry = z.infer<typeof SessionPageEntrySchema>;

export const SessionManifestSchema = z.object({
  sessionId: z.string(),
  createdAt: z.string().datetime(),
  sourceUrl: z.string().optional(),
  screenshotsPath: z.string().optional(),
  projectSlug: z.string().optional(),
  iconSetStyleId: IconSetStyleIdSchema.optional(),
  pages: z.array(SessionPageEntrySchema).optional(),
});

export type SessionManifest = z.infer<typeof SessionManifestSchema>;

export const RegistrySchema = z.object({
  version: z.literal(1),
  icons: z.array(
    z.object({
      projectSlug: z.string(),
      iconSlug: z.string(),
      name: z.string(),
      category: z.string(),
      style: z.string(),
      styleLabel: z.string().optional(),
      relativePath: z.string(),
    }),
  ),
});

export type IconRegistry = z.infer<typeof RegistrySchema>;

export const MVP_DEFAULTS = {
  conceptsPerCard: 3,
  maxConcepts: 5,
  maxCards: 12,
  maxBlocks: 12,
  maxCardsPerBlock: 8,
  domMaxBlocks: 24,
  conceptsBatchSize: 8,
  visionImagesPerCall: 2,
  falModel: 'fal-ai/flux/schnell',
  falImageSize: 'square_hd' as const,
  falNumImages: 1,
};

export type PipelineStep =
  | 'init'
  | 'capture'
  | 'style-dna'
  | 'content'
  | 'concepts'
  | 'prompt'
  | 'render'
  | 'publish';
