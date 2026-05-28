import { DEMO_PALETTE as C, DEMO_RADIUS as R } from './demoMediaPalette';
import { svgDataUri } from './svgDataUri';

/** Light dashboard-style mocks — Cortel LK / Storybook panel reference. */
const SHOWCASE_PANEL_SVGS: Record<string, string> = {
  contracts: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1260 980" fill="none">
  <rect width="1260" height="980" rx="${R.section}" fill="${C.gray20}"/>
  <rect x="24" y="24" width="72" height="932" rx="${R.section}" fill="${C.white}" stroke="${C.gray20}"/>
  <rect x="44" y="56" width="32" height="32" rx="${R.control}" fill="${C.brandPrimary}" opacity="0.15"/>
  <rect x="44" y="104" width="32" height="32" rx="${R.control}" fill="${C.gray25}"/>
  <rect x="44" y="152" width="32" height="32" rx="${R.control}" fill="${C.gray25}"/>
  <rect x="120" y="40" width="220" height="36" rx="10" fill="${C.white}" stroke="${C.gray20}"/>
  <rect x="360" y="40" width="180" height="36" rx="10" fill="${C.brandPrimary}" fill-opacity="0.12" stroke="${C.brandPrimary}" stroke-opacity="0.35"/>
  <rect x="120" y="104" width="1116" height="56" rx="${R.panel}" fill="${C.white}" stroke="${C.gray20}"/>
  <rect x="144" y="124" width="140" height="16" rx="${R.control}" fill="${C.gray50}" opacity="0.35"/>
  <rect x="304" y="124" width="120" height="16" rx="${R.control}" fill="${C.gray25}"/>
  <rect x="448" y="124" width="120" height="16" rx="${R.control}" fill="${C.gray25}"/>
  <rect x="120" y="184" width="1116" height="760" rx="${R.section}" fill="${C.white}" stroke="${C.gray20}"/>
  <rect x="152" y="216" width="280" height="20" rx="10" fill="${C.gray80}" opacity="0.85"/>
  <rect x="152" y="256" width="420" height="12" rx="${R.chip}" fill="${C.gray25}"/>
  <rect x="152" y="284" width="360" height="12" rx="${R.chip}" fill="${C.gray15}"/>
  <rect x="152" y="332" width="160" height="44" rx="10" fill="${C.brandPrimary}"/>
  <rect x="328" y="332" width="160" height="44" rx="10" fill="${C.brandTint}" stroke="${C.brandPrimary}" opacity="0.45"/>
  <rect x="760" y="216" width="420" height="300" rx="${R.panel}" fill="${C.gray5Alt}" stroke="${C.gray15}"/>
  <rect x="792" y="248" width="356" height="12" rx="${R.chip}" fill="${C.gray25}"/>
  <rect x="792" y="276" width="280" height="12" rx="${R.chip}" fill="${C.gray15}"/>
  <rect x="792" y="304" width="320" height="12" rx="${R.chip}" fill="${C.gray15}"/>
  <rect x="152" y="420" width="1020" height="8" rx="4" fill="${C.brandSoft}"/>
  <rect x="152" y="448" width="860" height="8" rx="4" fill="${C.gray15}"/>
</svg>`,
  patterns: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1260 980" fill="none">
  <rect width="1260" height="980" rx="${R.section}" fill="${C.gray20}"/>
  <rect x="24" y="24" width="72" height="932" rx="${R.section}" fill="${C.white}" stroke="${C.gray20}"/>
  <rect x="44" y="56" width="32" height="32" rx="${R.control}" fill="${C.brandPrimary}"/>
  <rect x="44" y="104" width="32" height="32" rx="${R.control}" fill="${C.gray25}"/>
  <rect x="44" y="152" width="32" height="32" rx="${R.control}" fill="${C.gray25}"/>
  <rect x="120" y="40" width="240" height="36" rx="10" fill="${C.white}" stroke="${C.gray20}"/>
  <rect x="384" y="40" width="200" height="36" rx="10" fill="${C.white}" stroke="${C.gray20}"/>
  <rect x="120" y="104" width="1116" height="120" rx="${R.panel}" fill="${C.white}" stroke="${C.gray20}"/>
  <rect x="144" y="128" width="160" height="16" rx="${R.control}" fill="${C.gray50}" opacity="0.35"/>
  <rect x="320" y="128" width="160" height="16" rx="${R.control}" fill="${C.gray50}" opacity="0.35"/>
  <rect x="144" y="164" width="520" height="12" rx="${R.chip}" fill="${C.gray25}"/>
  <rect x="144" y="188" width="420" height="12" rx="${R.chip}" fill="${C.gray15}"/>
  <rect x="120" y="248" width="1116" height="696" rx="${R.section}" fill="${C.white}" stroke="${C.gray20}"/>
  <rect x="152" y="280" width="320" height="18" rx="9" fill="${C.gray80}" opacity="0.85"/>
  <rect x="152" y="324" width="1052" height="1" fill="${C.gray15}"/>
  <rect x="152" y="348" width="1052" height="88" rx="10" fill="${C.gray5Alt}" stroke="${C.gray15}"/>
  <rect x="176" y="372" width="220" height="14" rx="7" fill="${C.gray65}" opacity="0.35"/>
  <rect x="176" y="396" width="420" height="12" rx="${R.chip}" fill="${C.gray25}"/>
  <rect x="980" y="372" width="120" height="36" rx="${R.control}" fill="${C.brandPrimary}" opacity="0.15"/>
  <rect x="152" y="452" width="1052" height="88" rx="10" fill="${C.white}" stroke="${C.gray15}"/>
  <rect x="176" y="476" width="240" height="14" rx="7" fill="${C.gray65}" opacity="0.35"/>
  <rect x="176" y="500" width="380" height="12" rx="${R.chip}" fill="${C.gray25}"/>
  <rect x="980" y="476" width="120" height="36" rx="${R.control}" fill="${C.brandPrimary}"/>
  <rect x="152" y="556" width="1052" height="88" rx="10" fill="${C.white}" stroke="${C.gray15}"/>
  <rect x="176" y="580" width="260" height="14" rx="7" fill="${C.gray65}" opacity="0.35"/>
  <rect x="176" y="604" width="400" height="12" rx="${R.chip}" fill="${C.gray25}"/>
  <rect x="980" y="580" width="120" height="36" rx="${R.control}" fill="${C.brandPrimary}" opacity="0.15"/>
</svg>`,
};

export const SHOWCASE_PANEL_DEMO_IMAGES: Record<string, string> = Object.fromEntries(
  Object.entries(SHOWCASE_PANEL_SVGS).map(([id, svg]) => [id, svgDataUri(svg)]),
);

export function showcasePanelDemoImage(id: string): string | undefined {
  return SHOWCASE_PANEL_DEMO_IMAGES[id];
}
