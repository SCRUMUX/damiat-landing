import crypto from 'node:crypto';
import fs from 'node:fs';
import {
  ensureSessionDirs,
  getSessionPaths,
  getSessionsRoot,
  slugify,
} from '../paths.js';
import { writeJsonFile } from '../fs-json.js';
import type { IconSetStyleId } from '../icon-set-styles/index.js';
import type { SessionManifest } from '../types/index.js';

export interface InitOptions {
  url?: string;
  screenshots?: string;
  slug?: string;
  sessionId?: string;
  iconSetStyleId?: IconSetStyleId;
}

export function createSession(opts: InitOptions): string {
  const sessionId = opts.sessionId ?? crypto.randomUUID().slice(0, 8);
  const paths = getSessionPaths(sessionId);
  fs.mkdirSync(getSessionsRoot(), { recursive: true });
  ensureSessionDirs(paths);

  const manifest: SessionManifest = {
    sessionId,
    createdAt: new Date().toISOString(),
    sourceUrl: opts.url,
    screenshotsPath: opts.screenshots,
    projectSlug: opts.slug ? slugify(opts.slug) : undefined,
    iconSetStyleId: opts.iconSetStyleId,
  };

  writeJsonFile(paths.manifest, manifest);

  writeJsonFile(paths.contentCards, { cards: [] });
  writeJsonFile(paths.contentStructure, { blocks: [] });
  writeJsonFile(paths.selections, { selections: [] });

  return sessionId;
}
