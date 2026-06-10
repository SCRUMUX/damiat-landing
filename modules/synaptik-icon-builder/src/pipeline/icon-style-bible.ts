import fs from 'node:fs';

import {

  listAnalyzeScreenshotPaths,

  visionJsonCompletion,

} from '../adapters/vision/index.js';

import { readJsonFile, writeJsonFile, fileExists } from '../fs-json.js';

import type { SessionPaths } from '../paths.js';

import {

  assembleStyleBlockFromPreset,

  DEFAULT_ICON_SET_STYLE_ID,

  getIconSetStyle,

  ICON_SET_STYLE_PRESET_VERSION,

  resolveIconSetStyleId,

  type IconSetStyleId,

} from '../icon-set-styles/index.js';

import {

  CaptureReportSchema,

  IconStyleBibleSchema,

  SessionManifestSchema,

  StyleDNASchema,

  type IconStyleBible,

  type StyleDNA,

} from '../types/index.js';



/** @deprecated Use assembleStyleBlockFromPreset. Kept for tests and legacy migrate. */

export const ICON_RENDER_FORBIDDEN = [

  'No photorealistic photography',

  'No photograph',

  'No DSLR',

  'No hyperrealistic',

  'No cinematic photo',

  'No UI screenshots',

  'No text',

  'No letters',

  'No numbers',

  'No watermarks',

] as const;



export const DEFAULT_FORBIDDEN_STYLES = [

  'photorealistic',

  'photograph',

  'DSLR',

  'hyperrealistic',

  'cinematic photo',

  'cartoon',

  'cyberpunk',

] as const;



const BIBLE_PALETTE_SYSTEM = `Extract brand palette hints for a stylized ICON SET (not website screenshots).



Output JSON only:

{

  "styleAnchor": "one short English sentence: brand + industry icon set",

  "paletteLine": "comma-separated accent colors for icons, max 5 hex or color names",

  "paletteForIcons": ["#HEX max 5"],

  "materialsAllowed": ["short material hints safe for icons, no text overlays"]

}



Rules:

- Do NOT describe site photography, studio lighting, or photorealistic rendering.

- Do NOT output renderMode or icon composition — those come from a fixed preset.

- paletteForIcons: accent colors only, not page background colors.`;



export interface StyleBlockParts {

  aesthetic: string;

  renderMode: string;

  materialsLine: string;

  paletteLine: string;

  styleAnchor: string;

  forbiddenStyles: string[];

}



/** @deprecated Legacy assembly — prefer assembleStyleBlockFromPreset. */

export function assembleStyleBlock(parts: StyleBlockParts): string {

  const forbidden = [...new Set([...parts.forbiddenStyles, ...DEFAULT_FORBIDDEN_STYLES])];

  const lines = [

    parts.aesthetic,

    parts.styleAnchor,

    parts.renderMode,

    parts.materialsLine,

    `Accent palette: ${parts.paletteLine}.`,

    'Product-grade iconography.',

    'One clear object per icon.',

    ...ICON_RENDER_FORBIDDEN,

    `Forbidden styles: ${forbidden.join(', ')}.`,

  ];

  return lines.filter(Boolean).join('\n');

}



function sanitizeMaterials(materials: string[]): string[] {

  const blocked = /text|typography|overlay|screenshot|ui mockup|label/i;

  return materials.filter((m) => !blocked.test(m));

}



function readManifestStyleId(paths: SessionPaths): IconSetStyleId | undefined {

  if (!fileExists(paths.manifest)) return undefined;

  try {

    const manifest = readJsonFile(paths.manifest, SessionManifestSchema);

    return manifest.iconSetStyleId;

  } catch {

    return undefined;

  }

}



function writeManifestStyleId(paths: SessionPaths, iconSetStyleId: IconSetStyleId): void {

  if (!fileExists(paths.manifest)) return;

  const manifest = readJsonFile(paths.manifest, SessionManifestSchema);

  manifest.iconSetStyleId = iconSetStyleId;

  writeJsonFile(paths.manifest, manifest);

}



/** Rebuild styleBlock from pre-refactor bible JSON on disk. */

export function migrateLegacyBible(raw: Record<string, unknown>): IconStyleBible {

  const iconSetStyleId = resolveIconSetStyleId(raw.iconSetStyleId);

  const preset = getIconSetStyle(iconSetStyleId);

  const styleAnchor = String(raw.styleAnchor ?? 'Product icon set');

  const paletteForIcons = Array.isArray(raw.paletteForIcons)

    ? (raw.paletteForIcons as string[])

    : [];

  const paletteLine =

    String(raw.paletteLine ?? '') ||

    (paletteForIcons.length > 0 ? paletteForIcons.join(', ') : 'brand accent colors');



  const styleBlock = assembleStyleBlockFromPreset(preset, paletteLine, styleAnchor);



  return IconStyleBibleSchema.parse({

    iconSetStyleId,

    presetVersion: ICON_SET_STYLE_PRESET_VERSION,

    styleBlock,

    forbiddenStyles: [...DEFAULT_FORBIDDEN_STYLES],

    styleAnchor,

    aesthetic: String(raw.aesthetic ?? `${preset.labelEn} icon set`),

    materialsLine: preset.materialsLine,

    paletteLine,

    renderMode: preset.renderModeLine,

    paletteForIcons,

    materialsAllowed: Array.isArray(raw.materialsAllowed)

      ? sanitizeMaterials(raw.materialsAllowed as string[])

      : [],

    materialsForbidden: Array.isArray(raw.materialsForbidden)

      ? (raw.materialsForbidden as string[])

      : [],

    generatedAt: String(raw.generatedAt ?? new Date().toISOString()),

  });

}



/** Icon-safe palette string from bible or DNA. */

export function paletteForIconPrompt(dna: StyleDNA, bible?: IconStyleBible): string {

  if (bible?.paletteLine?.trim()) return bible.paletteLine;

  const fromBible = bible?.paletteForIcons?.filter(Boolean) ?? [];

  if (fromBible.length > 0) return fromBible.join(', ');



  const accents = dna.palette.filter((c) => {

    const hex = c.trim();

    if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return true;

    const r = parseInt(hex.slice(1, 3), 16);

    const g = parseInt(hex.slice(3, 5), 16);

    const b = parseInt(hex.slice(5, 7), 16);

    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    return lum > 40;

  });

  return accents.length > 0 ? accents.join(', ') : '#2BCB7A, #0E1512';

}



export function fallbackStyleBlock(dna: StyleDNA, iconSetStyleId?: IconSetStyleId): string {

  const preset = getIconSetStyle(iconSetStyleId ?? DEFAULT_ICON_SET_STYLE_ID);

  return assembleStyleBlockFromPreset(

    preset,

    paletteForIconPrompt(dna),

    `${dna.styleLabel ?? dna.projectSlug} enterprise iconography`,

  );

}



export async function runIconStyleBible(

  paths: SessionPaths,

  opts: { force?: boolean; iconSetStyleId?: IconSetStyleId } = {},

): Promise<IconStyleBible> {

  if (fileExists(paths.iconStyleBible) && !opts.force) {

    return readIconStyleBible(paths)!;

  }



  const iconSetStyleId = resolveIconSetStyleId(

    opts.iconSetStyleId ?? readManifestStyleId(paths),

  );

  const preset = getIconSetStyle(iconSetStyleId);

  writeManifestStyleId(paths, iconSetStyleId);



  const dna = readJsonFile(paths.styleDna, StyleDNASchema);

  const capture = readJsonFile(paths.captureReport, CaptureReportSchema);

  const shots = listAnalyzeScreenshotPaths(paths.screenshotsDir);



  const raw = await visionJsonCompletion<{

    styleAnchor: string;

    paletteLine: string;

    paletteForIcons: string[];

    materialsAllowed: string[];

  }>(

    BIBLE_PALETTE_SYSTEM,

    `Industry: ${dna.industry}

Brand style label: ${dna.styleLabel ?? dna.projectSlug}

Site palette (accents only, not page backdrop): ${dna.palette.join(', ')}

Brand character: ${dna.brandCharacter ?? 'professional'}

Icon set preset (fixed, do not change): ${preset.id} — ${preset.labelEn}



URL: ${capture.sourceUrl ?? 'screenshots'}`,

    shots,

  );



  const paletteLine =

    raw.paletteLine?.trim() ||

    raw.paletteForIcons?.slice(0, 5).join(', ') ||

    paletteForIconPrompt(dna);



  const styleAnchor =

    raw.styleAnchor?.trim() ||

    `${dna.styleLabel ?? dna.projectSlug} ${dna.industry} icon set`;



  const styleBlock = assembleStyleBlockFromPreset(preset, paletteLine, styleAnchor);



  const bible = IconStyleBibleSchema.parse({

    iconSetStyleId,

    presetVersion: ICON_SET_STYLE_PRESET_VERSION,

    styleBlock,

    forbiddenStyles: [...DEFAULT_FORBIDDEN_STYLES],

    styleAnchor,

    aesthetic: `${preset.labelEn} icon set`,

    materialsLine: preset.materialsLine,

    paletteLine,

    renderMode: preset.renderModeLine,

    paletteForIcons: raw.paletteForIcons?.slice(0, 5) ?? [],

    materialsAllowed: sanitizeMaterials(raw.materialsAllowed ?? []),

    materialsForbidden: [],

    generatedAt: new Date().toISOString(),

  });



  writeJsonFile(paths.iconStyleBible, bible);

  return bible;

}



export function readIconStyleBible(paths: SessionPaths): IconStyleBible | undefined {

  if (!fileExists(paths.iconStyleBible)) return undefined;



  let rawJson: Record<string, unknown>;

  try {

    rawJson = JSON.parse(fs.readFileSync(paths.iconStyleBible, 'utf8')) as Record<string, unknown>;

  } catch {

    return undefined;

  }



  if (!rawJson.iconSetStyleId) {

    return migrateLegacyBible(rawJson);

  }



  try {

    return IconStyleBibleSchema.parse(rawJson);

  } catch {

    return migrateLegacyBible(rawJson);

  }

}



/** Manifest is source of truth when present; bible supplies palette/anchor only. */
export function resolveSessionIconSetStyleId(paths: SessionPaths): IconSetStyleId {
  const fromManifest = readManifestStyleId(paths);
  if (fromManifest) return resolveIconSetStyleId(fromManifest);
  const fromBible = readIconStyleBible(paths)?.iconSetStyleId;
  if (fromBible) return fromBible;
  return DEFAULT_ICON_SET_STYLE_ID;
}


