import { readJsonFile, writeJsonFile } from '../fs-json.js';
import { pageSlugFromUrl } from '../utils/page-url.js';
import type { SessionPaths } from '../paths.js';
import {
  CaptureReportSchema,
  SessionManifestSchema,
  type SessionPageEntry,
} from '../types/index.js';

export function upsertManifestPage(
  paths: SessionPaths,
  url: string,
  opts?: { pageTitle?: string; capturedAt?: string },
): SessionPageEntry {
  const manifest = readJsonFile(paths.manifest, SessionManifestSchema);
  const pageSlug = pageSlugFromUrl(url);
  const entry: SessionPageEntry = {
    url,
    pageSlug,
    capturedAt: opts?.capturedAt ?? new Date().toISOString(),
    ...(opts?.pageTitle ? { pageTitle: opts.pageTitle } : {}),
  };

  const pages = manifest.pages ?? [];
  const idx = pages.findIndex((p) => p.pageSlug === pageSlug);
  if (idx >= 0) pages[idx] = entry;
  else pages.push(entry);

  manifest.pages = pages;
  if (!manifest.sourceUrl) manifest.sourceUrl = url;
  writeJsonFile(paths.manifest, manifest);
  return entry;
}

export function loadManifestPages(paths: SessionPaths): SessionPageEntry[] {
  const manifest = readJsonFile(paths.manifest, SessionManifestSchema);
  if (manifest.pages?.length) return manifest.pages;
  if (manifest.sourceUrl) {
    let pageTitle: string | undefined;
    try {
      const capture = readJsonFile(paths.captureReport, CaptureReportSchema);
      pageTitle = capture.pageTitle;
    } catch {
      // optional
    }
    return [
      {
        url: manifest.sourceUrl,
        pageSlug: pageSlugFromUrl(manifest.sourceUrl),
        capturedAt: manifest.createdAt,
        pageTitle,
      },
    ];
  }
  return [];
}
