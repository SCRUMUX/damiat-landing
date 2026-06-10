#!/usr/bin/env node
/**
 * Full Storybook reset: prune generated-icons orphans, fix stories, clear cache, free port.
 * Usage: node scripts/storybook-reset.mjs
 */
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const playground = path.join(repoRoot, 'playground');
const DEFAULT_PORT = '6016';

function loadRepoEnv() {
  const envPath = path.join(repoRoot, '.env');
  try {
    for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (key && process.env[key] === undefined) process.env[key] = value;
    }
  } catch {
    // no .env
  }
}

loadRepoEnv();

const PORT = process.env.STORYBOOK_PORT ?? DEFAULT_PORT;

function killPort(port) {
  if (process.platform !== 'win32') {
    try {
      execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: 'ignore', shell: true });
    } catch {
      // free
    }
    return;
  }
  try {
    const out = execSync(`netstat -ano | findstr ":${port}"`, { encoding: 'utf8' });
    const pids = new Set();
    for (const line of out.split(/\r?\n/)) {
      if (line.includes('LISTENING')) {
        const pid = line.trim().split(/\s+/).at(-1);
        if (pid && /^\d+$/.test(pid)) pids.add(pid);
      }
    }
    for (const pid of pids) {
      try {
        execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
      } catch {
        // gone
      }
    }
  } catch {
    // free
  }
}

killPort(PORT);

for (const cacheDir of [
  path.join(playground, 'node_modules', '.cache'),
  path.join(repoRoot, 'node_modules', '.cache'),
]) {
  if (fs.existsSync(cacheDir)) {
    fs.rmSync(cacheDir, { recursive: true, force: true });
    console.log(`Cleared ${path.relative(repoRoot, cacheDir)}`);
  }
}

execSync('node scripts/storybook-prep.mjs', { cwd: repoRoot, stdio: 'inherit' });

try {
  execSync('npm run synaptik:fix-stories', { cwd: repoRoot, stdio: 'inherit' });
} catch {
  console.warn('synaptik:fix-stories skipped or failed (non-fatal)');
}

if (!fs.existsSync(path.join(playground, 'node_modules', 'storybook'))) {
  console.log('Installing playground dependencies…');
  execSync('npm ci', { cwd: playground, stdio: 'inherit' });
}

console.log(`\nStarting Storybook at http://127.0.0.1:${PORT}/\n`);
const result = spawnSync('npm', ['run', 'storybook'], {
  cwd: playground,
  stdio: 'inherit',
  shell: true,
});

process.exit(result.status ?? 1);
