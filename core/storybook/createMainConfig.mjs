/**
 * Node-evaluated Storybook main config (consumer installs).
 * Keep in sync with createMainConfig.ts — monorepo imports the TS source directly.
 */
import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';

function resolvePackageRoots(mode, storybookDir, projectRoot) {
  if (mode === 'monorepo') {
    return [path.resolve(storybookDir, '../..'), projectRoot];
  }
  return [projectRoot, path.join(projectRoot, 'node_modules/@ai-ds/core')];
}

function aliasEngineStyles(alias, importId, roots, resolveCss) {
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

function storyGlobs(opts) {
  const { mode, extraStories = [] } = opts;

  if (mode === 'monorepo') {
    return [
      '../../components/**/*.stories.@(ts|tsx)',
      '../../layout/**/*.stories.@(ts|tsx)',
      '../../blocks/**/*.stories.@(ts|tsx)',
      '../src/**/*.stories.@(ts|tsx)',
      ...extraStories,
    ];
  }

  return [
    '../node_modules/@ai-ds/core/components/**/*.stories.@(ts|tsx)',
    '../node_modules/@ai-ds/core/layout/**/*.stories.@(ts|tsx)',
    '../node_modules/@ai-ds/core/blocks/**/*.stories.@(ts|tsx)',
    '../src/**/*.stories.@(ts|tsx)',
    ...extraStories,
  ];
}

export function createMainConfig(opts) {
  const { storybookDir, projectRoot, mode } = opts;
  const nodeModules = path.join(projectRoot, 'node_modules');

  return {
    framework: {
      name: '@storybook/react-vite',
      options: {},
    },

    stories: storyGlobs(opts),

    addons: ['@storybook/addon-essentials', '@storybook/addon-viewport'],

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
        ...(cfg.resolve.alias ?? {}),
        react: path.join(nodeModules, 'react'),
        'react-dom': path.join(nodeModules, 'react-dom'),
        '@storybook/addon-viewport': path.join(nodeModules, '@storybook/addon-viewport'),
      };

      const engineRoots = resolvePackageRoots(mode, storybookDir, projectRoot);
      const alias = cfg.resolve.alias;
      aliasEngineStyles(alias, 'vaul/style.css', engineRoots, (req) => {
        const entry = req.resolve('vaul');
        return path.join(path.dirname(entry), '..', 'style.css');
      });
      aliasEngineStyles(alias, 'sonner/dist/styles.css', engineRoots, (req) => {
        return req.resolve('sonner/dist/styles.css');
      });

      if (mode === 'monorepo') {
        const repoRoot = path.resolve(storybookDir, '../..');
        alias['@ai-ds/core/tokens'] = path.join(repoRoot, 'config/css-variables/tokens.css');
        alias['@ai-ds/core/storybook/engine-styles'] = path.join(
          repoRoot,
          'storybook/engine-styles.ts',
        );
        alias['@ai-ds/core/storybook/createPreview'] = path.join(
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
      }

      if (mode === 'consumer') {
        const coreRoot = path.join(projectRoot, 'node_modules/@ai-ds/core');
        alias['@ai-ds/core/tokens'] = path.join(coreRoot, 'config/css-variables/tokens.css');
        alias['@ai-ds/core/storybook/engine-styles'] = path.join(
          coreRoot,
          'storybook/engine-styles.ts',
        );
        alias['@ai-ds/core/storybook/createPreview'] = path.join(
          coreRoot,
          'storybook/createPreview.tsx',
        );
        alias['@ai-ds/core/storybook/marketingViewports'] = path.join(
          coreRoot,
          'storybook/marketingViewports.ts',
        );
        cfg.server = cfg.server ?? {};
        cfg.server.fs = cfg.server.fs ?? {};
        cfg.server.fs.allow = [...(cfg.server.fs.allow ?? []), coreRoot];
      }

      return cfg;
    },
  };
}
