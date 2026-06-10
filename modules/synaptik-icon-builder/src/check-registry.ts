import fs from 'node:fs';
import path from 'node:path';
import { readJsonFile } from './fs-json.js';
import { getGeneratedIconsRoot, getRegistryPath } from './paths.js';
import { RegistrySchema } from './types/index.js';
import { repairGeneratedIconsCatalog } from './pipeline/publish.js';

export interface CheckResult {
  ok: boolean;
  errors: string[];
}

export function checkRegistry(fixStories = false): CheckResult {
  const errors: string[] = [];
  const root = getGeneratedIconsRoot();
  const registryPath = getRegistryPath();

  if (fixStories) {
    const { republished, iconCount } = repairGeneratedIconsCatalog();
    if (republished.length > 0) {
      console.log(`Restored published icons: ${republished.join(', ')}`);
    }
    console.log(`Catalog: ${iconCount} icon(s) in registry`);
  }

  if (!fs.existsSync(registryPath)) {
    errors.push('Missing generated-icons/registry.json');
    return { ok: false, errors };
  }

  const registry = readJsonFile(registryPath, RegistrySchema);

  for (const icon of registry.icons) {
    const dir = path.join(root, icon.relativePath);
    for (const file of ['icon.png', 'icon.webp', 'meta.json']) {
      const p = path.join(dir, file);
      if (!fs.existsSync(p)) {
        errors.push(`Missing ${file} for ${icon.relativePath}`);
      }
    }
  }

  if (registry.icons.length > 0) {
    const slugs = [...new Set(registry.icons.map((i) => i.projectSlug))];
    for (const slug of slugs) {
      const storiesPath = path.join(root, slug, 'Icons.stories.tsx');
      if (!fs.existsSync(storiesPath)) {
        errors.push(`Missing generated-icons/${slug}/Icons.stories.tsx`);
      }
      const manifestPath = path.join(root, slug, 'icons.manifest.ts');
      if (!fs.existsSync(manifestPath)) {
        errors.push(`Missing generated-icons/${slug}/icons.manifest.ts`);
      }
    }
  }

  return { ok: errors.length === 0, errors };
}
