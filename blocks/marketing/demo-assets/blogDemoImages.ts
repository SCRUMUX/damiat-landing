import { DEMO_PALETTE as C, DEMO_RADIUS as R } from './demoMediaPalette';
import { svgDataUri } from './svgDataUri';

const BLOG_SVGS: Record<string, string> = {
  isolation: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 416 270" fill="none">
  <rect width="416" height="270" rx="${R.section}" fill="${C.brandTint}"/>
  <rect x="32" y="40" width="352" height="190" rx="${R.section}" fill="${C.brandSoft}"/>
  <rect x="56" y="72" width="120" height="56" rx="10" fill="${C.brandPrimary}"/>
  <rect x="192" y="72" width="168" height="56" rx="10" fill="${C.brandPrimary}" opacity="0.45"/>
  <path d="M88 152 H328" stroke="${C.gray50}" stroke-width="2" stroke-dasharray="6 6"/>
  <rect x="88" y="168" width="240" height="36" rx="${R.control}" fill="${C.brandDeep}" opacity="0.85"/>
  <text x="108" y="192" fill="${C.white}" font-family="system-ui,sans-serif" font-size="14">@radix-ui/react-dialog</text>
  <rect x="248" y="168" width="80" height="36" rx="${R.control}" fill="${C.red50}" opacity="0.9"/>
  <text x="262" y="192" fill="${C.white}" font-family="system-ui,sans-serif" font-size="12">blocked</text>
</svg>`,
  storybook: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 416 270" fill="none">
  <rect width="416" height="270" rx="${R.section}" fill="${C.gray5Alt}"/>
  <rect x="24" y="32" width="120" height="206" rx="${R.panel}" fill="${C.gray15}"/>
  <rect x="36" y="56" width="96" height="8" rx="4" fill="${C.gray40}"/>
  <rect x="36" y="76" width="80" height="8" rx="4" fill="${C.gray25}"/>
  <rect x="148" y="24" width="244" height="214" rx="${R.panel}" fill="${C.white}" stroke="${C.gray15}" stroke-width="2"/>
  <rect x="168" y="52" width="160" height="12" rx="${R.chip}" fill="${C.brandPrimary}"/>
  <rect x="168" y="80" width="200" height="120" rx="10" fill="${C.brandSoft}"/>
  <rect x="168" y="212" width="120" height="10" rx="5" fill="${C.gray40}"/>
</svg>`,
  chromatic: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 416 270" fill="none">
  <rect width="416" height="270" rx="${R.section}" fill="${C.gray10Alt}"/>
  <rect x="40" y="48" width="160" height="174" rx="14" fill="${C.brandSoft}"/>
  <rect x="216" y="48" width="160" height="174" rx="14" fill="${C.brandTint}"/>
  <rect x="56" y="72" width="128" height="96" rx="${R.control}" fill="${C.violet50}" opacity="0.55"/>
  <rect x="232" y="72" width="128" height="96" rx="${R.control}" fill="${C.violet50}" opacity="0.75"/>
  <path d="M120 168 L168 120 L216 168" stroke="${C.violet50}" stroke-width="3" fill="none"/>
  <circle cx="320" cy="64" r="20" fill="${C.green50}"/>
  <path d="M312 64 L318 70 L330 58" stroke="${C.white}" stroke-width="2.5" stroke-linecap="round"/>
</svg>`,
  patterns: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 416 270" fill="none">
  <rect width="416" height="270" rx="${R.section}" fill="${C.gray10}"/>
  <rect x="48" y="56" width="320" height="158" rx="${R.section}" fill="${C.brandTint}"/>
  <rect x="72" y="80" width="88" height="48" rx="${R.control}" fill="${C.green50}"/>
  <rect x="172" y="80" width="88" height="48" rx="${R.control}" fill="${C.green50}" opacity="0.75"/>
  <rect x="272" y="80" width="72" height="48" rx="${R.control}" fill="${C.teal10}" opacity="0.65"/>
  <rect x="72" y="144" width="272" height="10" rx="5" fill="${C.green99}" opacity="0.35"/>
  <rect x="72" y="164" width="220" height="10" rx="5" fill="${C.green99}" opacity="0.25"/>
  <text x="88" y="110" fill="${C.white}" font-family="monospace" font-size="11">HeroBlock</text>
</svg>`,
  distribution: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 416 270" fill="none">
  <rect width="416" height="270" rx="${R.section}" fill="${C.gray10}"/>
  <rect x="56" y="72" width="120" height="126" rx="${R.panel}" fill="${C.yellow50}" opacity="0.35"/>
  <rect x="196" y="56" width="164" height="154" rx="${R.panel}" fill="${C.yellow50}" opacity="0.55"/>
  <circle cx="116" cy="108" r="24" fill="${C.yellow50}"/>
  <path d="M220 96 H340 M220 120 H320 M220 144 H300 M220 168 H260" stroke="${C.gray65}" stroke-width="3" stroke-linecap="round"/>
  <path d="M176 135 L196 135" stroke="${C.yellow50}" stroke-width="3"/>
  <polygon points="196,128 210,135 196,142" fill="${C.yellow50}"/>
</svg>`,
  contracts: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 416 270" fill="none">
  <rect width="416" height="270" rx="${R.section}" fill="${C.gray20}"/>
  <rect x="64" y="48" width="288" height="174" rx="${R.section}" fill="${C.white}" stroke="${C.gray25}" stroke-width="2"/>
  <rect x="88" y="76" width="96" height="12" rx="${R.chip}" fill="${C.brandPrimary}"/>
  <rect x="88" y="104" width="240" height="8" rx="4" fill="${C.gray15}"/>
  <rect x="88" y="124" width="200" height="8" rx="4" fill="${C.gray15}"/>
  <rect x="88" y="144" width="160" height="8" rx="4" fill="${C.gray15}"/>
  <rect x="88" y="176" width="80" height="28" rx="${R.control}" fill="${C.brandSoft}"/>
  <rect x="180" y="176" width="80" height="28" rx="${R.control}" fill="${C.brandSoft}"/>
</svg>`,
};

export function blogDemoImage(id: string): string | undefined {
  const svg = BLOG_SVGS[id];
  return svg ? svgDataUri(svg) : undefined;
}
