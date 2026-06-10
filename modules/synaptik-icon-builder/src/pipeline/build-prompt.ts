import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { readJsonFile } from '../fs-json.js';
import { slugify, type SessionPaths } from '../paths.js';
import {
  ContentCardsFileSchema,
  SelectionsFileSchema,
  StyleDNASchema,
  type ConceptLetter,
} from '../types/index.js';
import { getConceptSetForCard, resolveConceptForRender } from './concepts.js';
import {
  fallbackStyleBlock,
  readIconStyleBible,
  resolveSessionIconSetStyleId,
} from './icon-style-bible.js';
import {
  assembleStyleBlockForFlux,
  getIconSetStyle,
  type IconSetStylePreset,
} from '../icon-set-styles/index.js';
import { buildSubjectLine } from '../icon-set-styles/index.js';
import { auditPrompt } from './prompt-audit.js';
import { assertPromptQuality, scorePrompt } from './prompt-score.js';

/** Composition block — reusable across all icons. */
export const COMPOSITION_BLOCK = [
  'Single centered object.',
  'Object occupies about 70 percent of the square canvas.',
  'Solid white #FFFFFF background only.',
  'No environment.',
  'No landscape.',
  'No room.',
  'No scene.',
  'No floor plane.',
  'No text.',
  'No letters.',
  'No numbers.',
  'No typography.',
  'No watermarks.',
  'No UI screenshots.',
  'No photorealistic photography.',
  'No photographs.',
].join('\n');

/** @deprecated Use COMPOSITION_BLOCK */
export const FLUX_MANDATORY_TAIL = COMPOSITION_BLOCK;

export const RENDER_STRICT_EXTRA = [
  'STRICT: full object visible, not cropped at any edge.',
  'STRICT: absolutely no letters, numbers, or typography anywhere.',
  'STRICT: pure white #FFFFFF background only.',
].join(' ');

export interface PromptSections {
  subject: string;
  style: string;
  composition: string;
}

export function promptHash(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex').slice(0, 16);
}

export function buildPromptSections(
  styleBlock: string,
  subjectLine: string,
  extraDescription?: string,
): PromptSections {
  const subject = ['=== SUBJECT BLOCK ===', subjectLine.trim()].join('\n');
  const style = ['=== STYLE BLOCK ===', styleBlock.trim()].join('\n');
  const compLines = [COMPOSITION_BLOCK];
  if (extraDescription?.trim()) {
    compLines.push(extraDescription.trim());
  }
  const composition = ['=== COMPOSITION BLOCK ===', compLines.join('\n')].join('\n');
  return { subject, style, composition };
}

/** Subject first for Flux adherence. */
export function assembleFluxPrompt(sections: PromptSections): string {
  return [sections.subject, '', sections.style, '', sections.composition].join('\n');
}

export function buildPromptText(
  styleBlock: string,
  subjectLine: string,
  extraDescription?: string,
): string {
  return assembleFluxPrompt(buildPromptSections(styleBlock, subjectLine, extraDescription));
}

export function resolveFluxStyleBlock(
  paths: SessionPaths,
  iconSetStyleId?: ReturnType<typeof resolveSessionIconSetStyleId>,
): string {
  const effectiveId = iconSetStyleId ?? resolveSessionIconSetStyleId(paths);
  const preset = getIconSetStyle(effectiveId);
  const bible = readIconStyleBible(paths);
  const paletteLine =
    bible?.paletteLine?.trim() ||
    bible?.paletteForIcons?.filter(Boolean).join(', ') ||
    '';
  const styleAnchor = bible?.styleAnchor?.trim();
  if (styleAnchor && paletteLine) {
    return assembleStyleBlockForFlux(preset, paletteLine, styleAnchor);
  }
  const dna = readJsonFile(paths.styleDna, StyleDNASchema);
  return fallbackStyleBlock(dna, effectiveId);
}

export interface BuiltPromptResult {
  text: string;
  sections: PromptSections;
  visualObject: string;
  subjectLine: string;
}

export function buildPromptForCard(
  paths: SessionPaths,
  cardId: string,
  overrides?: { extraDescription?: string; conceptId?: string },
): BuiltPromptResult {
  const iconSetStyleId = resolveSessionIconSetStyleId(paths);
  const styleBlock = resolveFluxStyleBlock(paths, iconSetStyleId);

  const { selections } = readJsonFile(paths.selections, SelectionsFileSchema);
  const sel = selections.find((s) => s.cardId === cardId);
  const conceptId = overrides?.conceptId ?? sel?.conceptId;
  if (!conceptId) {
    throw new Error(`No concept selected for card "${cardId}". Run: synaptik select-concept`);
  }

  const set = getConceptSetForCard(paths, cardId);
  const { cards } = readJsonFile(paths.contentCards, ContentCardsFileSchema);
  const card = cards.find((c) => c.id === cardId);
  const resolved = resolveConceptForRender(
    set,
    conceptId as ConceptLetter,
    card,
    iconSetStyleId,
  );
  const preset = getIconSetStyle(iconSetStyleId);
  const subjectLine = buildSubjectLine(resolved.visualObject, preset);

  const sections = buildPromptSections(
    styleBlock,
    subjectLine,
    overrides?.extraDescription ?? sel?.descriptionOverride,
  );
  const text = assembleFluxPrompt(sections);

  return {
    text,
    sections,
    visualObject: resolved.visualObject,
    subjectLine,
  };
}

export function runBuildPrompt(
  paths: SessionPaths,
  cardId: string,
  overrides?: { extraDescription?: string; forceQuality?: boolean },
): string {
  const built = buildPromptForCard(paths, cardId, overrides);
  assertPromptQuality(built.text, built.visualObject, {
    force: overrides?.forceQuality ?? process.env.SYNAPTIK_PROMPT_FORCE === '1',
  });

  fs.mkdirSync(paths.promptsDir, { recursive: true });
  const slug = slugify(cardId);
  fs.writeFileSync(path.join(paths.promptsDir, `${slug}.txt`), built.text, 'utf8');
  fs.writeFileSync(
    path.join(paths.promptsDir, `${slug}.debug.json`),
    JSON.stringify(
      {
        visualObject: built.visualObject,
        sections: built.sections,
        promptHash: promptHash(built.text),
        audit: auditPrompt(built.text),
        score: scorePrompt(built.text, built.visualObject),
      },
      null,
      2,
    ),
    'utf8',
  );
  return built.text;
}

export function getSelectionForCard(
  paths: SessionPaths,
  cardId: string,
): { conceptId: string; realismOverride?: string; descriptionOverride?: string } | undefined {
  const { selections } = readJsonFile(paths.selections, SelectionsFileSchema);
  return selections.find((s) => s.cardId === cardId);
}
