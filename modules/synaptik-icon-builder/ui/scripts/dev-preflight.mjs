#!/usr/bin/env node
/**
 * Block dev when API port is taken by an outdated server (no /api/sessions).
 */
import net from 'node:net';

const port = Number(process.env.SYNAPTIK_API_PORT ?? 3742);

function checkPort(p) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(p, '127.0.0.1');
  });
}

async function probeHealth(p) {
  try {
    const res = await fetch(`http://127.0.0.1:${p}/api/health`, {
      signal: AbortSignal.timeout(2500),
    });
    const text = await res.text();
    if (!res.ok) return { healthy: false, stale: res.status === 404 };
    const trimmed = text.trim();
    if (trimmed.startsWith('<')) return { healthy: false, stale: true };
    const data = JSON.parse(text);
    const sessions = Boolean(data?.features?.sessions);
    return { healthy: sessions, stale: !sessions };
  } catch {
    return { healthy: false, stale: true };
  }
}

const free = await checkPort(port);
if (free) {
  console.log(`[synaptik] API port ${port} is free.`);
  process.exit(0);
}

const probe = await probeHealth(port);
if (probe.healthy) {
  console.warn(
    `[synaptik] Port ${port} is in use, but /api/health looks OK. If the UI still errors, run: npm run dev:reset`,
  );
  process.exit(0);
}

console.error(
  `\n[synaptik] Port ${port} is occupied by an outdated API (no /api/sessions).\n` +
    `  Run: npm run dev:reset\n` +
    `  Or manually: netstat -ano | findstr :${port}  then  taskkill /PID <pid> /F\n`,
);
process.exit(1);
