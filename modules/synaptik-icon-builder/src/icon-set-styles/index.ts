import { z } from 'zod';
import { SubjectSanitizeError } from './errors.js';

export { SubjectSanitizeError } from './errors.js';

/** Fixed icon-set render styles — never chosen by site analyze vision. */
export const IconSetStyleIdSchema = z.enum([
  'glass',
  'isometric',
  'soft3d',
  'shield',
  'flat',
  'outline',
]);

export type IconSetStyleId = z.infer<typeof IconSetStyleIdSchema>;

export const DEFAULT_ICON_SET_STYLE_ID: IconSetStyleId = 'isometric';

export const ICON_SET_STYLE_PRESET_VERSION = 1 as const;

export interface IconSetStylePreset {
  id: IconSetStyleId;
  labelRu: string;
  labelEn: string;
  renderModeLine: string;
  materialsLine: string;
  compositionLine: string;
  iconSubjectPrefix: string;
  forbiddenTokens: RegExp;
}

const ENVIRONMENT_PATTERN =
  /\b(studio|showroom|gallery|floor|wall|ceiling|sky|outdoor|landscape|room|stage|backdrop|environment|scene|lighting rig|softbox|spotlight|plants?|wooden|planks?|pedestal|display case)\b/i;

const PHOTOREAL_PATTERN =
  /\b(photoreal\w*|photograph\w*|photoshoot|dslr|hyperreal|cinematic photo|realistic photo|raw photo|8k photo)\b/i;

const SUBJECT_BLOCKED_PATTERN = new RegExp(
  `${ENVIRONMENT_PATTERN.source}|${PHOTOREAL_PATTERN.source}|\\b(soil|dirt|roots?|grass field|mountain range)\\b`,
  'i',
);

const PRESETS: Record<IconSetStyleId, IconSetStylePreset> = {
  glass: {
    id: 'glass',
    labelRu: 'Стекло (frosted glass)',
    labelEn: 'Frosted glass',
    renderModeLine: 'Frosted glass and soft specular highlights — stylized product icon, not photography',
    materialsLine: 'Translucent glass, soft inner glow, minimal metal accents',
    compositionLine: 'Single centered glass object, no room, no floor, no props',
    iconSubjectPrefix:
      'Single frosted-glass stylized icon object, not a photograph, no environment:',
    forbiddenTokens: SUBJECT_BLOCKED_PATTERN,
  },
  isometric: {
    id: 'isometric',
    labelRu: 'Изометрия',
    labelEn: 'Isometric',
    renderModeLine: 'Clean isometric 3D product icon — stylized illustration, not photography',
    materialsLine: 'Matte plastic and soft painted surfaces, crisp edges',
    compositionLine: 'One isometric object centered, no ground plane scene, no studio',
    iconSubjectPrefix:
      'Single isometric stylized icon object, not a photograph, no environment:',
    forbiddenTokens: SUBJECT_BLOCKED_PATTERN,
  },
  soft3d: {
    id: 'soft3d',
    labelRu: 'Мягкий 3D',
    labelEn: 'Soft 3D',
    renderModeLine: 'Soft rounded 3D product icon — toy-like stylized render, not photography',
    materialsLine: 'Smooth matte plastic, gentle ambient shading',
    compositionLine: 'One soft 3D object on empty white canvas, no scene or pedestal room',
    iconSubjectPrefix:
      'Single soft 3D stylized icon object, not a photograph, no environment:',
    forbiddenTokens: SUBJECT_BLOCKED_PATTERN,
  },
  shield: {
    id: 'shield',
    labelRu: 'Шильды / эмблемы',
    labelEn: 'Shield emblem',
    renderModeLine: 'Flat-shaded shield emblem icon — heraldic product badge, not photography',
    materialsLine: 'Bold enamel fills, simple metallic rim, no photographic texture',
    compositionLine: 'One shield or badge emblem centered, no background scene',
    iconSubjectPrefix:
      'Single shield-emblem stylized icon, not a photograph, no environment:',
    forbiddenTokens: SUBJECT_BLOCKED_PATTERN,
  },
  flat: {
    id: 'flat',
    labelRu: 'Плоский',
    labelEn: 'Flat',
    renderModeLine: 'Flat vector-style product icon — solid shapes, no photography',
    materialsLine: 'Flat color fills, subtle gradient allowed, no realistic textures',
    compositionLine: 'One flat symbolic object, centered, no perspective room',
    iconSubjectPrefix: 'Single flat vector-style icon symbol, not a photograph, no environment:',
    forbiddenTokens: SUBJECT_BLOCKED_PATTERN,
  },
  outline: {
    id: 'outline',
    labelRu: 'Контурный',
    labelEn: 'Outline',
    renderModeLine: 'Outline line-art product icon — consistent stroke weight, not photography',
    materialsLine: 'Monoline strokes, minimal fill, brand accent color only',
    compositionLine: 'One outline symbol centered, no scene, no photographic shading',
    iconSubjectPrefix:
      'Single outline line-art icon symbol, not a photograph, no environment:',
    forbiddenTokens: SUBJECT_BLOCKED_PATTERN,
  },
};

export const ICON_SET_STYLES: IconSetStylePreset[] = Object.values(PRESETS);

export function parseIconSetStyleId(raw: unknown): IconSetStyleId | undefined {
  const r = IconSetStyleIdSchema.safeParse(raw);
  return r.success ? r.data : undefined;
}

export function getIconSetStyle(id: IconSetStyleId): IconSetStylePreset {
  const preset = PRESETS[id];
  if (!preset) throw new Error(`Unknown icon set style: ${id}`);
  return preset;
}

export function resolveIconSetStyleId(
  raw: unknown,
  fallback: IconSetStyleId = DEFAULT_ICON_SET_STYLE_ID,
): IconSetStyleId {
  return parseIconSetStyleId(raw) ?? fallback;
}

/** Shared tail lines for every preset styleBlock. */
export const ICON_STYLE_BLOCK_TAIL = [
  'Product-grade iconography.',
  'Enterprise technology aesthetic.',
  'Minimal composition.',
  'One clear object per icon.',
  'Consistent visual system across the set.',
  'No photorealistic photography.',
  'No photograph.',
  'No DSLR.',
  'No studio.',
  'No environment.',
  'No floor.',
  'No sky.',
  'No text.',
  'No letters.',
  'No numbers.',
  'No watermarks.',
  'No UI screenshots.',
] as const;

/** Build multiline STYLE_BLOCK from a fixed preset + brand palette (vision never sets renderMode). */
export function assembleStyleBlockFromPreset(
  preset: IconSetStylePreset,
  paletteLine: string,
  styleAnchor: string,
): string {
  const lines = [
    `${preset.labelEn} icon set.`,
    styleAnchor.trim(),
    preset.renderModeLine,
    preset.materialsLine,
    preset.compositionLine,
    `Accent palette: ${paletteLine.trim() || 'brand accent colors'}.`,
    ...ICON_STYLE_BLOCK_TAIL,
    `Icon set style preset: ${preset.id}.`,
  ];
  return lines.filter(Boolean).join('\n');
}

/** Shorter style block for Flux (composition rules live in COMPOSITION block). */
export function assembleStyleBlockForFlux(
  preset: IconSetStylePreset,
  paletteLine: string,
  styleAnchor: string,
): string {
  const lines = [
    `${preset.labelEn} icon set.`,
    styleAnchor.trim(),
    preset.renderModeLine,
    preset.materialsLine,
    `Accent palette: ${paletteLine.trim() || 'brand accent colors'}.`,
    `Icon set style preset: ${preset.id}.`,
  ];
  return lines.filter(Boolean).join('\n');
}

/** Short guardrails for concepts vision (not full styleBlock). */
export function presetConceptGuardrails(preset: IconSetStylePreset): string {
  return [
    `Icon set style: ${preset.id} (${preset.labelEn}).`,
    preset.renderModeLine,
    preset.iconSubjectPrefix,
    'One object or symbol only. No environment, no studio, no soil, no photography.',
  ].join('\n');
}

/** Remove preset guardrail prefix before re-sanitizing stored subjects. */
export function stripIconSubjectPrefix(
  text: string,
  preset: IconSetStylePreset,
): string {
  const t = text.trim();
  const prefix = preset.iconSubjectPrefix.trim();
  if (t.toLowerCase().startsWith(prefix.toLowerCase())) {
    return t.slice(prefix.length).replace(/^[\s:]+/, '').trim();
  }
  const generic = /^single\s+[\w\s-]+\s+stylized\s+icon\s+object[^:]*:\s*/i;
  const m = t.match(generic);
  if (m) return t.slice(m[0].length).trim();
  return t;
}

/** Strip negation phrases so guardrail words are not matched as scene tokens. */
function stripNegationPhrases(s: string): string {
  return s
    .replace(/\bno\s+environment\b/gi, ' ')
    .replace(/\bnot\s+a\s+photograph\b/gi, ' ')
    .replace(/\bnot\s+photography\b/gi, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Strip scene/photoreal language from a raw visual object (no preset prefix).
 * Returns empty string if unusable.
 */
export function sanitizeIconSubject(
  text: string | undefined,
  preset: IconSetStylePreset,
): string {
  if (!text?.trim()) return '';

  let s = stripNegationPhrases(stripIconSubjectPrefix(text.trim(), preset));

  if (preset.forbiddenTokens.test(s)) {
    s = s
      .replace(preset.forbiddenTokens, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  const check = stripNegationPhrases(s);
  if (!check || preset.forbiddenTokens.test(check) || PHOTOREAL_PATTERN.test(check)) {
    return '';
  }

  if (s.length > 200) {
    s = s.slice(0, 200).trim();
  }

  return s;
}

/** Build Flux subject line: prefix + cleaned visual object (apply once). */
export function buildSubjectLine(
  visualObject: string | undefined,
  preset: IconSetStylePreset,
): string {
  const cleaned = sanitizeIconSubject(visualObject, preset);
  if (!cleaned) {
    throw new SubjectSanitizeError(
      'Visual object is empty or contains blocked scene/photoreal language. Regenerate concepts or semantic layer.',
    );
  }
  return `${preset.iconSubjectPrefix} ${cleaned}`;
}

/** @deprecated Use buildSubjectLine with visualObject only. */
export function buildSanitizedIconSubject(
  raw: string | undefined,
  preset: IconSetStylePreset,
  _cardTitle?: string,
): string {
  return buildSubjectLine(raw, preset);
}

/** Extract stored visual object from legacy iconSubject (prefixed) or plain text. */
export function extractVisualObject(
  raw: string | undefined,
  preset: IconSetStylePreset,
): string {
  if (!raw?.trim()) return '';
  const stripped = stripIconSubjectPrefix(raw.trim(), preset);
  if (/^abstract\s+/i.test(stripped) && /\brepresenting:/i.test(stripped)) {
    return '';
  }
  return sanitizeIconSubject(stripped, preset) || sanitizeIconSubject(raw, preset);
}
