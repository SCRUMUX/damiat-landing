import path from 'node:path';
import { fileExists, readJsonFile } from './fs-json.js';
import {
  getGeneratedIconsRoot,
  getSessionPaths,
  type SessionPaths,
} from './paths.js';
import { getWorkspaceRoot } from './workspace-root.js';
import { StyleDNASchema } from './types/index.js';
import { listPublishReadyCardIds } from './pipeline/publish-ready.js';

export interface StoragePathsInfo {
  workspaceRoot: string;
  sessionId?: string;
  /** Absolute path to session renders (previews in UI). */
  sessionRendersDir?: string;
  /** Relative from workspace, for display. */
  sessionRendersDirRel?: string;
  catalogRoot: string;
  catalogRootRel: string;
  projectSlug?: string;
  catalogProjectDir?: string;
  catalogProjectDirRel?: string;
}

function toRel(abs: string): string {
  const root = getWorkspaceRoot();
  const rel = path.relative(root, abs);
  return rel.split(path.sep).join('/');
}

export function getStoragePathsInfo(sessionId?: string): StoragePathsInfo {
  const workspaceRoot = getWorkspaceRoot();
  const catalogRoot = getGeneratedIconsRoot();
  const info: StoragePathsInfo = {
    workspaceRoot,
    catalogRoot,
    catalogRootRel: toRel(catalogRoot),
  };

  if (!sessionId) return info;

  const paths = getSessionPaths(sessionId);
  info.sessionId = sessionId;
  info.sessionRendersDir = paths.rendersDir;
  info.sessionRendersDirRel = toRel(paths.rendersDir);

  if (fileExists(paths.styleDna)) {
    const dna = readJsonFile(paths.styleDna, StyleDNASchema);
    info.projectSlug = dna.projectSlug;
    info.catalogProjectDir = path.join(catalogRoot, dna.projectSlug);
    info.catalogProjectDirRel = toRel(info.catalogProjectDir);
  }

  return info;
}

/** Count cards with render ready to publish (QA ok, not skipped). */
export function countPublishReady(paths: SessionPaths): number {
  return listPublishReadyCardIds(paths).length;
}
