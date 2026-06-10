import { auditPrompt, type PromptAuditReport } from './prompt-audit.js';
import { findAntiPatterns } from '../semantic/anti-patterns.js';

export interface PromptScore {
  styleCoverage: number;
  semanticCoverage: number;
  objectClarity: number;
  ambiguityRisk: number;
}

const CYRILLIC = /[\u0400-\u04FF]/;

export function parsePromptMinClarity(): number {
  const raw = process.env.SYNAPTIK_PROMPT_MIN_CLARITY;
  if (!raw) return 0.45;
  const n = parseFloat(raw);
  if (Number.isNaN(n) || n < 0 || n > 1) return 0.45;
  return n;
}

export function scorePrompt(
  fullPrompt: string,
  visualObject?: string,
): PromptScore & { audit: PromptAuditReport; issues: string[] } {
  const audit = auditPrompt(fullPrompt);
  const issues = [...audit.identifiedIssues];

  const subjectMatch = fullPrompt.match(
    /=== SUBJECT BLOCK ===\s*([\s\S]*?)(?==== STYLE|$)/i,
  );
  const subjectBody =
    visualObject?.trim() ||
    subjectMatch?.[1]?.trim() ||
    fullPrompt.match(/Icon subject:\s*([^\n]+)/i)?.[1]?.trim() ||
    '';

  let objectClarity = audit.semanticWeight * 0.4 + audit.subjectWeight * 0.6;
  const vo = visualObject?.trim() ?? '';
  if (vo.length >= 12 && !CYRILLIC.test(vo) && !/^abstract\s/i.test(vo)) {
    objectClarity = Math.max(objectClarity, 0.72);
  }
  if (subjectBody.length >= 60) objectClarity += 0.15;
  if (CYRILLIC.test(subjectBody)) {
    objectClarity = 0.1;
    issues.push('cyrillic_blocks_clarity');
  }
  if (findAntiPatterns(subjectBody).length > 0) {
    objectClarity *= 0.4;
    issues.push('anti_pattern_blocks_clarity');
  }
  if (/^abstract\s/i.test(subjectBody)) {
    objectClarity *= 0.3;
  }
  objectClarity = Math.min(1, Math.max(0, objectClarity));

  const ambiguityRisk = Math.min(
    1,
    (findAntiPatterns(subjectBody).length > 0 ? 0.5 : 0) +
      (audit.identifiedIssues.includes('subject_replaced_by_card_title_fallback')
        ? 0.45
        : 0) +
      (subjectBody.length < 30 ? 0.25 : 0),
  );

  return {
    styleCoverage: Math.min(1, audit.styleWeight + 0.2),
    semanticCoverage: audit.semanticWeight,
    objectClarity: Math.round(objectClarity * 100) / 100,
    ambiguityRisk: Math.round(ambiguityRisk * 100) / 100,
    audit,
    issues,
  };
}

export function assertPromptQuality(
  fullPrompt: string,
  visualObject?: string,
  opts?: { force?: boolean },
): PromptScore & { audit: PromptAuditReport; issues: string[] } {
  const scored = scorePrompt(fullPrompt, visualObject);
  const min = parsePromptMinClarity();
  if (!opts?.force && scored.objectClarity < min) {
    const err = new Error(
      `Prompt quality too low (objectClarity=${scored.objectClarity}, min=${min}). Regenerate concepts or semantic layer.`,
    );
    (err as Error & { code: string; score: PromptScore }).code = 'PROMPT_QUALITY_LOW';
    (err as Error & { score: PromptScore }).score = scored;
    throw err;
  }
  return scored;
}
