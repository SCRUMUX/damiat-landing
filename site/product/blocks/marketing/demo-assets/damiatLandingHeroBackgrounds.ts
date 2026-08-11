/** DAMIAT landing — photo backgrounds served from /public/images/. */

export const damiatLandingHeroBackgrounds = {
  main: '/images/damiat-hero-main-bg.png',
  platform: '/images/potato-storage-monitoring-bg.png',
  scenarios: '/images/agro-economic-landscape-bg.png',
  closing: '/images/agro-tech-storage-bg.png',
  case: '/images/damiat-gpd-case-bg.png',
  cta: '/images/agro-tech-storage-bg.png',
} as const;

export type DamiatLandingHeroBackgroundKey = keyof typeof damiatLandingHeroBackgrounds;
