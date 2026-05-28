/**
 * Shared utilities for ai-manifest.json build + check scripts.
 *
 * The manifest is the public semantic surface of @ai-ds/core: AI code
 * generators, the Figma plugin, and Replit-style assemblers read it to
 * discover available components, their role, backing engine, and contract.
 *
 * Source of truth:
 *   - components/index.ts (which components are publicly exported)
 *   - contracts/components/*.contract.json (which contracts exist on disk)
 *   - ai-manifest.json (curated role + engine metadata per component)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, '..');

const BARREL_PATH = path.join(ROOT, 'components', 'index.ts');
const CONTRACTS_DIR = path.join(ROOT, 'contracts', 'components');
export const MANIFEST_PATH = path.join(ROOT, 'ai-manifest.json');

/**
 * Lowercase-or-helper exports that the barrel re-exports but that are not
 * "components" in the manifest sense (e.g. `toast` is a function, not a
 * component). Listed explicitly so the checker doesn't false-positive.
 */
const NON_COMPONENT_EXPORTS = new Set(['toast']);

/**
 * Components that are intentionally not listed in the manifest because they
 * are mode-flags of another component (the Storybook visual-only variant).
 * Keep this list TINY and well-justified.
 */
const MANIFEST_EXEMPT = new Set([]);

/** Extract value exports from the public barrel. */
export function readBarrelExports() {
  const src = fs.readFileSync(BARREL_PATH, 'utf8');
  const exportRe = /^\s*export\s*\{([^}]+)\}\s*from\s*['"]\.\/primitives\/[^'"]+['"]/gm;
  const names = new Set();
  let m;
  while ((m = exportRe.exec(src)) !== null) {
    for (const raw of m[1].split(',')) {
      const name = raw.trim().replace(/\s+as\s+\w+/, '');
      if (!name) continue;
      if (NON_COMPONENT_EXPORTS.has(name)) continue;
      names.add(name);
    }
  }
  return names;
}

/** Read the set of contract filenames available on disk. */
export function readContractFiles() {
  return new Set(
    fs
      .readdirSync(CONTRACTS_DIR)
      .filter((f) => f.endsWith('.contract.json')),
  );
}

/**
 * Family contracts: when many components share one underlying contract,
 * declare the mapping here. Used for Skeleton family (Card/Chart/List/...)
 * that all consume the same Skeleton.contract.json.
 */
const FAMILY_CONTRACTS = {
  SkeletonCard: 'Skeleton.contract.json',
  SkeletonChart: 'Skeleton.contract.json',
  SkeletonList: 'Skeleton.contract.json',
  SkeletonPage: 'Skeleton.contract.json',
  SkeletonTable: 'Skeleton.contract.json',
};

/**
 * Resolve the contract file for a given component name.
 *   1. FAMILY_CONTRACTS overrides take priority (Skeleton family).
 *   2. Plain `<Name>.contract.json`.
 *   3. Hyphenated variant (`TableCell` -> `Table-Cell.contract.json`).
 * Returns null if none of those exist on disk.
 */
export function resolveContract(componentName, contractFiles) {
  const family = FAMILY_CONTRACTS[componentName];
  if (family && contractFiles.has(family)) return family;

  const plain = `${componentName}.contract.json`;
  if (contractFiles.has(plain)) return plain;

  const hyphenated = componentName.replace(/([a-z])([A-Z])/g, '$1-$2');
  const hyphenatedFile = `${hyphenated}.contract.json`;
  if (contractFiles.has(hyphenatedFile)) return hyphenatedFile;

  return null;
}

/** Read the current manifest as a parsed object. */
export function readManifest() {
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
}

/**
 * Build the *expected* manifest given the current barrel + contracts + the
 * existing role/engine annotations. Components present in the barrel but
 * missing from the manifest are flagged via `missingAnnotations`.
 */
export function buildExpectedManifest(currentManifest) {
  const barrel = readBarrelExports();
  const contracts = readContractFiles();
  const existing = currentManifest.components ?? {};

  const expectedComponents = {};
  const missingAnnotations = [];
  const orphanContracts = [];

  for (const name of barrel) {
    if (MANIFEST_EXEMPT.has(name)) continue;
    const meta = existing[name];
    if (!meta) {
      missingAnnotations.push(name);
      continue;
    }
    const contract = resolveContract(name, contracts);
    expectedComponents[name] = {
      role: meta.role,
      engine: meta.engine,
      contract,
      ...(meta.deprecated ? { deprecated: true } : {}),
      ...(meta.replacement ? { replacement: meta.replacement } : {}),
    };
  }

  for (const declared of Object.keys(existing)) {
    if (!barrel.has(declared) && !MANIFEST_EXEMPT.has(declared)) {
      orphanContracts.push(declared);
    }
  }

  const expected = {
    ...currentManifest,
    components: expectedComponents,
  };

  return { expected, missingAnnotations, orphanContracts };
}

/** Stable, pretty serialization with trailing newline. */
export function serializeManifest(manifest) {
  return JSON.stringify(manifest, null, 2) + '\n';
}
