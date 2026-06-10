import { fal } from '@fal-ai/client';
import { loadSynaptikEnv } from '../load-env.js';
import { MVP_DEFAULTS } from '../types/index.js';

loadSynaptikEnv();

export interface FluxGenerateOptions {
  seed?: number;
}

export interface FluxResult {
  imageUrl: string;
  seed: number;
  timings?: Record<string, number>;
}

function parseFalSteps(): number {
  const raw = process.env.SYNAPTIK_FAL_STEPS;
  if (!raw) return 4;
  const n = parseInt(raw, 10);
  if (Number.isNaN(n) || n < 1 || n > 12) return 4;
  return n;
}

function parseGuidanceScale(): number {
  const raw = process.env.SYNAPTIK_FAL_GUIDANCE;
  if (!raw) return 3.5;
  const n = parseFloat(raw);
  if (Number.isNaN(n) || n < 1 || n > 20) return 3.5;
  return n;
}

export async function generateIconImage(
  prompt: string,
  opts: FluxGenerateOptions = {},
): Promise<FluxResult> {
  const key = process.env.FAL_KEY;
  if (!key) throw new Error('FAL_KEY is required for image generation.');

  fal.config({ credentials: key });

  const input: Record<string, unknown> = {
    prompt,
    image_size: MVP_DEFAULTS.falImageSize,
    num_inference_steps: parseFalSteps(),
    guidance_scale: parseGuidanceScale(),
    num_images: MVP_DEFAULTS.falNumImages,
    output_format: 'png',
    acceleration: 'none',
  };

  if (opts.seed != null) {
    input.seed = opts.seed;
  }

  // Avoid CDN download (often blocked/timeouts on RU networks); image returns as data: URI.
  if (process.env.SYNAPTIK_FAL_SYNC_MODE !== '0') {
    input.sync_mode = true;
  }

  const result = await fal.subscribe(MVP_DEFAULTS.falModel, {
    input,
    logs: false,
  });

  const data = result.data as {
    images?: Array<{ url?: string }>;
    image?: { url?: string };
    seed?: number;
    timings?: Record<string, number>;
  };

  const url = data.images?.[0]?.url ?? data.image?.url;

  if (!url) throw new Error('fal.ai returned no image URL');

  return {
    imageUrl: url,
    seed: data.seed ?? opts.seed ?? 0,
    timings: data.timings,
  };
}

function parseDownloadTimeoutMs(): number {
  const raw = process.env.SYNAPTIK_FAL_DOWNLOAD_TIMEOUT_MS;
  if (!raw) return 120_000;
  const n = parseInt(raw, 10);
  if (Number.isNaN(n) || n < 5_000) return 120_000;
  return Math.min(n, 300_000);
}

function parseDownloadAttempts(): number {
  const raw = process.env.SYNAPTIK_FAL_DOWNLOAD_RETRIES;
  if (!raw) return 4;
  const n = parseInt(raw, 10);
  if (Number.isNaN(n) || n < 1) return 4;
  return Math.min(n, 8);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function decodeDataUriImage(url: string): Buffer | null {
  const trimmed = url.trim();
  const match = trimmed.match(/^data:([^;,]+)?;base64,(.+)$/i);
  if (!match) return null;
  try {
    const buf = Buffer.from(match[2], 'base64');
    return buf.byteLength > 64 ? buf : null;
  } catch {
    return null;
  }
}

/**
 * fal.subscribe returns a CDN URL or (with sync_mode) a data: URI.
 */
export async function downloadImage(url: string): Promise<Buffer> {
  const inline = decodeDataUriImage(url);
  if (inline) return inline;
  const attempts = parseDownloadAttempts();
  const timeoutMs = parseDownloadTimeoutMs();
  let lastMessage = 'unknown';

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(timeoutMs),
        headers: { Accept: 'image/png,image/*,*/*' },
        redirect: 'follow',
      });
      if (!res.ok) {
        lastMessage = `HTTP ${res.status}`;
        if (attempt < attempts) {
          await sleep(1500 * attempt);
          continue;
        }
        throw new Error(`Failed to download fal image: ${res.status}`);
      }
      const arr = await res.arrayBuffer();
      if (arr.byteLength < 64) {
        lastMessage = 'empty response body';
        if (attempt < attempts) {
          await sleep(1500 * attempt);
          continue;
        }
        throw new Error('fal image download returned empty body');
      }
      return Buffer.from(arr);
    } catch (e) {
      lastMessage = e instanceof Error ? e.message : String(e);
      if (attempt < attempts) {
        await sleep(1500 * attempt);
        continue;
      }
    }
  }

  throw new Error(
    `fal.ai generated the image but download failed after ${attempts} attempts (${lastMessage}). ` +
      'The PNG did not reach Synaptik — check VPN/firewall or retry «Сгенерировать». ' +
      `Timeout per attempt: ${timeoutMs}ms.`,
  );
}
