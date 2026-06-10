/** DAMIAT landing — photo backgrounds (SVG placeholders when PNGs are absent). */

import {
  damiatHeroCasePlaceholder,
  damiatHeroCtaPlaceholder,
  damiatHeroMainPlaceholder,
  damiatHeroPlatformPlaceholder,
  damiatHeroScenariosPlaceholder,
} from './damiatDemoPlaceholders';

export const damiatLandingHeroBackgrounds = {
  main: damiatHeroMainPlaceholder,
  platform: damiatHeroPlatformPlaceholder,
  scenarios: damiatHeroScenariosPlaceholder,
  closing: damiatHeroCtaPlaceholder,
  case: damiatHeroCasePlaceholder,
  cta: damiatHeroCtaPlaceholder,
} as const;

export type DamiatLandingHeroBackgroundKey = keyof typeof damiatLandingHeroBackgrounds;
