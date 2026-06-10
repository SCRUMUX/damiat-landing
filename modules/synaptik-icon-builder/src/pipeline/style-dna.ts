import {
  visionJsonCompletion,
  listAnalyzeScreenshotPaths,
} from '../adapters/vision/index.js';
import { readJsonFile, writeJsonFile, fileExists } from '../fs-json.js';
import { slugify, type SessionPaths } from '../paths.js';
import {
  CaptureReportSchema,
  StyleDNASchema,
  type StyleDNA,
} from '../types/index.js';
import type { SessionManifest } from '../types/index.js';

const STYLE_SYSTEM = `You are a brand visual analyst. Output JSON only matching:
{
  "industry": string,
  "siteVisualStyle": "short English: how the WEBSITE looks (reference only, never for icons)",
  "materials": string[],
  "palette": string[],
  "lighting": string,
  "background": "white" | string,
  "brandCharacter": string,
  "styleLabel": string
}
styleLabel: short brand visual style name (e.g. product name or aesthetic label like "Damiat").
Analyze colors, materials, industry, brand personality from screenshots.
siteVisualStyle is for documentation only — never instruct icon generation to copy photorealism.`;

export async function runAnalyzeStyle(
  paths: SessionPaths,
  opts: { force?: boolean; slug?: string },
): Promise<StyleDNA> {
  if (fileExists(paths.styleDna) && !opts.force) {
    throw new Error('Style DNA already exists. Use --force to regenerate (dev only).');
  }

  const capture = readJsonFile(paths.captureReport, CaptureReportSchema);
  const manifest = readJsonFile(paths.manifest) as SessionManifest;
  const shots = listAnalyzeScreenshotPaths(paths.screenshotsDir);
  if (shots.length === 0) throw new Error('No screenshots. Run: synaptik capture');

  const raw = await visionJsonCompletion<{
    industry: string;
    siteVisualStyle: string;
    materials: string[];
    palette: string[];
    lighting: string;
    background: string;
    brandCharacter?: string;
    styleLabel?: string;
  }>(
    STYLE_SYSTEM,
    `URL: ${capture.sourceUrl ?? 'screenshots'}
Page title: ${capture.pageTitle ?? 'n/a'}
DOM colors: ${(capture.dominantColors ?? []).join(', ')}
Image palette (sharp): ${(capture.paletteFromImage ?? []).join(', ')}
Fonts: ${(capture.fontFamilies ?? []).join(', ')}
Text sample:\n${capture.extractedTextSample ?? ''}`,
    shots,
  );

  const projectSlug = slugify(
    opts.slug ?? manifest.projectSlug ?? raw.industry,
  );

  const dna = StyleDNASchema.parse({
    projectSlug,
    industry: raw.industry,
    rendering: 'site-reference-only',
    siteVisualStyle: raw.siteVisualStyle?.trim() || 'marketing site',
    materials: raw.materials,
    palette: raw.palette,
    lighting: raw.lighting,
    background: 'white',
    brandCharacter: raw.brandCharacter,
    styleLabel: raw.styleLabel ?? projectSlug,
    createdAt: new Date().toISOString(),
  });

  writeJsonFile(paths.styleDna, dna);
  manifest.projectSlug = projectSlug;
  writeJsonFile(paths.manifest, manifest);

  const { runIconStyleBible } = await import('./icon-style-bible.js');
  await runIconStyleBible(paths, {
    force: true,
    iconSetStyleId: manifest.iconSetStyleId,
  });

  return dna;
}
