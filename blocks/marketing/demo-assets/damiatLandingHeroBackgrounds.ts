/** DAMIAT landing — photo backgrounds per brand-hero section (repo root PNGs). */

import damiatHeroMain from '../../../damiat-hero-main-bg.png';

import damiatHeroPlatform from '../../../potato-storage-monitoring-bg.png';

import damiatHeroScenarios from '../../../agro-economic-landscape-bg.png';

import damiatHeroCaseGpd from '../../../damiat-gpd-case-bg.png';

import damiatHeroCta from '../../../agro-tech-storage-bg.png';



export const damiatLandingHeroBackgrounds = {

  main: damiatHeroMain,

  platform: damiatHeroPlatform,

  scenarios: damiatHeroScenarios,

  /** Contact form + footer — one photo, one grain stack. */

  closing: damiatHeroCta,

  case: damiatHeroCaseGpd,

  cta: damiatHeroCta,

} as const;



export type DamiatLandingHeroBackgroundKey = keyof typeof damiatLandingHeroBackgrounds;

