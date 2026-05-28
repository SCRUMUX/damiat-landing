import React from 'react';

import type { HeroBlockProps } from './HeroBlock';

import type { ShowcasePanelBlockProps } from './ShowcasePanelBlock';

import type { WhyUsBlockProps } from './WhyUsBlock';

import { damiatScenarioContent, damiatDeviceIntroContent } from './damiatLandingFixtures';
import { DamiatGasOscilloscope } from './demo-assets/DamiatGasOscilloscope';

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



export const damiatScenarioChartPreview = (

  <DamiatMediaPlaceholder label="3 линии прогноза: рост · падение · стабильность" aspect="16/10" />

);



export function withDamiatScenarioMedia(

  content: ShowcasePanelBlockProps,

): ShowcasePanelBlockProps {

  return {

    ...content,

    panels: content.panels.map((panel, index) => ({

      ...panel,

      preview:

        index === 0 ? (

          damiatScenarioChartPreview

        ) : (

          <DamiatMediaPlaceholder label={`Превью: ${panel.title}`} aspect="16/10" />

        ),

    })),

  };

}



export const damiatScenarioWithMedia = withDamiatScenarioMedia(damiatScenarioContent);



export const damiatDeviceFeaturedMedia = (

  <DamiatMediaPlaceholder label="Промышленный генератор этилена DAMIAT" aspect="4/3" />

);



export function withDamiatDeviceIntroMedia(content: WhyUsBlockProps): WhyUsBlockProps {

  return {

    ...content,

    featured: {

      ...content.featured,

      media: damiatDeviceFeaturedMedia,

    },

  };

}



export const damiatDeviceIntroWithMedia = withDamiatDeviceIntroMedia(damiatDeviceIntroContent);

