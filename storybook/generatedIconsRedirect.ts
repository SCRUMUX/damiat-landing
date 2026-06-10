/**
 * Redirect stale Generated Icons deep links (e.g. after registry cleanup)
 * to the catalog Index story. Runs in browser before Storybook renders.
 */
import registry from '../generated-icons/registry.json';

export const GENERATED_ICONS_CATALOG_PATH = '/story/generated-icons--index';

export function publishedProjectSlugs(): Set<string> {
  const icons = (registry as { icons?: Array<{ projectSlug: string }> }).icons ?? [];
  return new Set(icons.map((i) => i.projectSlug));
}

/** Parse `?path=/story/generated-icons-{slug}--all-icons` */
export function projectSlugFromStoryPath(pathParam: string | null): string | null {
  if (!pathParam) return null;
  const decoded = decodeURIComponent(pathParam);
  const m = decoded.match(/generated-icons-([^/]+)--all-icons/);
  return m?.[1] ?? null;
}

export function applyStaleGeneratedIconsRedirect(): void {
  if (typeof window === 'undefined') return;
  redirectStaleGeneratedIconsStoryPath(
    window.location.search,
    publishedProjectSlugs(),
    (next) => window.location.replace(next),
  );
}

/** Inline script for manager HTML — runs before the manager bundle selects a story. */
export function buildStaleGeneratedIconsManagerHeadScript(): string {
  const slugs = [...publishedProjectSlugs()];
  const slugsJson = JSON.stringify(slugs);
  const catalogPath = JSON.stringify(GENERATED_ICONS_CATALOG_PATH);
  return `<script>
(function () {
  var published = ${slugsJson};
  var catalogPath = ${catalogPath};
  var search = window.location.search;
  if (!search) return;
  var params = new URLSearchParams(search);
  var pathParam = params.get('path');
  if (!pathParam) return;
  var decoded = decodeURIComponent(pathParam);
  var m = decoded.match(/generated-icons-([^/]+)--all-icons/);
  if (!m) return;
  if (published.indexOf(m[1]) !== -1) return;
  params.set('path', catalogPath);
  window.location.replace(window.location.pathname + '?' + params.toString() + window.location.hash);
})();
</script>`;
}

export function redirectStaleGeneratedIconsStoryPath(
  search: string,
  published: Set<string>,
  replace: (url: string) => void,
): void {
  const params = new URLSearchParams(search);
  const slug = projectSlugFromStoryPath(params.get('path'));
  if (!slug || published.has(slug)) return;

  params.set('path', GENERATED_ICONS_CATALOG_PATH);
  replace(`?${params.toString()}`);
}
