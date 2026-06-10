import type { StorybookConfig } from '@storybook/react-vite';
import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { buildStaleGeneratedIconsManagerHeadScript } from './generatedIconsRedirect';
import { generatedIconsStoryGlobs, resolveGeneratedIconsDir } from './generatedIconsStories';

export type StorybookMode = 'monorepo' | 'consumer';

export interface CreateMainConfigOptions {
  /** monorepo = AICADS repo playground; consumer = npm-installed @ai-ds/core */
  mode: StorybookMode;
  /** Absolute path to the `.storybook` directory */
  storybookDir: string;
  /** Absolute path to the Storybook project root (parent of `.storybook`) */
  projectRoot: string;
  /** Optional extra story globs relative to projectRoot */
  extraStories?: string[];
  /**
   * Synaptik raster catalog directory (absolute or relative to projectRoot).
   * When set, adds story globs and Vite `server.fs.allow` for PNG/WebP.
   */
  generatedIconsDir?: string;
}

function resolvePackageRoots(mode: StorybookMode, storybookDir: string, projectRoot: string): string[] {
  if (mode === 'monorepo') {
    return [path.resolve(storybookDir, '../..'), projectRoot];
  }
  return [projectRoot, path.join(projectRoot, 'node_modules/@ai-ds/core')];
}

/** Prevent dev HMR from watching static build output (breaks `/index.json` indexing). */
function ignoreStorybookStaticOutput(cfg: { server?: { watch?: { ignored?: string | string[] } } }) {
  cfg.server = cfg.server ?? {};
  const watch = cfg.server.watch ?? {};
  const ignorePattern = '**/storybook-static/**';
  const existing = watch.ignored;
  const ignored = Array.isArray(existing)
    ? [...existing, ignorePattern]
    : existing
      ? [existing, ignorePattern]
      : [ignorePattern];
  cfg.server.watch = { ...watch, ignored };
}

function aliasEngineStyles(
  alias: Record<string, string>,
  importId: string,
  roots: string[],
  resolveCss: (req: NodeRequire) => string | null,
): void {
  for (const root of roots) {
    try {
      const rootReq = createRequire(path.join(root, 'package.json'));
      const cssFile = resolveCss(rootReq);
      if (cssFile && fs.existsSync(cssFile)) {
        alias[importId] = cssFile;
        return;
      }
    } catch {
      // try next root
    }
  }
}

function storyGlobs(opts: CreateMainConfigOptions): string[] {
  const { mode, extraStories = [], projectRoot, storybookDir, generatedIconsDir } = opts;
  const generatedGlobs =
    generatedIconsDir !== undefined
      ? generatedIconsStoryGlobs({ projectRoot, storybookDir, generatedIconsDir })
      : [];

  if (mode === 'monorepo') {
    return [
      '../../components/**/*.stories.@(ts|tsx)',
      '../../layout/**/*.stories.@(ts|tsx)',
      '../../blocks/**/*.stories.@(ts|tsx)',
      '../src/**/*.stories.@(ts|tsx)',
      ...generatedGlobs,
      ...extraStories,
    ];
  }

  return [
    '../node_modules/@ai-ds/core/components/**/*.stories.@(ts|tsx)',
    '../node_modules/@ai-ds/core/layout/**/*.stories.@(ts|tsx)',
    '../node_modules/@ai-ds/core/blocks/**/*.stories.@(ts|tsx)',
    '../src/**/*.stories.@(ts|tsx)',
    ...generatedGlobs,
    ...extraStories,
  ];
}

export function createMainConfig(opts: CreateMainConfigOptions): StorybookConfig {
  const { storybookDir, projectRoot, mode, generatedIconsDir } = opts;
  const nodeModules = path.join(projectRoot, 'node_modules');
  const iconsCatalogDir =
    generatedIconsDir !== undefined
      ? resolveGeneratedIconsDir({ projectRoot, generatedIconsDir })
      : null;

  return {
    framework: {
      name: '@storybook/react-vite',
      options: {},
    },

    stories: storyGlobs(opts),

    addons: ['@storybook/addon-essentials', '@storybook/addon-viewport'],

    managerHead: (head) => `${head}\n${buildStaleGeneratedIconsManagerHeadScript()}`,

    docs: {
      autodocs: false,
    },

    typescript: {
      check: false,
      reactDocgen: false,
    },

    viteFinal: async (cfg) => {
      cfg.resolve = cfg.resolve ?? {};
      cfg.resolve.dedupe = ['react', 'react-dom'];
      cfg.resolve.alias = {
        ...(cfg.resolve.alias as Record<string, string> | undefined),
        react: path.join(nodeModules, 'react'),
        'react-dom': path.join(nodeModules, 'react-dom'),
        '@storybook/addon-viewport': path.join(nodeModules, '@storybook/addon-viewport'),
      };

      const engineRoots = resolvePackageRoots(mode, storybookDir, projectRoot);
      const alias = cfg.resolve.alias as Record<string, string>;
      aliasEngineStyles(alias, 'vaul/style.css', engineRoots, (req) => {
        const entry = req.resolve('vaul');
        return path.join(path.dirname(entry), '..', 'style.css');
      });
      aliasEngineStyles(alias, 'sonner/dist/styles.css', engineRoots, (req) => {
        return req.resolve('sonner/dist/styles.css');
      });

      const aliasMap = cfg.resolve.alias as Record<string, string>;

      cfg.assetsInclude = [
        ...((cfg.assetsInclude as string[] | undefined) ?? []),
        '**/*.png',
        '**/*.webp',
      ];

      if (mode === 'monorepo') {
        const repoRoot = path.resolve(storybookDir, '../..');
        aliasMap['@ai-ds/core/tokens'] = path.join(repoRoot, 'config/css-variables/tokens.css');
        aliasMap['@ai-ds/core/storybook/engine-styles'] = path.join(
          repoRoot,
          'storybook/engine-styles.ts',
        );
        aliasMap['@ai-ds/core/storybook/createPreview'] = path.join(
          repoRoot,
          'storybook/createPreview.tsx',
        );
        cfg.server = cfg.server ?? {};
        cfg.server.fs = cfg.server.fs ?? {};
        cfg.server.fs.allow = [
          ...(cfg.server.fs.allow ?? []),
          path.join(projectRoot, '..'),
          repoRoot,
        ];
        if (iconsCatalogDir) {
          cfg.server.fs.allow = [...cfg.server.fs.allow, iconsCatalogDir];
        }
      }

      if (mode === 'consumer') {
        const coreRoot = path.join(projectRoot, 'node_modules/@ai-ds/core');
        aliasMap['@ai-ds/core/tokens'] = path.join(coreRoot, 'config/css-variables/tokens.css');
        aliasMap['@ai-ds/core/storybook/engine-styles'] = path.join(
          coreRoot,
          'storybook/engine-styles.ts',
        );
        aliasMap['@ai-ds/core/storybook/createPreview'] = path.join(
          coreRoot,
          'storybook/createPreview.tsx',
        );
        aliasMap['@ai-ds/core/storybook/marketingViewports'] = path.join(
          coreRoot,
          'storybook/marketingViewports.ts',
        );
        cfg.server = cfg.server ?? {};
        cfg.server.fs = cfg.server.fs ?? {};
        cfg.server.fs.allow = [...(cfg.server.fs.allow ?? []), coreRoot];
        if (iconsCatalogDir) {
          cfg.server.fs.allow = [...cfg.server.fs.allow, iconsCatalogDir];
        }
      }

      ignoreStorybookStaticOutput(cfg);

      return cfg;
    },
  };
}
