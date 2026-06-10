import fs from 'node:fs';
import path from 'node:path';
import { resolveGeneratedIconsRoot } from './synaptik-config.js';
import { getWorkspaceRoot } from './workspace-root.js';

export interface SessionPaths {
  sessionId: string;
  sessionDir: string;
  manifest: string;
  captureReport: string;
  styleDna: string;
  iconStyleBible: string;
  contentCards: string;
  contentStructure: string;
  conceptsDir: string;
  semanticDir: string;
  promptsDir: string;
  selections: string;
  screenshotsDir: string;
  rendersDir: string;
}

export function getSynaptikRoot(): string {
  return path.join(getWorkspaceRoot(), '.synaptik');
}

export function getSessionsRoot(): string {
  return path.join(getSynaptikRoot(), 'sessions');
}

export function getPageDir(sessionId: string, pageSlug: string): string {
  return path.join(getSessionsRoot(), sessionId, 'pages', pageSlug);
}

export function getPageCapturePaths(
  sessionId: string,
  pageSlug: string,
): { screenshotsDir: string; captureReport: string } {
  const pageDir = getPageDir(sessionId, pageSlug);
  return {
    screenshotsDir: path.join(pageDir, 'screenshots'),
    captureReport: path.join(pageDir, 'capture-report.json'),
  };
}

export function getSessionPaths(sessionId: string): SessionPaths {
  const sessionDir = path.join(getSessionsRoot(), sessionId);
  return {
    sessionId,
    sessionDir,
    manifest: path.join(sessionDir, 'manifest.json'),
    captureReport: path.join(sessionDir, 'capture-report.json'),
    styleDna: path.join(sessionDir, 'style-dna.json'),
    iconStyleBible: path.join(sessionDir, 'icon-style-bible.json'),
    contentCards: path.join(sessionDir, 'content-cards.json'),
    contentStructure: path.join(sessionDir, 'content-structure.json'),
    conceptsDir: path.join(sessionDir, 'concepts'),
    semanticDir: path.join(sessionDir, 'semantic'),
    promptsDir: path.join(sessionDir, 'prompts'),
    selections: path.join(sessionDir, 'selections.json'),
    screenshotsDir: path.join(sessionDir, 'screenshots'),
    rendersDir: path.join(sessionDir, 'renders'),
  };
}

export function getGeneratedIconsRoot(): string {
  return resolveGeneratedIconsRoot();
}

export function getRegistryPath(): string {
  return path.join(getGeneratedIconsRoot(), 'registry.json');
}

export function getGeneratedIconDir(projectSlug: string, iconSlug: string): string {
  return path.join(getGeneratedIconsRoot(), projectSlug, iconSlug);
}

export function ensureSessionDirs(paths: SessionPaths): void {
  fs.mkdirSync(paths.screenshotsDir, { recursive: true });
  fs.mkdirSync(paths.conceptsDir, { recursive: true });
  fs.mkdirSync(paths.semanticDir, { recursive: true });
  fs.mkdirSync(paths.promptsDir, { recursive: true });
  fs.mkdirSync(paths.rendersDir, { recursive: true });
}

export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
  return base.length > 0 ? base : '';
}

export function toPascalCase(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
}
