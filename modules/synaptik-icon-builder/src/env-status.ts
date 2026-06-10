import path from 'node:path';
import { loadSynaptikEnv } from './load-env.js';

export interface SynaptikEnvStatus {
  fal: boolean;
  vision: boolean;
  openRouter: boolean;
  loadedFiles: string[];
}

/** Whether required API keys are present (never exposes values). */
export function getSynaptikEnvStatus(): SynaptikEnvStatus {
  loadSynaptikEnv();

  const fal = Boolean(process.env.FAL_KEY?.trim());
  const openAi = Boolean(process.env.OPENAI_API_KEY?.trim());
  const anthropic = Boolean(process.env.ANTHROPIC_API_KEY?.trim());
  const provider = (process.env.SYNAPTIK_VISION_PROVIDER ?? 'openai').toLowerCase();
  const vision = provider === 'anthropic' ? anthropic : openAi;
  const openRouter = /openrouter\.ai/i.test(process.env.OPENAI_BASE_URL ?? '');

  const loadedFiles = (process.env.SYNAPTIK_ENV_LOADED_FILES ?? '')
    .split(path.delimiter)
    .filter(Boolean);

  return { fal, vision, openRouter, loadedFiles };
}
