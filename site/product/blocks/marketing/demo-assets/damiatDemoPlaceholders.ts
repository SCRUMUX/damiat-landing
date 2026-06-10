/** SVG placeholders when production PNGs are not in the repo (local/Vercel build). */

function svgDataUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
}

function brandHero(label: string, accent = '#0d4f3c'): string {
  return svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="${accent}"/>
      <stop offset="100%" stop-color="#14532d"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#g)"/>
  <text x="960" y="540" text-anchor="middle" font-family="system-ui,sans-serif" font-size="42" fill="#f8fafc" opacity="0.4">${label}</text>
</svg>`);
}

export const damiatHeroMainPlaceholder = brandHero('DAMIAT Hero');
export const damiatHeroPlatformPlaceholder = brandHero('Platform', '#166534');
export const damiatHeroScenariosPlaceholder = brandHero('Scenarios', '#15803d');
export const damiatHeroCasePlaceholder = brandHero('Case study', '#14532d');
export const damiatHeroCtaPlaceholder = brandHero('Contact', '#064e3b');
export const damiatBridgePlaceholder = brandHero('Bridge', '#052e16');
