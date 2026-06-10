import fs from 'node:fs';
import { getSessionPaths } from '../paths.js';

/**
 * Deletes only `.synaptik/sessions/{sessionId}/`.
 * Does not touch `generated-icons/` or registry.
 */
export function deleteSession(sessionId: string): void {
  const { sessionDir } = getSessionPaths(sessionId);
  if (!fs.existsSync(sessionDir)) {
    throw new Error(`Session "${sessionId}" not found.`);
  }
  fs.rmSync(sessionDir, { recursive: true, force: true });
}
