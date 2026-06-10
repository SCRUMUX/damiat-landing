#!/usr/bin/env node
/**
 * One-off: rebrand DIAMAT/diamat/Diamat -> DAMIAT/damiat/Damiat in repo.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'storybook-static', '.api-temp']);

function transformContent(s) {
  return s
    .replaceAll('DIAMAT', 'DAMIAT')
    .replaceAll('Diamat', 'Damiat')
    .replaceAll('diamat', 'damiat');
}

function transformPath(p) {
  return p.replaceAll('DIAMAT', 'DAMIAT').replaceAll('Diamat', 'Damiat').replaceAll('diamat', 'damiat');
}

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

const allFiles = walk(ROOT);
const toMove = [];

for (const file of allFiles) {
  if (file.includes('rebrand-to-damiat.mjs')) continue;
  const rel = path.relative(ROOT, file);
  const newRel = transformPath(rel);
  if (newRel !== rel) toMove.push({ from: file, to: path.join(ROOT, newRel) });
}

// Deepest paths first
toMove.sort((a, b) => b.from.length - a.from.length);

for (const { from, to } of toMove) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  if (fs.existsSync(to)) fs.unlinkSync(to);
  fs.renameSync(from, to);
  console.log(`renamed: ${path.relative(ROOT, from)} -> ${path.relative(ROOT, to)}`);
}

const textFiles = walk(ROOT).filter((f) => {
  if (f.includes('rebrand-to-damiat.mjs')) return false;
  if (/\.(png|jpg|jpeg|gif|webp|pdf|woff2?|ico)$/i.test(f)) return false;
  return true;
});

for (const file of textFiles) {
  const raw = fs.readFileSync(file, 'utf8');
  const next = transformContent(raw);
  if (next !== raw) {
    fs.writeFileSync(file, next, 'utf8');
    console.log(`updated: ${path.relative(ROOT, file)}`);
  }
}

console.log('Done.');
