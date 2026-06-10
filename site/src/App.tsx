import React from 'react';

import { DamiatLandingPage } from '@damiat/product/blocks/marketing/DamiatLandingPage';
import { damiatLandingArgs } from '@damiat/product/blocks/marketing/damiatLandingFixtures';
import {
  damiatScenarioWithMedia,
  damiatDeviceIntroWithMedia,
  withDamiatHeroMedia,
} from '@damiat/product/blocks/marketing/damiatDemoMedia';
import { damiatLandingHeroBackgrounds } from '@damiat/product/blocks/marketing/demo-assets/damiatLandingHeroBackgrounds';
import { withTrustFeaturedCover } from '@damiat/product/blocks/marketing/trustDemoMedia';

const landingProps = {
  ...damiatLandingArgs,
  hero: withDamiatHeroMedia(damiatLandingArgs.hero),
  heroBackgroundImage: damiatLandingHeroBackgrounds.main,
  sectionBackgrounds: damiatLandingHeroBackgrounds,
  scenario: damiatScenarioWithMedia,
  deviceIntro: damiatDeviceIntroWithMedia,
  trust: withTrustFeaturedCover(damiatLandingArgs.trust),
  motionProfile: 'lean' as const,
};

export function App() {
  return <DamiatLandingPage {...landingProps} />;
}
