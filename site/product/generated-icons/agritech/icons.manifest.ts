/**
 * Stub manifest when raster PNG/WebP assets are not committed.
 * Replace by running Synaptik publish in the product workspace.
 */

const placeholder = (label: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="16" fill="#14532d"/><text x="64" y="72" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" fill="#f8fafc">${label.slice(0, 12)}</text></svg>`,
  )}`;

function entry(slug: string, sourceCard = slug) {
  const src = placeholder(slug);
  return {
    png: src,
    webp: src,
    meta: { sourceCard, style: 'Damiat', iconSlug: slug } as const,
  };
}

const SLUGS = [
  '12-17', '24-7', '6', 'co2',
  'card-00904f5c23', 'card-343a0cd4df', 'card-35195232a8', 'card-3ad7260126',
  'card-40c9ccfc45', 'card-43a44f1f5a', 'card-49337256ec', 'card-4e104b1c87',
  'card-52257113ea', 'card-538b6cb267', 'card-574a74e0f8', 'card-5badf82455',
  'card-6abcafe7fa', 'card-6e3b768aa8', 'card-7fe8be0e6a', 'card-83888742fd',
  'card-8a270b4af6', 'card-9068874dff', 'card-96f67de640', 'card-abb0ad49a9',
  'card-b19e135931', 'card-c9df3dc074', 'card-da1bb29476', 'card-e5990fea2b',
  'card-f15224e653',
] as const;

export const iconsBySlug = Object.fromEntries(
  SLUGS.map((slug) => [slug, entry(slug)]),
) as Record<(typeof SLUGS)[number], ReturnType<typeof entry>>;

export type GeneratedIconSlug = keyof typeof iconsBySlug;

export function getGeneratedIcon(slug: GeneratedIconSlug) {
  return iconsBySlug[slug];
}
