import { DEMO_PALETTE as C } from './demoMediaPalette';
import { svgDataUri } from './svgDataUri';

/** Cortel /solutions hero — tall transparent isometric stack (bleeds past panel top/bottom). */
const SOLUTIONS_PAGE_HERO_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 608" fill="none">
  <defs>
    <linearGradient id="sph-top" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="${C.brandPrimary}"/>
      <stop offset="1" stop-color="${C.brandDeep}"/>
    </linearGradient>
    <linearGradient id="sph-left" x1="0" y1="0" x2="1" y2="0">
      <stop stop-color="${C.brandMid}"/>
      <stop offset="1" stop-color="${C.brandDeep}"/>
    </linearGradient>
    <linearGradient id="sph-right" x1="0" y1="0" x2="1" y2="0">
      <stop stop-color="${C.brandPrimary}"/>
      <stop offset="1" stop-color="${C.brandMid}"/>
    </linearGradient>
    <filter id="sph-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="${C.brandDeep}" flood-opacity="0.24"/>
    </filter>
  </defs>
  <g filter="url(#sph-shadow)">
    <path d="M244 500 L404 360 L404 500 L244 640 Z" fill="url(#sph-right)"/>
    <path d="M84 500 L244 360 L244 500 L84 640 Z" fill="url(#sph-left)"/>
    <path d="M84 360 L244 220 L404 360 L244 500 Z" fill="url(#sph-top)"/>
  </g>
  <g filter="url(#sph-shadow)" opacity="0.94">
    <path d="M170 390 L290 300 L290 390 L170 480 Z" fill="url(#sph-right)"/>
    <path d="M50 390 L170 300 L170 390 L50 480 Z" fill="url(#sph-left)"/>
    <path d="M50 300 L170 210 L290 300 L170 390 Z" fill="url(#sph-top)"/>
  </g>
  <g filter="url(#sph-shadow)" opacity="0.88">
    <path d="M244 250 L364 160 L364 250 L244 340 Z" fill="url(#sph-right)"/>
    <path d="M124 250 L244 160 L244 250 L124 340 Z" fill="url(#sph-left)"/>
    <path d="M124 160 L244 70 L364 160 L244 250 Z" fill="url(#sph-top)"/>
  </g>
  <g stroke="${C.brandDeep}" stroke-width="2.5" stroke-linecap="round" opacity="0.2">
    <path d="M290 300 L330 120"/>
    <path d="M170 390 L100 560"/>
    <path d="M404 360 L450 200"/>
  </g>
</svg>`;

export const solutionsPageHeroDemoImage = svgDataUri(SOLUTIONS_PAGE_HERO_SVG);
