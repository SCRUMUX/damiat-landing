#!/usr/bin/env node
/**
 * Start Storybook on a fixed port after freeing stale listeners (Windows-friendly).
 *
 * Usage:
 *   node scripts/storybook-dev.mjs              # playground (monorepo catalog)
 *   node scripts/storybook-dev.mjs .          # current dir (consumer fixture)
 *   node scripts/storybook-dev.mjs path/to/project
 */
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

/** DAMIAT local dev port (default Storybook is 6006). Override via STORYBOOK_PORT or repo-root `.env`. */
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
const defaultProjectDir = path.join(repoRoot, 'playground');
const projectArg = process.argv[2];
const projectDir = projectArg
  ? path.resolve(process.cwd(), projectArg)
  : defaultProjectDir;

function killPort(port) {
  if (process.platform !== 'win32') {
    try {
      execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: 'ignore', shell: true });
    } catch {
      // port free
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
        // already gone
      }
    }
  } catch {
    // port free
  }
}

killPort(PORT);

console.log(`Starting Storybook in ${projectDir}`);
console.log(`Local: http://localhost:${PORT}/`);

const result = spawnSync(
  'npx',
  ['storybook', 'dev', '-p', PORT, '--no-open', '--ci'],
  {
    cwd: projectDir,
    stdio: 'inherit',
    shell: true,
  },
);

process.exit(result.status ?? 1);
