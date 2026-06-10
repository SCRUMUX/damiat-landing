import fs from 'node:fs';
import path from 'node:path';
import type { IconSetStyleId } from './icon-set-styles/index.js';
import { parseIconSetStyleId } from './icon-set-styles/index.js';
import { getWorkspaceRoot } from './workspace-root.js';

export interface SynaptikConfig {
  /** Relative to workspace root or absolute. Default: `generated-icons` */
  outputDir?: string;
  projectSlug?: string;
  iconSetStyleId?: IconSetStyleId;
}

const DEFAULT_OUTPUT_DIR = 'generated-icons';

let cachedConfig: SynaptikConfig | null | undefined;

function readConfigFile(workspaceRoot: string): SynaptikConfig | null {
  const jsonPath = path.join(workspaceRoot, 'synaptik.config.json');
  if (fs.existsSync(jsonPath)) {
    try {
      return JSON.parse(fs.readFileSync(jsonPath, 'utf8')) as SynaptikConfig;
    } catch {
      return null;
    }
  }
  return null;
}

export function loadSynaptikConfig(force = false): SynaptikConfig {
  if (!force && cachedConfig !== undefined) {
    return cachedConfig ?? {};
  }

  const fromFile = readConfigFile(getWorkspaceRoot()) ?? {};
  const iconSetStyleId = parseIconSetStyleId(
    process.env.SYNAPTIK_ICON_SET_STYLE ?? fromFile.iconSetStyleId,
  );

  cachedConfig = {
    outputDir:
      process.env.SYNAPTIK_ICONS_DIR?.trim() ||
      fromFile.outputDir ||
      DEFAULT_OUTPUT_DIR,
    projectSlug: process.env.SYNAPTIK_PROJECT_SLUG?.trim() || fromFile.projectSlug,
    iconSetStyleId: iconSetStyleId ?? fromFile.iconSetStyleId,
  };
  return cachedConfig;
}

export function resolveGeneratedIconsRoot(config?: SynaptikConfig): string {
  const cfg = config ?? loadSynaptikConfig();
  const dir = cfg.outputDir?.trim() || DEFAULT_OUTPUT_DIR;
  return path.isAbsolute(dir) ? dir : path.join(getWorkspaceRoot(), dir);
}

export function resetSynaptikConfigCache(): void {
  cachedConfig = undefined;
}
