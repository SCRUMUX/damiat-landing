import { DEMO_PALETTE as C, DEMO_RADIUS as R } from './demoMediaPalette';
import { svgDataUri } from './svgDataUri';

const SUPPORT_SVGS: Record<string, string> = {
  'response-time': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" fill="none">
  <rect width="640" height="360" fill="${C.gray80}"/>
  <circle cx="320" cy="180" r="96" stroke="${C.brandPrimary}" stroke-width="8" opacity="0.35"/>
  <circle cx="320" cy="180" r="72" stroke="${C.brandMid}" stroke-width="6"/>
  <path d="M320 132 V180 L356 204" stroke="${C.white}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="96" y="56" width="120" height="16" rx="${R.control}" fill="${C.brandDeep}" opacity="0.55"/>
  <rect x="424" y="288" width="120" height="16" rx="${R.control}" fill="${C.brandPrimary}" opacity="0.45"/>
</svg>`,
  patterns: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" fill="none">
  <rect width="640" height="480" fill="${C.gray80}"/>
  <rect x="72" y="88" width="160" height="120" rx="${R.section}" fill="${C.brandPrimary}"/>
  <rect x="240" y="88" width="160" height="120" rx="${R.section}" fill="${C.brandMid}" opacity="0.85"/>
  <rect x="408" y="88" width="160" height="120" rx="${R.section}" fill="${C.brandPrimary}" opacity="0.7"/>
  <rect x="156" y="232" width="328" height="120" rx="${R.section}" fill="${C.brandDeep}" opacity="0.75"/>
  <text x="320" y="300" text-anchor="middle" fill="${C.white}" font-size="48" font-family="sans-serif" font-weight="600">57+</text>
</svg>`,
  migrations: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" fill="none">
  <rect width="640" height="480" fill="${C.green99}"/>
  <path d="M120 320 H520" stroke="${C.teal10}" stroke-width="4" stroke-linecap="round"/>
  <circle cx="160" cy="320" r="20" fill="${C.teal10}"/>
  <circle cx="320" cy="320" r="20" fill="${C.green50}"/>
  <circle cx="480" cy="320" r="20" fill="${C.brandTint}"/>
  <rect x="200" y="120" width="240" height="140" rx="${R.section}" fill="${C.teal10}" opacity="0.85"/>
  <path d="M248 190 H392 M248 220 H360" stroke="${C.white}" stroke-width="6" stroke-linecap="round"/>
</svg>`,
  mobile: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 720" fill="none">
  <rect width="640" height="720" fill="${C.gray80}"/>
  <rect x="0" y="0" width="640" height="720" fill="url(#g)"/>
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="640" y2="720" gradientUnits="userSpaceOnUse">
      <stop stop-color="${C.brandDeep}"/>
      <stop offset="0.55" stop-color="${C.brandPrimary}"/>
      <stop offset="1" stop-color="${C.teal10}"/>
    </linearGradient>
  </defs>
  <circle cx="520" cy="120" r="64" fill="${C.white}" opacity="0.08"/>
  <circle cx="120" cy="560" r="96" fill="${C.white}" opacity="0.06"/>
</svg>`,
};

export const SUPPORT_DEMO_IMAGES: Record<string, string> = Object.fromEntries(
  Object.entries(SUPPORT_SVGS).map(([id, svg]) => [id, svgDataUri(svg)]),
);

export function supportDemoImage(id: string): string | undefined {
  return SUPPORT_DEMO_IMAGES[id];
}
