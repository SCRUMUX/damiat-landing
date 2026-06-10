import { findAntiPatterns } from '../semantic/anti-patterns.js';

export interface PromptAuditReport {
  styleWeight: number;
  semanticWeight: number;
  subjectWeight: number;
  compositionWeight: number;
  identifiedIssues: string[];
}

const CYRILLIC = /[\u0400-\u04FF]/;
const SECTION_MARKERS = {
  subject: /^===?\s*SUBJECT\s*BLOCK\s*===?/im,
  style: /^===?\s*STYLE\s*BLOCK\s*===?/im,
  composition: /^===?\s*COMPOSITION\s*BLOCK\s*===?/im,
  legacySubject: /^Icon subject:/im,
};

function splitSections(prompt: string): {
  subject: string;
  style: string;
  composition: string;
} {
  const subjectMarker =
    prompt.match(SECTION_MARKERS.subject) ??
    prompt.match(SECTION_MARKERS.legacySubject);
  const styleMarker = prompt.match(SECTION_MARKERS.style);
  const compMarker = prompt.match(SECTION_MARKERS.composition);

  if (subjectMarker && styleMarker) {
    const si = subjectMarker.index ?? 0;
    const sti = styleMarker.index ?? prompt.length;
    const ci = compMarker?.index ?? prompt.length;
    return {
      subject: prompt.slice(si, sti),
      style: prompt.slice(sti, ci),
      composition: prompt.slice(ci),
    };
  }

  const legacySubject = prompt.match(/Icon subject:\s*([\s\S]*?)(?=\n\nSolid white|$)/i);
  if (legacySubject) {
    const before = prompt.slice(0, legacySubject.index ?? 0);
    const tail = prompt.slice((legacySubject.index ?? 0) + legacySubject[0].length);
    return {
      subject: legacySubject[1] ?? '',
      style: before,
      composition: tail,
    };
  }

  return { subject: '', style: prompt, composition: '' };
}

function weightChars(part: string, total: number): number {
  if (total <= 0) return 0;
  return Math.min(1, part.trim().length / total);
}

export function auditPrompt(fullPrompt: string): PromptAuditReport {
  const issues: string[] = [];
  const total = Math.max(fullPrompt.length, 1);
  const { subject, style, composition } = splitSections(fullPrompt);

  const styleWeight = weightChars(style, total);
  const subjectWeight = weightChars(subject, total);
  const compositionWeight = weightChars(composition, total);

  const subjectBody = subject.replace(/^Icon subject:\s*/i, '').trim();
  let semanticWeight = 0;
  if (subjectBody.length >= 40 && !CYRILLIC.test(subjectBody)) {
    semanticWeight = 0.7;
  }
  if (
    /\b(storage|sensor|crate|chart|clock|droplet|fruit|coin|gauge|network)\b/i.test(
      subjectBody,
    )
  ) {
    semanticWeight = Math.min(1, semanticWeight + 0.3);
  }

  if (CYRILLIC.test(subjectBody)) {
    issues.push('cyrillic_in_subject');
  }
  if (/abstract\s+.*\s+symbol\s+representing/i.test(subjectBody)) {
    issues.push('subject_replaced_by_card_title_fallback');
  }
  if (findAntiPatterns(subjectBody).length > 0) {
    issues.push('semantic_anti_pattern_in_subject');
  }
  if (subjectBody.length < 40) {
    issues.push('subject_too_short');
  }
  if (style.split('\n').filter(Boolean).length > 15) {
    issues.push('style_block_bloat');
  }
  const noEnvCount = (fullPrompt.match(/\bno environment\b/gi) ?? []).length;
  if (noEnvCount > 2) {
    issues.push('duplicate_guardrail_lines');
  }
  if (/\bphotorealistic\b/i.test(subjectBody)) {
    issues.push('photoreal_in_subject');
  }
  if (styleWeight > 0.55 && subjectWeight < 0.15) {
    issues.push('style_dominates_subject');
  }

  return {
    styleWeight: Math.round(styleWeight * 100) / 100,
    semanticWeight: Math.round(semanticWeight * 100) / 100,
    subjectWeight: Math.round(subjectWeight * 100) / 100,
    compositionWeight: Math.round(compositionWeight * 100) / 100,
    identifiedIssues: issues,
  };
}
