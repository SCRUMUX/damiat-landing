import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { deriveFalSeed } from '../adapters/fal-seed.js';
import { downloadImage, generateIconImage } from '../adapters/fal-flux.js';
import { normalizeIconComposition } from '../adapters/icon-composition.js';
import { runIconQa } from '../adapters/icon-qa.js';
import { fileExists, readJsonFile, writeJsonFile } from '../fs-json.js';
import { SelectionsFileSchema } from '../types/index.js';
import type { IconQualityWarning } from '../types/index.js';
import { slugify, toPascalCase, type SessionPaths } from '../paths.js';
import {
  AssetMetaSchema,
  ContentCardsFileSchema,
  IconConceptSetSchema,
  StyleDNASchema,
} from '../types/index.js';
import {
  getSelectionForCard,
  promptHash,
  runBuildPrompt,
  RENDER_STRICT_EXTRA,
} from './build-prompt.js';
import { resolveSessionIconSetStyleId } from './icon-style-bible.js';
import { readCardSemantic } from '../semantic/interpret.js';
import { inferIconCategory } from '../utils/infer-category.js';
import { findRenderDirByCardId, resolveRenderDirName } from '../utils/render-dir.js';
import {
  archiveCurrentRender,
  registerNewActiveVersion,
} from '../utils/render-versions.js';

const MAX_RENDER_ATTEMPTS = 3;

export interface RenderResult {
  renderDir: string;
  iconSlug: string;
  meta: ReturnType<typeof AssetMetaSchema.parse>;
}

interface GenerateAttemptResult {
  buf: Buffer;
  prompt: string;
  warnings: IconQualityWarning[];
  qaOk: boolean;
  falSeed: number;
}

async function generateAndNormalize(
  paths: SessionPaths,
  cardId: string,
  attempt: number,
  extraDescription?: string,
  regenerateNonce = 0,
  forceQuality = false,
): Promise<GenerateAttemptResult> {
  const sel = getSelectionForCard(paths, cardId);
  const conceptId = sel?.conceptId ?? 'A';
  const iconSetStyleId = resolveSessionIconSetStyleId(paths);
  const seed = deriveFalSeed(
    paths.sessionId,
    cardId,
    conceptId,
    attempt,
    regenerateNonce,
    iconSetStyleId,
  );

  const prompt = runBuildPrompt(paths, cardId, {
    extraDescription,
    forceQuality: forceQuality || process.env.SYNAPTIK_PROMPT_FORCE === '1',
  });
  const flux = await generateIconImage(prompt, { seed });
  const raw = await downloadImage(flux.imageUrl);
  const buf = await normalizeIconComposition(raw);
  const qa = await runIconQa(buf);
  return {
    buf,
    prompt,
    warnings: qa.warnings,
    qaOk: qa.ok,
    falSeed: flux.seed,
  };
}

function warningScore(warnings: IconQualityWarning[]): number {
  return warnings.length;
}

export async function runRender(
  paths: SessionPaths,
  cardId: string,
  opts: {
    overwrite?: boolean;
    realism?: string;
    extraDescription?: string;
    regenerateNonce?: number;
    forceQuality?: boolean;
  },
): Promise<RenderResult> {
  if (!fileExists(paths.selections)) {
    throw new Error('No selections.json. Run: synaptik select-concept');
  }
  readJsonFile(paths.selections, SelectionsFileSchema);

  const dna = readJsonFile(paths.styleDna, StyleDNASchema);
  const { cards } = readJsonFile(paths.contentCards, ContentCardsFileSchema);
  const card = cards.find((c) => c.id === cardId);
  if (!card) throw new Error(`Unknown card: ${cardId}`);
  if (card.skipped) {
    throw new Error(`Card "${cardId}" is marked skipped. Enable it in structure to render.`);
  }

  const existingDir = findRenderDirByCardId(paths.rendersDir, card.id);
  const dirName = existingDir
    ? path.basename(existingDir)
    : resolveRenderDirName(paths.rendersDir, card.id);
  const iconSlug = dirName;
  const renderDir = path.join(paths.rendersDir, dirName);
  const pngPath = path.join(renderDir, 'icon.png');

  if (fs.existsSync(pngPath) && !opts.overwrite) {
    throw new Error(`Render exists for ${cardId}. Use --overwrite`);
  }

  fs.mkdirSync(renderDir, { recursive: true });

  if (opts.overwrite && fs.existsSync(pngPath)) {
    archiveCurrentRender(renderDir);
  }

  let best: GenerateAttemptResult | null = null;

  for (let attempt = 0; attempt < MAX_RENDER_ATTEMPTS; attempt++) {
    const extra =
      attempt === 0
        ? opts.extraDescription
        : RENDER_STRICT_EXTRA;
    const result = await generateAndNormalize(
      paths,
      cardId,
      attempt,
      extra,
      opts.regenerateNonce ?? 0,
      Boolean(opts.forceQuality),
    );

    if (result.qaOk) {
      best = result;
      break;
    }

    if (
      !best ||
      warningScore(result.warnings) < warningScore(best.warnings) ||
      (warningScore(result.warnings) === warningScore(best.warnings) && result.qaOk)
    ) {
      best = result;
    }
  }

  if (!best) {
    throw new Error(`Render failed for ${cardId}`);
  }

  const failedQa = !best.qaOk;

  await sharp(best.buf).png().toFile(pngPath);
  await sharp(best.buf).webp({ quality: 90 }).toFile(path.join(renderDir, 'icon.webp'));

  const sel = getSelectionForCard(paths, cardId);
  const conceptFile = path.join(paths.conceptsDir, `${slugify(cardId)}.json`);
  const set = readJsonFile(conceptFile, IconConceptSetSchema);
  const iconSetStyleId = resolveSessionIconSetStyleId(paths);

  const meta = AssetMetaSchema.parse({
    name: toPascalCase(iconSlug),
    category: inferIconCategory(
      card.title,
      dna.industry,
      readCardSemantic(paths, cardId)?.iconType,
    ),
    style: dna.styleLabel ?? dna.projectSlug,
    createdBy: 'AI Icon Builder',
    conceptId: sel?.conceptId,
    sourceCard: card.title,
    promptHash: promptHash(best.prompt),
    iconSetStyleId,
    sessionId: paths.sessionId,
    cardId,
    blockId: card.blockId,
    blockTitle: card.blockTitle,
    iconSlug,
    falSeed: best.falSeed,
    ...(failedQa ? { failedQa: true, qualityWarnings: best.warnings } : {}),
  });

  writeJsonFile(path.join(renderDir, 'meta.json'), meta);
  registerNewActiveVersion(renderDir, meta);
  return { renderDir, iconSlug, meta };
}
