import React from 'react';

import { DamiatLandingPage } from '@damiat/core/blocks/marketing/DamiatLandingPage';

import { damiatLandingArgs } from '@damiat/core/blocks/marketing/damiatLandingFixtures';

import {

  damiatScenarioWithMedia,

  damiatDeviceIntroWithMedia,

  withDamiatHeroMedia,

} from '@damiat/core/blocks/marketing/damiatDemoMedia';

import { damiatLandingHeroBackgrounds } from '@damiat/core/blocks/marketing/demo-assets/damiatLandingHeroBackgrounds';

import { withTrustFeaturedCover } from '@damiat/core/blocks/marketing/trustDemoMedia';



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

