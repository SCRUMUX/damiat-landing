import { DEMO_PALETTE as C, DEMO_RADIUS as R } from './demoMediaPalette';
import { svgDataUri } from './svgDataUri';

function wordmark(label: string, accent: string): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 120" fill="none">
  <rect width="190" height="120" rx="${R.panel}" fill="${C.white}"/>
  <text x="95" y="68" text-anchor="middle" font-family="system-ui,sans-serif" font-size="22" font-weight="600" fill="${accent}">${label}</text>
</svg>`;
}

/** Third-party wordmarks keep vendor hues; tile shell uses AICADS surface tokens. */
const PARTNER_SVGS: Record<string, string> = {
  radix: wordmark('Radix UI', C.gray90),
  storybook: wordmark('Storybook', '#FF4785'),
  chromatic: wordmark('Chromatic', '#FC521F'),
  github: wordmark('GitHub', '#24292F'),
  figma: wordmark('Figma', '#A259FF'),
  eslint: wordmark('ESLint', '#4B32C3'),
  tailwind: wordmark('Tailwind', C.cyan50),
  typescript: wordmark('TypeScript', C.brandDeep),
  vite: wordmark('Vite', C.violet50),
  'api-extractor': wordmark('API Extractor', C.brandDeep),
  tokens: wordmark('Design Tokens', C.brandPrimary),
};

export function partnersDemoLogo(id: string): string | undefined {
  const svg = PARTNER_SVGS[id];
  return svg ? svgDataUri(svg) : undefined;
}
