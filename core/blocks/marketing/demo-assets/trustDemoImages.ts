import { DEMO_PALETTE as C, DEMO_RADIUS as R } from './demoMediaPalette';
import { svgDataUri } from './svgDataUri';

const TRUST_SVGS: Record<string, string> = {
  primitives: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" fill="none">
  <rect width="640" height="400" fill="${C.gray80}"/>
  <rect x="56" y="48" width="128" height="88" rx="14" fill="${C.brandPrimary}" opacity="0.9"/>
  <rect x="200" y="48" width="128" height="88" rx="14" fill="${C.brandMid}" opacity="0.75"/>
  <rect x="344" y="48" width="128" height="88" rx="14" fill="${C.brandPrimary}" opacity="0.6"/>
  <rect x="488" y="48" width="96" height="88" rx="14" fill="${C.brandPrimary}" opacity="0.45"/>
  <rect x="56" y="156" width="168" height="96" rx="14" fill="${C.brandDeep}" opacity="0.7"/>
  <rect x="240" y="156" width="168" height="96" rx="14" fill="${C.brandPrimary}" opacity="0.55"/>
  <rect x="424" y="156" width="160" height="96" rx="14" fill="${C.brandMid}" opacity="0.4"/>
  <rect x="120" y="272" width="400" height="80" rx="${R.section}" fill="${C.brandDeep}" opacity="0.65"/>
</svg>`,
  isolation: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 280" fill="none">
  <rect width="480" height="280" rx="${R.section}" fill="${C.brandTint}"/>
  <rect x="32" y="32" width="416" height="216" rx="${R.panel}" fill="${C.brandSoft}"/>
  <path d="M240 56 L352 120 V200 C352 232 302 252 240 252 C178 252 128 232 128 200 V120 Z" fill="${C.brandPrimary}"/>
  <path d="M212 156 L232 176 L276 132" stroke="${C.white}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="56" y="72" width="72" height="40" rx="${R.chip}" fill="${C.gray50}" opacity="0.35"/>
  <rect x="352" y="72" width="72" height="40" rx="${R.chip}" fill="${C.gray50}" opacity="0.35"/>
</svg>`,
  storybook: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 280" fill="none">
  <rect width="480" height="280" rx="${R.section}" fill="${C.gray5Alt}"/>
  <rect x="40" y="40" width="140" height="200" rx="10" fill="${C.gray15}"/>
  <rect x="52" y="72" width="116" height="8" rx="4" fill="${C.gray40}"/>
  <rect x="52" y="92" width="96" height="8" rx="4" fill="${C.gray25}"/>
  <rect x="170" y="56" width="140" height="200" rx="10" fill="${C.brandSoft}"/>
  <rect x="182" y="88" width="116" height="8" rx="4" fill="${C.brandPrimary}"/>
  <rect x="182" y="108" width="96" height="8" rx="4" fill="${C.brandPrimary}" opacity="0.45"/>
  <rect x="300" y="72" width="140" height="200" rx="10" fill="${C.gray15}"/>
  <rect x="312" y="104" width="116" height="8" rx="4" fill="${C.gray40}"/>
  <rect x="312" y="124" width="96" height="8" rx="4" fill="${C.gray25}"/>
</svg>`,
  'api-freeze': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 280" fill="none">
  <rect width="480" height="280" rx="${R.section}" fill="${C.gray20}"/>
  <rect x="120" y="32" width="240" height="216" rx="${R.panel}" fill="${C.white}" stroke="${C.gray25}" stroke-width="2"/>
  <rect x="152" y="72" width="176" height="10" rx="5" fill="${C.gray40}"/>
  <rect x="152" y="96" width="140" height="10" rx="5" fill="${C.gray25}"/>
  <rect x="152" y="120" width="160" height="10" rx="5" fill="${C.gray25}"/>
  <circle cx="240" cy="188" r="36" fill="${C.brandPrimary}" opacity="0.15"/>
  <circle cx="240" cy="188" r="24" fill="${C.brandPrimary}"/>
  <path d="M228 188 L236 196 L256 176" stroke="${C.white}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
};

export const TRUST_DEMO_IMAGES: Record<string, string> = Object.fromEntries(
  Object.entries(TRUST_SVGS).map(([id, svg]) => [id, svgDataUri(svg)]),
);

export function trustDemoImage(id: string): string | undefined {
  return TRUST_DEMO_IMAGES[id];
}
