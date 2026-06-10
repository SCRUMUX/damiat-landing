import fs from 'node:fs';
import path from 'node:path';
import { readJsonFile, writeJsonFile } from '../fs-json.js';
import {
  getGeneratedIconDir,
  getGeneratedIconsRoot,
  getRegistryPath,
  getSessionPaths,
  getSessionsRoot,
  slugify,
  type SessionPaths,
} from '../paths.js';
import {
  AssetMetaSchema,
  RegistrySchema,
  StyleDNASchema,
  type IconRegistry,
} from '../types/index.js';
import { writeIconsManifest } from './publish-manifest.js';
import { dedupeRegistryByCardId } from './catalog-reconcile.js';
import { ContentCardsFileSchema } from '../types/index.js';

export interface PublishOptions {
  deferStorybookRegen?: boolean;
}

function copyFile(src: string, dest: string): void {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function findRenderDir(paths: SessionPaths, cardId: string): string {
  if (!fs.existsSync(paths.rendersDir)) {
    throw new Error(`No renders dir. Run: synaptik render --card ${cardId}`);
  }
  for (const name of fs.readdirSync(paths.rendersDir)) {
    const dir = path.join(paths.rendersDir, name);
    const metaPath = path.join(dir, 'meta.json');
    if (!fs.existsSync(metaPath)) continue;
    const meta = readJsonFile(metaPath, AssetMetaSchema);
    if (meta.cardId === cardId) return dir;
  }
  throw new Error(`No render for card "${cardId}". Run: synaptik render --card ${cardId}`);
}

export async function runPublish(
  paths: SessionPaths,
  cardId: string,
  opts: PublishOptions = {},
): Promise<{ projectSlug: string; iconSlug: string }> {
  const dna = readJsonFile(paths.styleDna, StyleDNASchema);
  const { cards } = readJsonFile(paths.contentCards, ContentCardsFileSchema);
  const card = cards.find((c) => c.id === cardId);
  if (!card) throw new Error(`Unknown card: ${cardId}`);

  const renderDir = findRenderDir(paths, cardId);
  const meta = readJsonFile(path.join(renderDir, 'meta.json'), AssetMetaSchema);
  if (meta.failedQa) {
    throw new Error(
      `Icon for card "${cardId}" failed quality checks. Re-run preview render before publishing.`,
    );
  }
  const iconSlug = slugify(cardId) || meta.iconSlug || path.basename(renderDir);
  const destDir = getGeneratedIconDir(dna.projectSlug, iconSlug);

  copyFile(path.join(renderDir, 'icon.png'), path.join(destDir, 'icon.png'));
  copyFile(path.join(renderDir, 'icon.webp'), path.join(destDir, 'icon.webp'));

  const publishedMeta = AssetMetaSchema.parse({
    ...meta,
    cardId: card.id,
    blockId: card.blockId ?? meta.blockId,
    blockTitle: card.blockTitle ?? meta.blockTitle,
    sourceCard: card.title,
    iconSlug,
    style: dna.styleLabel ?? meta.style,
    publishedAt: new Date().toISOString(),
  });
  writeJsonFile(path.join(destDir, 'meta.json'), publishedMeta);
  writeJsonFile(path.join(renderDir, 'meta.json'), publishedMeta);

  const registryPath = getRegistryPath();
  const registry = fs.existsSync(registryPath)
    ? readJsonFile(registryPath, RegistrySchema)
    : { version: 1 as const, icons: [] };

  const relativePath = `${dna.projectSlug}/${iconSlug}`;
  const entry = {
    projectSlug: dna.projectSlug,
    iconSlug,
    name: meta.name,
    category: meta.category,
    style: publishedMeta.style,
    styleLabel: dna.styleLabel,
    relativePath,
  };

  registry.icons = registry.icons.filter((i) => {
    if (i.projectSlug !== entry.projectSlug) return true;
    if (i.iconSlug === entry.iconSlug) return false;
    const oldMetaPath = path.join(getGeneratedIconsRoot(), i.relativePath, 'meta.json');
    if (fs.existsSync(oldMetaPath)) {
      const oldMeta = readJsonFile(oldMetaPath, AssetMetaSchema);
      if (oldMeta.cardId === cardId) return false;
    }
    return true;
  });
  registry.icons.push(entry);
  writeJsonFile(registryPath, registry);
  dedupeRegistryByCardId(dna.projectSlug);

  if (!opts.deferStorybookRegen) {
    regenerateStorybookStories();
  }

  return { projectSlug: dna.projectSlug, iconSlug };
}

function escapeForTs(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

const GENERATED_ICONS_ROOT_FILES = new Set([
  'README.md',
  'registry.json',
  'GeneratedIcons.stories.tsx',
  'SynaptikIndex.tsx',
  '.keep',
]);

function projectDirHasPublishedAssets(projectDir: string): boolean {
  if (!fs.existsSync(projectDir)) return false;
  for (const iconSlug of fs.readdirSync(projectDir)) {
    if (iconSlug.endsWith('.stories.tsx') || iconSlug.endsWith('.ts')) continue;
    const dir = path.join(projectDir, iconSlug);
    try {
      if (fs.statSync(dir).isDirectory() && isPublishedAssetDir(dir)) return true;
    } catch {
      continue;
    }
  }
  return false;
}

/** Remove empty project folders not in registry; keep dirs that still have published PNGs. */
export function pruneOrphanGeneratedIconProjects(activeSlugs: Iterable<string>): void {
  const root = getGeneratedIconsRoot();
  if (!fs.existsSync(root)) return;
  const active = new Set(activeSlugs);
  for (const name of fs.readdirSync(root)) {
    if (GENERATED_ICONS_ROOT_FILES.has(name)) continue;
    const full = path.join(root, name);
    let stat: fs.Stats;
    try {
      stat = fs.statSync(full);
    } catch {
      continue;
    }
    if (!stat.isDirectory()) continue;
    if (!active.has(name) && !projectDirHasPublishedAssets(full)) {
      fs.rmSync(full, { recursive: true, force: true });
    }
  }
}

function buildLegacyStoriesEmpty(): string {
  return `/**
 * AUTO-GENERATED by Synaptik publish. Index content lives in ./SynaptikIndex.tsx
 */
import type { StoryObj } from '@storybook/react';
import { SynaptikIndex } from './SynaptikIndex';

export default {
  title: 'Generated Icons',
  parameters: { layout: 'padded' },
};

type Story = StoryObj;
export const Index: Story = {
  name: 'Synaptik guide',
  render: () => <SynaptikIndex projectSlugs={[]} />,
};`;
}

function buildLegacyStoriesIndex(projectSlugs: string[]): string {
  const slugsJson = JSON.stringify(projectSlugs);
  return `/**
 * AUTO-GENERATED by Synaptik publish. Index content lives in ./SynaptikIndex.tsx
 */
import type { StoryObj } from '@storybook/react';
import { SynaptikIndex } from './SynaptikIndex';

export default {
  title: 'Generated Icons',
  parameters: { layout: 'padded' },
};

type Story = StoryObj;
const PROJECT_SLUGS = ${slugsJson} as const;

export const Index: Story = {
  name: 'Synaptik guide',
  render: () => <SynaptikIndex projectSlugs={[...PROJECT_SLUGS]} />,
};`;
}

type RegistryIcon = IconRegistry['icons'][number];

function isPublishedAssetDir(dir: string): boolean {
  return (
    fs.existsSync(path.join(dir, 'icon.png')) &&
    fs.existsSync(path.join(dir, 'icon.webp')) &&
    fs.existsSync(path.join(dir, 'meta.json'))
  );
}

/** Rebuild registry.json from icon folders already on disk (survives empty registry). */
export function rebuildRegistryFromDisk(): RegistryIcon[] {
  const root = getGeneratedIconsRoot();
  const icons: RegistryIcon[] = [];
  if (!fs.existsSync(root)) {
    writeJsonFile(getRegistryPath(), { version: 1, icons: [] });
    return [];
  }

  for (const projectSlug of fs.readdirSync(root)) {
    if (GENERATED_ICONS_ROOT_FILES.has(projectSlug)) continue;
    const projectDir = path.join(root, projectSlug);
    if (!fs.statSync(projectDir).isDirectory()) continue;

    let styleLabel: string | undefined;
    for (const iconSlug of fs.readdirSync(projectDir)) {
      if (iconSlug.endsWith('.stories.tsx')) continue;
      const dir = path.join(projectDir, iconSlug);
      if (!fs.statSync(dir).isDirectory() || !isPublishedAssetDir(dir)) continue;

      const meta = readJsonFile(path.join(dir, 'meta.json'), AssetMetaSchema);
      if (!meta.publishedAt) continue;

      if (!styleLabel && meta.sessionId) {
        const dnaPath = getSessionPaths(meta.sessionId).styleDna;
        if (fs.existsSync(dnaPath)) {
          const dna = readJsonFile(dnaPath, StyleDNASchema);
          styleLabel = dna.styleLabel;
        }
      }

      icons.push({
        projectSlug,
        iconSlug,
        name: meta.name,
        category: meta.category,
        style: meta.style,
        styleLabel,
        relativePath: `${projectSlug}/${iconSlug}`,
      });
    }
  }

  writeJsonFile(getRegistryPath(), { version: 1, icons });
  return icons;
}

/** Copy renders marked published back into generated-icons/ when files were pruned. */
export function republishMissingFromSessions(): string[] {
  const repaired: string[] = [];
  const sessionsRoot = getSessionsRoot();
  if (!fs.existsSync(sessionsRoot)) return repaired;

  for (const sessionId of fs.readdirSync(sessionsRoot)) {
    const paths = getSessionPaths(sessionId);
    if (!fs.existsSync(paths.styleDna) || !fs.existsSync(paths.rendersDir)) continue;

    const dna = readJsonFile(paths.styleDna, StyleDNASchema);

    for (const renderName of fs.readdirSync(paths.rendersDir)) {
      const renderDir = path.join(paths.rendersDir, renderName);
      const metaPath = path.join(renderDir, 'meta.json');
      if (!fs.existsSync(metaPath)) continue;

      const meta = readJsonFile(metaPath, AssetMetaSchema);
      if (!meta.publishedAt || !meta.cardId) continue;

      const iconSlug = meta.iconSlug ?? renderName;
      const destDir = getGeneratedIconDir(dna.projectSlug, iconSlug);
      if (isPublishedAssetDir(destDir)) continue;

      const png = path.join(renderDir, 'icon.png');
      const webp = path.join(renderDir, 'icon.webp');
      if (!fs.existsSync(png) || !fs.existsSync(webp)) continue;

      copyFile(png, path.join(destDir, 'icon.png'));
      copyFile(webp, path.join(destDir, 'icon.webp'));
      writeJsonFile(path.join(destDir, 'meta.json'), meta);
      repaired.push(`${dna.projectSlug}/${iconSlug}`);
    }
  }

  return repaired;
}

/** Restore pruned assets, sync registry, regenerate Storybook stories. */
export function repairGeneratedIconsCatalog(): {
  republished: string[];
  iconCount: number;
} {
  const republished = republishMissingFromSessions();
  const icons = rebuildRegistryFromDisk();
  dedupeRegistryByCardId();
  regenerateStorybookStories();
  return { republished, iconCount: icons.length };
}

export function regenerateStorybookStories(): void {
  rebuildRegistryFromDisk();
  const root = getGeneratedIconsRoot();
  const registryPath = getRegistryPath();
  const registry = fs.existsSync(registryPath)
    ? readJsonFile(registryPath, RegistrySchema)
    : { version: 1 as const, icons: [] };

  const slugs = [...new Set(registry.icons.map((i) => i.projectSlug))];
  pruneOrphanGeneratedIconProjects(slugs);

  for (const slug of slugs) {
    const icons = registry.icons.filter((i) => i.projectSlug === slug);
    const slugDir = path.join(root, slug);
    fs.mkdirSync(slugDir, { recursive: true });

    const metaBlocks = icons.map((icon) => {
      const metaFile = path.join(root, icon.relativePath, 'meta.json');
      const meta = readJsonFile(metaFile, AssetMetaSchema);
      const constName = icon.name.replace(/[^a-zA-Z0-9]/g, '') || 'Icon';
      return { icon, meta, constName };
    });

    const metaImports = metaBlocks
      .map(({ meta, constName }) => `const META_${constName} = ${JSON.stringify(meta)} as const;`)
      .join('\n');

    const pngImports = metaBlocks
      .map(({ icon, constName }) => {
        const png = `./${icon.iconSlug}/icon.png`;
        return `import png_${constName} from '${png}';`;
      })
      .join('\n');

    const srcImports = metaBlocks
      .map(({ constName }) => `const SRC_${constName} = png_${constName};`)
      .join('\n');

    const storyEntries = metaBlocks
      .map(({ icon, constName }) => {
        return `
export const Icon_${constName}: Story = {
  name: '${escapeForTs(icon.iconSlug)}',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 16 }}>
      <img src={SRC_${constName}} alt="${escapeForTs(icon.name)}" width={128} height={128} style={{ objectFit: 'contain' }} />
      <div style={{ fontSize: 12, color: '#64748b' }}>
        <strong>${escapeForTs(icon.name)}</strong> · ${escapeForTs(icon.category)}
      </div>
      <pre style={{ fontSize: 10, background: '#f1f5f9', padding: 8, borderRadius: 8, maxWidth: 320 }}>
        {JSON.stringify(META_${constName}, null, 2)}
      </pre>
    </div>
  ),
};`;
      })
      .join('\n');

    const gridItems = metaBlocks
      .map(({ icon, constName }) => {
        return `{ name: '${escapeForTs(icon.name)}', slug: '${escapeForTs(icon.iconSlug)}', src: SRC_${constName}, meta: META_${constName} }`;
      })
      .join(',\n  ');

    const blockGroups = new Map<string, typeof metaBlocks>();
    for (const block of metaBlocks) {
      const key =
        block.meta.blockTitle?.trim() ||
        block.meta.blockId?.trim() ||
        'Other';
      const list = blockGroups.get(key) ?? [];
      list.push(block);
      blockGroups.set(key, list);
    }

    const blockItemConstants = [...blockGroups.entries()]
      .map(([_blockTitle, blocks], sectionIdx) => {
        const items = blocks
          .map(({ icon, constName }) => {
            return `{ slug: '${escapeForTs(icon.iconSlug)}', src: SRC_${constName}, meta: META_${constName} }`;
          })
          .join(',\n  ');
        return `const BLOCK_${sectionIdx}_ITEMS = [\n  ${items},\n] as const;`;
      })
      .join('\n\n');

    const byBlocksSections = [...blockGroups.entries()]
      .map(([blockTitle, _blocks], sectionIdx) => {
        return `      <section key="block-${sectionIdx}" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, margin: '0 0 12px', color: '#334155' }}>${escapeForTs(blockTitle)}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
          {BLOCK_${sectionIdx}_ITEMS.map((item) => (
            <div key={item.slug} style={{ textAlign: 'center', padding: 12, border: '1px solid #e2e8f0', borderRadius: 8 }}>
              <img src={item.src} alt={item.slug} width={80} height={80} style={{ objectFit: 'contain' }} />
              <div style={{ fontSize: 11, marginTop: 8 }}>{item.slug}</div>
            </div>
          ))}
        </div>
      </section>`;
      })
      .join('\n');

    const content = `/**
 * AUTO-GENERATED by Synaptik publish. Do not edit manually.
 */
import type { StoryObj } from '@storybook/react';

export default {
  title: 'Generated Icons/${escapeForTs(slug)}',
  parameters: { layout: 'padded' },
};

type Story = StoryObj;

${pngImports}

${metaImports}

${srcImports}

const ALL_ICON_ITEMS = [
  ${gridItems || ''}
] as const;

${blockItemConstants}

export const AllIcons: Story = {
  name: 'All icons',
  render: () => {
    const items = ALL_ICON_ITEMS;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16, padding: 16 }}>
        {items.map((item) => (
          <div key={item.name} style={{ textAlign: 'center', padding: 12, border: '1px solid #e2e8f0', borderRadius: 8 }}>
            <img src={item.src} alt={item.name} width={80} height={80} style={{ objectFit: 'contain' }} />
            <div style={{ fontSize: 11, marginTop: 8 }}>{item.name}</div>
          </div>
        ))}
      </div>
    );
  },
};

export const ByBlocks: Story = {
  name: 'By blocks',
  render: () => (
    <div style={{ padding: 16 }}>
${byBlocksSections ? `      <>\n${byBlocksSections}\n      </>` : '      <p>No published icons yet.</p>'}
    </div>
  ),
};
${storyEntries}
`;

    fs.writeFileSync(path.join(slugDir, 'Icons.stories.tsx'), content, 'utf8');
    if (icons.length > 0) {
      writeIconsManifest(slug, slugDir, icons, root);
    }
  }

  const legacyPath = path.join(root, 'GeneratedIcons.stories.tsx');
  if (registry.icons.length === 0) {
    fs.writeFileSync(legacyPath, buildLegacyStoriesEmpty(), 'utf8');
  } else {
    fs.writeFileSync(legacyPath, buildLegacyStoriesIndex(slugs), 'utf8');
  }
}
