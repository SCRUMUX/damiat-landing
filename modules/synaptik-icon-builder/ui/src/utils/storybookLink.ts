/** Storybook CSF-style slug (matches @storybook/csf slugify). */
export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+)|(-+$)/g, '');
}

export const GENERATED_ICONS_TITLE = 'Generated Icons';

/** CSF export name for the empty catalog story (must match GeneratedIcons.stories.tsx). */
export const GENERATED_ICONS_CATALOG_STORY = 'Index';

/** Storybook `?path=` for empty catalog (shared with storybook/generatedIconsRedirect.ts). */
export const GENERATED_ICONS_CATALOG_PATH = `/story/${slugify(GENERATED_ICONS_TITLE)}--${slugify(GENERATED_ICONS_CATALOG_STORY)}`;

/**
 * Use project deep link only when that project is published (registry or explicit slug list).
 * Avoids links to deleted folders like agriculture-technology after cleanup.
 */
export function resolveStorybookProjectSlug(
  projectSlug: string | undefined,
  publishedSlugs: Iterable<string>,
): string | undefined {
  const wanted = projectSlug?.trim();
  if (!wanted) return undefined;
  const set = new Set(publishedSlugs);
  return set.has(wanted) ? wanted : undefined;
}

/** Story path segment for Storybook 8 (`?path=` value). */
export function generatedIconsStoryPath(projectSlug?: string): string {
  if (projectSlug?.trim()) {
    const title = `${GENERATED_ICONS_TITLE}/${projectSlug.trim()}`;
    return `/story/${slugify(title)}--${slugify('All icons')}`;
  }
  return GENERATED_ICONS_CATALOG_PATH;
}

export function buildStorybookUrl(origin: string, projectSlug?: string): string {
  const base = origin.replace(/\/$/, '');
  const path = generatedIconsStoryPath(projectSlug);
  return `${base}/?path=${encodeURIComponent(path)}`;
}

export function resolveStorybookOrigin(env: NodeJS.ProcessEnv = process.env): string {
  const explicit = env.SYNAPTIK_STORYBOOK_ORIGIN?.trim();
  if (explicit) return explicit.replace(/\/$/, '');
  const port = env.STORYBOOK_PORT?.trim() || '6006';
  const host = env.STORYBOOK_HOST?.trim() || '127.0.0.1';
  return `http://${host}:${port}`;
}
