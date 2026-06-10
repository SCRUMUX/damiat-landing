import type { IconType } from '../semantic/types.js';

const ICON_TYPE_CATEGORY: Record<IconType, string> = {
  object: 'Product',
  process: 'Performance',
  business: 'Business',
  infrastructure: 'Product',
  analytics: 'Analytics',
};

/** Heuristic icon category for asset meta (TZ §9) without extra LLM call. */
export function inferIconCategory(
  cardTitle: string,
  industry: string,
  iconType?: IconType,
): string {
  if (iconType) {
    return ICON_TYPE_CATEGORY[iconType] ?? 'Business';
  }

  const t = cardTitle.toLowerCase();

  if (/profit|revenue|growth|finance|money|cost|price|sales/.test(t)) return 'Business';
  if (/monitor|sensor|data|analytics|report|dashboard|metric/.test(t)) return 'Analytics';
  if (/security|safe|protect|shield|lock/.test(t)) return 'Security';
  if (/support|help|service|contact/.test(t)) return 'Support';
  if (/product|module|feature|tool|platform/.test(t)) return 'Product';
  if (/team|user|people|customer/.test(t)) return 'People';
  if (/speed|fast|performance|efficien/.test(t)) return 'Performance';
  if (/eco|green|sustain|agro|farm|crop|harvest/.test(t)) return 'Sustainability';

  if (/agro|farm|tech/.test(industry.toLowerCase())) return 'AgroTech';
  return 'Business';
}
