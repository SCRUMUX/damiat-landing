#!/usr/bin/env node
/**
 * Validates Storybook prerequisites before dev/build.
 * Usage: node scripts/storybook-prep.mjs [projectDir]
 * Default projectDir: playground/
 */
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const projectArg = process.argv[2];
const installedInNodeModules = scriptDir.includes(
  `${path.sep}node_modules${path.sep}@ai-ds${path.sep}core${path.sep}scripts`,
);

function resolveProjectRoot(arg) {
  if (arg) {
    return path.isAbsolute(arg) ? arg : path.resolve(installedInNodeModules ? process.cwd() : repoRoot, arg);
  }
  if (installedInNodeModules) {
    return process.cwd();
  }
  return path.join(repoRoot, 'playground');
}

const projectRoot = resolveProjectRoot(projectArg);

function projectRequire() {
  const pkgJson = path.join(projectRoot, 'package.json');
  if (!fs.existsSync(pkgJson)) {
    throw new Error(`Missing package.json in ${projectRoot}`);
  }
  return createRequire(pkgJson);
}

function resolveVaulCss(req) {
  try {
    const entry = req.resolve('vaul');
    const cssFile = path.join(path.dirname(entry), '..', 'style.css');
    return fs.existsSync(cssFile) ? cssFile : null;
  } catch {
    return null;
  }
}

const missing = [];

const corePackageJson = path.join(projectRoot, 'node_modules/@ai-ds/core/package.json');
if (!fs.existsSync(corePackageJson)) {
  missing.push('@ai-ds/core');
}

let requireFromProject;
try {
  requireFromProject = projectRequire();
} catch {
  missing.push('package.json (Storybook project root)');
}

if (requireFromProject) {
  try {
    requireFromProject.resolve('sonner/dist/styles.css');
  } catch {
    missing.push('sonner (Toast engine CSS)');
  }

  if (!resolveVaulCss(requireFromProject)) {
    missing.push('vaul (Drawer engine CSS)');
  }

  try {
    requireFromProject.resolve('@storybook/addon-viewport');
  } catch {
    missing.push('@storybook/addon-viewport');
  }
}

if (missing.length > 0) {
  console.error(`\nStorybook prerequisites missing in ${projectRoot}:\n`);
  for (const item of missing) {
    console.error(`  - ${item}`);
  }
  console.error('\nFrom the repo root run:\n');
  console.error('  npm ci');
  console.error(`  cd ${path.relative(repoRoot, projectRoot) || '.'} && npm ci\n`);
  process.exit(1);
}

console.log(`Storybook prerequisites OK (${path.relative(process.cwd(), projectRoot) || '.'})`);
