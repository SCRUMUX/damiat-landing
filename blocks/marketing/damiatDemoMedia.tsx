import React from 'react';

import type { HeroBlockProps } from './HeroBlock';

import type { ShowcasePanelBlockProps } from './ShowcasePanelBlock';


import { damiatScenarioContent, damiatDeviceIntroContent } from './damiatLandingFixtures';
import { withDamiatDeviceIntroMedia } from './damiatDeviceIntroIcons';
import { DamiatGasOscilloscope } from './demo-assets/DamiatGasOscilloscope';
import { getDamiatScenarioPreview } from './demo-assets/scenario';

export { damiatHeroBackgroundUrl } from './demo-assets/damiatHeroImages';



function DamiatMediaPlaceholder({ label, aspect = '4/3' }: { label: string; aspect?: string }) {

  return (

    <div

      className="flex w-full items-center justify-center bg-[var(--color-surface-3)] text-style-body-sm text-[var(--color-text-muted)]"

      style={{ aspectRatio: aspect }}

      aria-hidden="true"

    >

      {label}

    </div>

  );

}



/** Hero: circular gas-analysis oscilloscope (КГС channels). */

export const damiatHeroDashboardMedia = <DamiatGasOscilloscope />;



export function withDamiatHeroMedia(hero: HeroBlockProps): HeroBlockProps {

  return { ...hero, media: damiatHeroDashboardMedia };

}



export function withDamiatScenarioMedia(

  content: ShowcasePanelBlockProps,

): ShowcasePanelBlockProps {

  return {

    ...content,

    panels: content.panels.map((panel) => ({

      ...panel,

      preview: getDamiatScenarioPreview(panel.id) ?? panel.preview,

    })),

  };

}



export const damiatScenarioWithMedia = withDamiatScenarioMedia(damiatScenarioContent);



export { withDamiatDeviceIntroMedia } from './damiatDeviceIntroIcons';

export const damiatDeviceIntroWithMedia = withDamiatDeviceIntroMedia(damiatDeviceIntroContent);
