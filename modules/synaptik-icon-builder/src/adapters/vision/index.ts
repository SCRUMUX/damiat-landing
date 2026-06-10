import { loadSynaptikEnv } from '../../load-env.js';
import { anthropicVisionJsonCompletion } from './anthropic.js';
import { openaiVisionJsonCompletion } from './openai.js';

loadSynaptikEnv();

export {
  listScreenshotPaths,
  listAnalyzeScreenshotPaths,
} from './images.js';

export interface VisionCallOptions {
  /** Skip image attachments (text-only, cheaper). */
  textOnly?: boolean;
  maxImages?: number;
}

export function getVisionProvider(): 'openai' | 'anthropic' {
  const p = (process.env.SYNAPTIK_VISION_PROVIDER ?? 'openai').toLowerCase();
  if (p === 'anthropic') return 'anthropic';
  return 'openai';
}

function resolveImagePaths(imagePaths: string[], opts?: VisionCallOptions): string[] {
  if (opts?.textOnly) return [];
  const max = opts?.maxImages ?? 4;
  return imagePaths.slice(0, max);
}

export async function visionJsonCompletion<T>(
  systemPrompt: string,
  userText: string,
  imagePaths: string[],
  opts?: VisionCallOptions,
): Promise<T> {
  const paths = resolveImagePaths(imagePaths, opts);
  const provider = getVisionProvider();
  if (provider === 'anthropic') {
    return anthropicVisionJsonCompletion<T>(systemPrompt, userText, paths);
  }
  return openaiVisionJsonCompletion<T>(systemPrompt, userText, paths);
}

export function useCombinedAnalyze(): boolean {
  return process.env.SYNAPTIK_COMBINED_ANALYZE === '1';
}
