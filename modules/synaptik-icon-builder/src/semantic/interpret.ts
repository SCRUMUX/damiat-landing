import path from 'node:path';
import { visionJsonCompletion } from '../adapters/vision/index.js';
import { readJsonFile, writeJsonFile, fileExists } from '../fs-json.js';
import { slugify, type SessionPaths } from '../paths.js';
import {
  ContentCardsFileSchema,
  StyleDNASchema,
  MVP_DEFAULTS,
  type ContentCard,
} from '../types/index.js';
import {
  DEFAULT_ICON_SET_STYLE_ID,
  getIconSetStyle,
  sanitizeIconSubject,
} from '../icon-set-styles/index.js';
import { ANTI_PATTERN_PROMPT_RULES, hasAntiPattern } from './anti-patterns.js';
import { CardSemanticSchema, type CardSemantic, type IconType } from './types.js';

const SEMANTIC_SYSTEM = `You translate marketing card titles into concrete English visual objects for product icons.

Return JSON only:
{
  "byCardId": {
    "card-id": {
      "iconType": "object" | "process" | "business" | "infrastructure" | "analytics",
      "visualObject": "one primary visible thing — physical, recognizable, English only",
      "visualFocus": ["2-4 short concrete visual cues"]
    }
  }
}

iconType guide:
- object: sensor, device, crate, plant specimen
- process: ventilation flow, ripening, drying, ozonation
- business: profit growth, sales timing, cost (show via objects like coins, chart shape without numbers)
- infrastructure: storage network, platform connection
- analytics: dashboard as simplified object shapes, not UI screenshots

Never use scene or environment words: room, studio, floor, wall, outdoor, landscape, storage room, warehouse interior.
Describe one product-scale object (sensor, device, crate), not a place.

${ANTI_PATTERN_PROMPT_RULES}`;

function buildCardLines(cards: ContentCard[]): string {
  return cards
    .map(
      (c) =>
        `- cardId: ${c.id}
  title: ${c.title}
  description: ${c.description ?? 'n/a'}
  block: ${c.blockTitle ?? 'n/a'}`,
    )
    .join('\n');
}

export function getSemanticPath(paths: SessionPaths, cardId: string): string {
  return path.join(paths.semanticDir, `${slugify(cardId)}.json`);
}

export function readCardSemantic(
  paths: SessionPaths,
  cardId: string,
): CardSemantic | undefined {
  const p = getSemanticPath(paths, cardId);
  if (!fileExists(p)) return undefined;
  try {
    return readJsonFile(p, CardSemanticSchema);
  } catch {
    return undefined;
  }
}

const semanticPreset = () => getIconSetStyle(DEFAULT_ICON_SET_STYLE_ID);

function cleanSemanticPhrase(text: string): string {
  const t = text.trim();
  if (!t || /[\u0400-\u04FF]/.test(t) || hasAntiPattern(t)) return '';
  return sanitizeIconSubject(t, semanticPreset());
}

function validateSemantic(entry: {
  iconType: string;
  visualObject: string;
  visualFocus: string[];
}): CardSemantic | null {
  const visualObject = cleanSemanticPhrase(entry.visualObject ?? '');
  const visualFocus = (entry.visualFocus ?? [])
    .map((f) => cleanSemanticPhrase(f))
    .filter((f) => f.length >= 3)
    .slice(0, 4);

  const parsed = CardSemanticSchema.safeParse({
    cardId: '',
    iconType: entry.iconType,
    visualObject,
    visualFocus: visualFocus.length > 0 ? visualFocus : visualObject ? [visualObject] : [],
  });
  if (!parsed.success) return null;
  return parsed.data;
}

export async function runSemanticInterpret(
  paths: SessionPaths,
  opts: { cardId?: string; cardIds?: string[]; force?: boolean },
): Promise<void> {
  const dna = readJsonFile(paths.styleDna, StyleDNASchema);
  const { cards } = readJsonFile(paths.contentCards, ContentCardsFileSchema);

  let targets = cards.filter((c) => !c.skipped);
  if (opts.cardId) {
    targets = targets.filter((c) => c.id === opts.cardId);
  } else if (opts.cardIds?.length) {
    const set = new Set(opts.cardIds);
    targets = targets.filter((c) => set.has(c.id));
  }

  if (targets.length === 0) throw new Error('No cards for semantic interpret');

  const batchSize = MVP_DEFAULTS.conceptsBatchSize;

  for (let i = 0; i < targets.length; i += batchSize) {
    const slice = targets.slice(i, i + batchSize);
    const chunk = slice.filter((card) => {
      if (opts.force) return true;
      return !fileExists(getSemanticPath(paths, card.id));
    });

    if (chunk.length === 0) continue;

    const raw = await visionJsonCompletion<{
      byCardId: Record<
        string,
        {
          iconType: IconType;
          visualObject: string;
          visualFocus: string[];
        }
      >;
    }>(
      SEMANTIC_SYSTEM,
      `Industry: ${dna.industry}
Brand: ${dna.styleLabel ?? dna.projectSlug}

Cards:
${buildCardLines(chunk)}`,
      [],
      { textOnly: true },
    );

    for (const card of chunk) {
      const entry = raw.byCardId?.[card.id];
      if (!entry) {
        throw new Error(
          `Semantic interpret missing card "${card.id}". Re-run: synaptik semantic --session ${paths.sessionId}`,
        );
      }
      const validated = validateSemantic(entry);
      if (!validated) {
        const raw = entry.visualObject?.trim() ?? '';
        const hint = /[\u0400-\u04FF]/.test(raw)
          ? 'non-English text'
          : hasAntiPattern(raw)
            ? 'anti-pattern phrase'
            : semanticPreset().forbiddenTokens.test(raw)
              ? 'scene/environment word (room, studio, floor…)'
              : 'too short after sanitizing';
        throw new Error(
          `Invalid semantic for card "${card.id}" (${hint}). Re-run: synaptik semantic --session ${paths.sessionId} --card ${card.id} --force`,
        );
      }
      writeJsonFile(getSemanticPath(paths, card.id), {
        ...validated,
        cardId: card.id,
        generatedAt: new Date().toISOString(),
      });
    }
  }
}
