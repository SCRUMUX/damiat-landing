/** DAMIAT landing — photo backgrounds per brand-hero section (repo root PNGs). */
import damiatHeroMain from '../../../damiat-hero-main-bg.png';
import damiatHeroPlatform from '../../../potato-storage-monitoring-bg.png';
import damiatHeroScenarios from '../../../agro-economic-landscape-bg.png';
import damiatHeroCase from '../../../agri-capital-bg.png';
import damiatHeroCta from '../../../agro-tech-storage-bg.png';

export const damiatLandingHeroBackgrounds = {
  main: damiatHeroMain,
  platform: damiatHeroPlatform,
  scenarios: damiatHeroScenarios,
  /** Contact form + footer — one photo, one grain stack. */
  closing: damiatHeroCta,
  case: damiatHeroCase,
  cta: damiatHeroCta,
} as const;

export type DamiatLandingHeroBackgroundKey = keyof typeof damiatLandingHeroBackgrounds;
