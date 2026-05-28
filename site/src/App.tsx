import React from 'react';
import { DamiatLandingPage } from '../../core/blocks/marketing/DamiatLandingPage';
import { damiatLandingArgs } from '../../core/blocks/marketing/damiatLandingFixtures';
import {
  damiatScenarioWithMedia,
  damiatDeviceIntroWithMedia,
  withDamiatHeroMedia,
} from '../../core/blocks/marketing/damiatDemoMedia';
import { damiatLandingHeroBackgrounds } from '../../core/blocks/marketing/demo-assets/damiatLandingHeroBackgrounds';
import { withTrustFeaturedCover } from '../../core/blocks/marketing/trustDemoMedia';
import { withPartnersDemoMedia } from '../../core/blocks/marketing/partnersDemoMedia';

const landingProps = {
  ...damiatLandingArgs,
  hero: withDamiatHeroMedia(damiatLandingArgs.hero),
  heroBackgroundImage: damiatLandingHeroBackgrounds.main,
  sectionBackgrounds: damiatLandingHeroBackgrounds,
  scenario: damiatScenarioWithMedia,
  deviceIntro: damiatDeviceIntroWithMedia,
  trust: withTrustFeaturedCover(damiatLandingArgs.trust),
  partners: withPartnersDemoMedia(damiatLandingArgs.partners),
  scrollLoop: true,
};

export function App() {
  return <DamiatLandingPage {...landingProps} />;
}
