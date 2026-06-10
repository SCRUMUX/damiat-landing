/** Inline SVG → data URI for Storybook demo media (no static server required). */
export function svgDataUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
}
