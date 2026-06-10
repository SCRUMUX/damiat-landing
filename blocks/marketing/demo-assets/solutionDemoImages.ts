import { DEMO_PALETTE as C, DEMO_RADIUS as R } from './demoMediaPalette';
import { svgDataUri } from './svgDataUri';

const SOLUTION_SVGS: Record<string, string> = {
  'enterprise-landing': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" fill="none">
  <rect width="640" height="400" fill="${C.gray80}"/>
  <rect x="48" y="56" width="544" height="288" rx="20" fill="${C.brandDeep}" opacity="0.55"/>
  <rect x="72" y="88" width="160" height="96" rx="${R.panel}" fill="${C.brandMid}" opacity="0.85"/>
  <rect x="248" y="88" width="320" height="40" rx="${R.control}" fill="${C.brandPrimary}" opacity="0.5"/>
  <rect x="248" y="144" width="220" height="40" rx="${R.control}" fill="${C.brandPrimary}" opacity="0.35"/>
  <rect x="72" y="208" width="496" height="112" rx="${R.panel}" fill="${C.brandDeep}" opacity="0.45"/>
  <circle cx="520" cy="112" r="28" fill="${C.brandPrimary}"/>
  <path d="M508 112 L516 120 L532 100" stroke="${C.white}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  'ai-assembler': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" fill="none">
  <rect width="640" height="400" fill="${C.gray70}"/>
  <circle cx="320" cy="200" r="56" fill="${C.cyan50}"/>
  <circle cx="160" cy="120" r="36" fill="${C.brandPrimary}" opacity="0.9"/>
  <circle cx="480" cy="120" r="36" fill="${C.brandPrimary}" opacity="0.9"/>
  <circle cx="140" cy="280" r="32" fill="${C.brandPrimary}" opacity="0.75"/>
  <circle cx="500" cy="280" r="32" fill="${C.brandPrimary}" opacity="0.75"/>
  <path d="M188 138 L284 172 M452 138 L356 172 M168 262 L284 228 M472 262 L356 228" stroke="${C.brandSoft}" stroke-width="3" stroke-linecap="round"/>
  <rect x="292" y="176" width="56" height="48" rx="10" fill="${C.cyan50}"/>
</svg>`,
  'eslint-isolation': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" fill="none">
  <rect width="640" height="400" fill="${C.gray80}"/>
  <path d="M320 72 L500 170 V290 C500 330 420 360 320 360 C220 360 140 330 140 290 V170 Z" fill="${C.brandDeep}" opacity="0.55"/>
  <path d="M320 96 L468 178 V278 C468 310 402 334 320 334 C238 334 172 310 172 278 V178 Z" fill="${C.brandPrimary}"/>
  <path d="M280 210 L308 238 L368 178" stroke="${C.white}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="88" y="88" width="120" height="72" rx="10" fill="${C.gray65}" opacity="0.8"/>
  <rect x="432" y="88" width="120" height="72" rx="10" fill="${C.gray65}" opacity="0.8"/>
</svg>`,
  'git-distribution': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" fill="none">
  <rect width="640" height="400" fill="${C.gray90}"/>
  <circle cx="320" cy="200" r="24" fill="${C.yellow50}"/>
  <circle cx="180" cy="120" r="18" fill="${C.yellow50}" opacity="0.85"/>
  <circle cx="460" cy="120" r="18" fill="${C.yellow50}" opacity="0.85"/>
  <circle cx="140" cy="280" r="18" fill="${C.yellow50}" opacity="0.65"/>
  <circle cx="500" cy="280" r="18" fill="${C.yellow50}" opacity="0.65"/>
  <path d="M198 128 C240 150 280 170 296 188 M442 128 C400 150 360 170 344 188 M158 272 C220 240 280 220 296 212 M482 272 C420 240 360 220 344 212" stroke="${C.yellow50}" stroke-width="4" opacity="0.45"/>
  <rect x="268" y="56" width="104" height="32" rx="${R.control}" fill="${C.yellow50}" opacity="0.85"/>
</svg>`,
  'chromatic-vrt': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" fill="none">
  <rect width="640" height="400" fill="${C.gray80}"/>
  <rect x="96" y="72" width="200" height="256" rx="${R.section}" fill="${C.violet50}" opacity="0.55"/>
  <rect x="220" y="96" width="200" height="256" rx="${R.section}" fill="${C.violet50}" opacity="0.75"/>
  <rect x="344" y="72" width="200" height="256" rx="${R.section}" fill="${C.violet50}" opacity="0.55"/>
  <circle cx="196" cy="140" r="24" fill="${C.brandSoft}"/>
  <circle cx="320" cy="164" r="24" fill="${C.white}"/>
  <circle cx="444" cy="140" r="24" fill="${C.brandSoft}"/>
  <rect x="160" y="248" width="320" height="12" rx="${R.chip}" fill="${C.violet50}" opacity="0.6"/>
</svg>`,
  'platform-rollout': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" fill="none">
  <rect width="640" height="400" fill="${C.green99}"/>
  <rect x="120" y="240" width="400" height="56" rx="${R.panel}" fill="${C.teal10}" opacity="0.55"/>
  <rect x="160" y="176" width="320" height="56" rx="${R.panel}" fill="${C.green50}" opacity="0.75"/>
  <rect x="200" y="112" width="240" height="56" rx="${R.panel}" fill="${C.green50}"/>
  <rect x="248" y="48" width="144" height="56" rx="${R.panel}" fill="${C.teal10}"/>
  <path d="M320 304 V88" stroke="${C.brandTint}" stroke-width="3" stroke-dasharray="8 8"/>
</svg>`,
};

export const SOLUTION_DEMO_IMAGES: Record<string, string> = Object.fromEntries(
  Object.entries(SOLUTION_SVGS).map(([id, svg]) => [id, svgDataUri(svg)]),
);

export function solutionDemoImage(id: string, index = 0): string {
  const keys = Object.keys(SOLUTION_DEMO_IMAGES);
  return SOLUTION_DEMO_IMAGES[id] ?? SOLUTION_DEMO_IMAGES[keys[index % keys.length]!]!;
}
