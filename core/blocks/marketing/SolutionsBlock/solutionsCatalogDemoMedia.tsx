import type { SolutionsBlockProps, SolutionCatalogItem } from './SolutionsBlock.types';
import { SOLUTION_CATALOG_DEMO_ICONS } from './SolutionCatalogIcons';
function attachCatalogIcon(item: SolutionCatalogItem): SolutionCatalogItem {
  if (item.icon || !item.id) return item;

  const icon = SOLUTION_CATALOG_DEMO_ICONS[item.id as keyof typeof SOLUTION_CATALOG_DEMO_ICONS];
  return icon ? { ...item, icon } : item;
}

/** Attach mock SVG icons to catalog demo items by `id`. */
export function withSolutionCatalogIcons(
  props: Extract<SolutionsBlockProps, { variant: 'catalog' }>,
): Extract<SolutionsBlockProps, { variant: 'catalog' }> {
  return {
    ...props,
    items: props.items.map(attachCatalogIcon),
  };
}
