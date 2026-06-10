import fs from 'node:fs';
import path from 'node:path';
import type { ZodType, ZodTypeDef } from 'zod';

/** Parse JSON with Zod; return schema output type (defaults applied). */
export function readJsonFile<T>(
  filePath: string,
  schema?: ZodType<T, ZodTypeDef, unknown>,
): T {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing file: ${filePath}`);
  }
  const text = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  const raw = JSON.parse(text) as unknown;
  if (schema) return schema.parse(raw);
  return raw as T;
}

export function writeJsonFile(filePath: string, data: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}
