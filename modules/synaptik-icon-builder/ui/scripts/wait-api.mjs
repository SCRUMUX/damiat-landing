#!/usr/bin/env node
/** Wait until Synaptik API responds on /api/health before starting Vite. */
const port = process.env.SYNAPTIK_API_PORT ?? 3742;
const url = `http://127.0.0.1:${port}/api/health`;
const maxAttempts = 40;
const delayMs = 500;

for (let i = 1; i <= maxAttempts; i++) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      if (data?.features?.sessions) {
        console.log(`[synaptik] API ready on port ${port}`);
        process.exit(0);
      }
    }
  } catch {
    // retry
  }
  if (i === maxAttempts) {
    console.error(
      `[synaptik] API on port ${port} did not become ready. Run: npm run dev:reset`,
    );
    process.exit(1);
  }
  await new Promise((r) => setTimeout(r, delayMs));
}
