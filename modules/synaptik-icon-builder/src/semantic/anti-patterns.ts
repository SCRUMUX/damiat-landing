/** Phrases that weaken Flux semantic grounding — banned in visualObject / subject. */
export const SEMANTIC_ANTI_PATTERNS: RegExp[] = [
  /\babstract\s+symbol\b/i,
  /\bconceptual\s+icon\b/i,
  /\bmetaphorical\s+representation\b/i,
  /\benterprise\s+concept\b/i,
  /\bbusiness\s+abstraction\b/i,
  /\brepresenting:\s*/i,
  /\babstract\s+\w+\s+symbol\s+representing\b/i,
];

export function findAntiPatterns(text: string): string[] {
  const hits: string[] = [];
  for (const re of SEMANTIC_ANTI_PATTERNS) {
    if (re.test(text)) hits.push(re.source);
  }
  return hits;
}

export function hasAntiPattern(text: string): boolean {
  return findAntiPatterns(text).length > 0;
}

export const ANTI_PATTERN_PROMPT_RULES = `
Never use: abstract symbol, conceptual icon, metaphorical representation, enterprise concept, business abstraction, "representing:".
Describe one recognizable physical object or process artifact in plain English.
Never copy the raw card title into visualObject.
`.trim();
