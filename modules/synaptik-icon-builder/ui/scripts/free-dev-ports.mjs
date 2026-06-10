#!/usr/bin/env node
/**
 * Free Synaptik UI (:3740) and API (:3742) before dev.
 */
import { execSync } from 'node:child_process';

const ports = [
  Number(process.env.SYNAPTIK_UI_PORT ?? 3740),
  Number(process.env.SYNAPTIK_API_PORT ?? 3742),
];

function killPortWindows(port) {
  let out = '';
  try {
    out = execSync(`netstat -ano -p tcp | findstr LISTENING | findstr :${port}`, {
      encoding: 'utf8',
      windowsHide: true,
    });
  } catch {
    return;
  }
  const pids = new Set();
  for (const line of out.split(/\r?\n/)) {
    if (!/LISTENING/i.test(line)) continue;
    const parts = line.trim().split(/\s+/);
    const pid = parts[parts.length - 1];
    if (pid && /^\d+$/.test(pid) && pid !== '0') pids.add(pid);
  }
  for (const pid of pids) {
    try {
      execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore', windowsHide: true });
      console.log(`[synaptik] Stopped PID ${pid} (port ${port})`);
    } catch {
      // ignore
    }
  }
}

function killPortUnix(port) {
  try {
    execSync(`lsof -ti tcp:${port} | xargs -r kill -9`, {
      stdio: 'ignore',
      shell: true,
    });
    console.log(`[synaptik] Freed port ${port}`);
  } catch {
    // ignore
  }
}

for (const port of ports) {
  if (process.platform === 'win32') killPortWindows(port);
  else killPortUnix(port);
}
