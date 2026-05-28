import React from 'react';

import { cn } from '../../../components/primitives/_shared';

import { BrandPhotoHeroSection } from '../../_shared/BrandPhotoHeroSection';

import { MarketingAboveFold } from '../../_shared/MarketingAboveFold';

import { ScrollDepthReveal } from '../../_shared/ScrollDepthReveal';

import { LoopScrollBridge } from '../../_shared/LoopScrollBridge';
import { ScrollLoopShell } from '../../_shared/ScrollLoopShell';

import { NavbarBlock, type NavbarBlockProps } from '../NavbarBlock';

import { HeroBlock, type HeroBlockProps } from '../HeroBlock';

import { EventsBlock, type EventsBlockProps } from '../EventsBlock/EventsBlock';

import { FeaturesBlock, type FeaturesBlockProps } from '../FeaturesBlock';

import { DamiatCalculatorBlock, type DamiatCalculatorBlockProps } from '../DamiatCalculatorBlock';

import { ShowcasePanelBlock, type ShowcasePanelBlockProps } from '../ShowcasePanelBlock';

import { WhyUsBlock, type WhyUsBlockProps } from '../WhyUsBlock';

import { StatsBlock, type StatsBlockProps } from '../StatsBlock';

import { ProcessBlock, type ProcessBlockProps } from '../ProcessBlock';

import { TrustBlock, type TrustBlockProps } from '../TrustBlock';

import { PartnersBlock, type PartnersBlockProps } from '../PartnersBlock';

import { LogoCloudBlock, type LogoCloudBlockProps } from '../LogoCloudBlock';

import { ContactHeroBlock, type ContactHeroBlockProps } from '../ContactHeroBlock';

import { FooterBlock, type FooterBlockProps } from '../FooterBlock';

import {

  damiatLandingHeroBackgrounds,

  type DamiatLandingHeroBackgroundKey,

} from '../demo-assets/damiatLandingHeroBackgrounds';

import { DamiatGasOscilloscope } from '../demo-assets/DamiatGasOscilloscope';

import {
  damiatLoopBridgeImage,
  damiatLoopBridgePhrases,
} from '../damiatLoopBridgeContent';

export type DamiatLandingHeroBackgrounds = typeof damiatLandingHeroBackgrounds;



export interface DamiatLandingScrollBodyProps {

  events: EventsBlockProps;

  problem: FeaturesBlockProps;

  calculator: DamiatCalculatorBlockProps;

  scenario: ShowcasePanelBlockProps;

  deviceIntro: WhyUsBlockProps;

  devicePrinciple: ProcessBlockProps;

  deviceCapabilities: FeaturesBlockProps;

  dashboardStats: StatsBlockProps;

  dashboardAlerts: FeaturesBlockProps;

  howItWorks: ProcessBlockProps;

  caseStudyStats: StatsBlockProps;

  caseStudyDetails: FeaturesBlockProps;

  trust: TrustBlockProps;

  partners: PartnersBlockProps;

  logoCloud: LogoCloudBlockProps;

  contactHero: ContactHeroBlockProps;

  footer: FooterBlockProps;

  navbar: NavbarBlockProps;

  heroProps: HeroBlockProps;

  brandBandEvents: boolean;

  mainHeroImage?: string;

  backgrounds: DamiatLandingHeroBackgrounds;

  scrollLoop: boolean;

}



/** Scrollable landing body (hero through footer + optional loop bridge) — used inside ScrollLoopShell. */

export const DamiatLandingScrollBody: React.FC<DamiatLandingScrollBodyProps> = ({

  events,

  problem,

  calculator,

  scenario,

  deviceIntro,

  devicePrinciple,

  deviceCapabilities,

  dashboardStats,

  dashboardAlerts,

  howItWorks,

  caseStudyStats,

  caseStudyDetails,

  trust,

  partners,

  logoCloud,

  contactHero,

  footer,

  navbar,

  heroProps,

  brandBandEvents,

  mainHeroImage,

  backgrounds,

  scrollLoop,

}) => {
  const noScrollParallax = scrollLoop
    ? { imageParallaxFactor: 0, contentParallaxFactor: 0 }
    : {};

  /** Photo-band heroes — same viewport height as the first above-the-fold hero. */
  const photoHeroSectionClass = 'flex min-h-[100svh] flex-col';
  const photoHeroContentClass = 'flex min-h-0 flex-1 flex-col justify-center';
  const contactHeroContentClass = 'flex min-h-0 flex-1 flex-col justify-between';

  return (

    <>

      <MarketingAboveFold

        underFixedNavbar={Boolean(navbar.sticky ?? true)}

        backgroundImageSrc={mainHeroImage}

        photoTone={mainHeroImage ? 'deep' : 'brand'}

        imageParallaxFactor={scrollLoop ? 0 : 0.14}

        className="flex min-h-[100svh] flex-col"

      >

        <HeroBlock

          {...heroProps}

          depthParallax={!scrollLoop}

          media={heroProps.media ?? <DamiatGasOscilloscope />}

          fillViewport={heroProps.variant === 'enterprise'}

          className={cn('!bg-transparent', heroProps.className)}

          style={{

            paddingTop: 'var(--space-section-y-l)',

            paddingBottom: brandBandEvents

              ? 'var(--space-section-content-l)'

              : 'var(--space-section-y-xl)',

            ...(heroProps.style ?? {}),

          }}

        />

        {brandBandEvents ? (

          <div id="events">

            <EventsBlock

              {...events}

              sectionStyle={{

                paddingTop: 'calc(var(--space-section-y-m) - var(--space-30))',

                paddingBottom: 'var(--space-section-y-m)',

                ...(events.sectionStyle ?? {}),

              }}

              className={cn('shrink-0 !border-b-0 !bg-transparent', events.className)}

            />

          </div>

        ) : null}

      </MarketingAboveFold>



      <div id="problem">

        <ScrollDepthReveal intensity="subtle">

          <FeaturesBlock {...problem} />

        </ScrollDepthReveal>

      </div>



      <div id="calculator">

        <ScrollDepthReveal intensity="strong">

          <DamiatCalculatorBlock {...calculator} />

        </ScrollDepthReveal>

      </div>



      <BrandPhotoHeroSection
        id="scenarios"
        backgroundImageSrc={backgrounds.scenarios}
        photoTone="deep"
        grainIntensity="strong"
        className={photoHeroSectionClass}
        contentClassName={photoHeroContentClass}
        {...noScrollParallax}
      >

        <ScrollDepthReveal intensity="strong">

          <ShowcasePanelBlock {...scenario} parallax={false} className="!bg-transparent" />

        </ScrollDepthReveal>

      </BrandPhotoHeroSection>



      <div id="device">

        <ScrollDepthReveal intensity="strong">

          <WhyUsBlock {...deviceIntro} />

        </ScrollDepthReveal>

      </div>



      <div id="technology">

        <ScrollDepthReveal intensity="strong">

          <ProcessBlock {...devicePrinciple} />

          <FeaturesBlock {...deviceCapabilities} />

        </ScrollDepthReveal>

      </div>



      <div id="dashboard">

        <BrandPhotoHeroSection
          backgroundImageSrc={backgrounds.platform}
          photoTone="deep"
          grainIntensity="strong"
          className={photoHeroSectionClass}
          contentClassName={photoHeroContentClass}
          {...noScrollParallax}
        >

          <ScrollDepthReveal intensity="strong">

            <StatsBlock {...dashboardStats} className="!bg-transparent" />

          </ScrollDepthReveal>

        </BrandPhotoHeroSection>

        <ScrollDepthReveal intensity="medium">

          <FeaturesBlock {...dashboardAlerts} />

        </ScrollDepthReveal>

      </div>



      <ScrollDepthReveal intensity="medium">

        <ProcessBlock {...howItWorks} />

      </ScrollDepthReveal>



      <div id="case">

        <BrandPhotoHeroSection
          backgroundImageSrc={backgrounds.case}
          photoTone="deep"
          grainIntensity="strong"
          className={photoHeroSectionClass}
          contentClassName={photoHeroContentClass}
          {...noScrollParallax}
        >

          <ScrollDepthReveal intensity="strong">

            <StatsBlock {...caseStudyStats} className="!bg-transparent" />

          </ScrollDepthReveal>

        </BrandPhotoHeroSection>

        <ScrollDepthReveal intensity="medium">

          <FeaturesBlock {...caseStudyDetails} />

        </ScrollDepthReveal>

      </div>



      <div id="trust">

        <ScrollDepthReveal intensity="medium" staggerChildren>

          <TrustBlock {...trust} />

          <PartnersBlock {...partners} />

          <LogoCloudBlock {...logoCloud} />

        </ScrollDepthReveal>

      </div>



      <BrandPhotoHeroSection
        id="contact"
        backgroundImageSrc={backgrounds.closing}
        photoTone="deep"
        grainIntensity="heavy"
        className={photoHeroSectionClass}
        contentClassName={contactHeroContentClass}
        {...noScrollParallax}
        contentParallaxFactor={scrollLoop ? 0 : 0.03}
      >
        <ScrollDepthReveal intensity="subtle" staggerChildren disabled={scrollLoop}>
          <ContactHeroBlock
            {...contactHero}
            embeddedInPhotoHero
            className="!bg-transparent min-h-0 flex-1"
          />
          <FooterBlock {...footer} className="!bg-transparent" showTopDivider={false} />
        </ScrollDepthReveal>
      </BrandPhotoHeroSection>

      {scrollLoop ? (
        <LoopScrollBridge
          enabled={scrollLoop}
          imageSrc={damiatLoopBridgeImage}
          phrases={damiatLoopBridgePhrases}
        />
      ) : null}

    </>

  );

};



export interface DamiatLandingPageProps {

  navbar: NavbarBlockProps;

  hero: HeroBlockProps;

  events: EventsBlockProps;

  problem: FeaturesBlockProps;

  calculator: DamiatCalculatorBlockProps;

  scenario: ShowcasePanelBlockProps;

  deviceIntro: WhyUsBlockProps;

  devicePrinciple: ProcessBlockProps;

  deviceCapabilities: FeaturesBlockProps;

  dashboardStats: StatsBlockProps;

  dashboardAlerts: FeaturesBlockProps;

  howItWorks: ProcessBlockProps;

  caseStudyStats: StatsBlockProps;

  caseStudyDetails: FeaturesBlockProps;

  trust: TrustBlockProps;

  partners: PartnersBlockProps;

  logoCloud: LogoCloudBlockProps;

  contactHero: ContactHeroBlockProps;

  footer: FooterBlockProps;

  heroBackgroundImage?: string;

  sectionBackgrounds?: Partial<Record<DamiatLandingHeroBackgroundKey, string>>;

  scrollLoop?: boolean;

  className?: string;

}



/**

 * DAMIAT product landing — calculator & scenarios, then ethylene generator, platform, case study.

 */

export const DamiatLandingPage: React.FC<DamiatLandingPageProps> = ({

  navbar,

  hero,

  events,

  problem,

  calculator,

  scenario,

  deviceIntro,

  devicePrinciple,

  deviceCapabilities,

  dashboardStats,

  dashboardAlerts,

  howItWorks,

  caseStudyStats,

  caseStudyDetails,

  trust,

  partners,

  logoCloud,

  contactHero,

  footer,

  heroBackgroundImage,

  sectionBackgrounds,

  scrollLoop = true,

  className,

}) => {

  const heroProps =

    navbar.overlay && !hero.appearance ? { ...hero, appearance: 'brand' as const } : hero;

  const brandBandEvents = events.variant === undefined || events.variant === 'featured';



  const backgrounds = { ...damiatLandingHeroBackgrounds, ...sectionBackgrounds };

  const mainHeroImage = heroBackgroundImage ?? backgrounds.main;



  const scrollBody = (

    <DamiatLandingScrollBody

      events={events}

      problem={problem}

      calculator={calculator}

      scenario={scenario}

      deviceIntro={deviceIntro}

      devicePrinciple={devicePrinciple}

      deviceCapabilities={deviceCapabilities}

      dashboardStats={dashboardStats}

      dashboardAlerts={dashboardAlerts}

      howItWorks={howItWorks}

      caseStudyStats={caseStudyStats}

      caseStudyDetails={caseStudyDetails}

      trust={trust}

      partners={partners}

      logoCloud={logoCloud}

      contactHero={contactHero}

      footer={footer}

      navbar={navbar}

      heroProps={heroProps}

      brandBandEvents={brandBandEvents}

      mainHeroImage={mainHeroImage}

      backgrounds={backgrounds}

      scrollLoop={scrollLoop}

    />

  );



  return (

    <div className={cn(className, navbar.overlay && !mainHeroImage && 'bg-[var(--core-green-900)]')}>

      <NavbarBlock {...navbar} />

      <ScrollLoopShell enabled={scrollLoop}>{scrollBody}</ScrollLoopShell>

    </div>

  );

};



DamiatLandingPage.displayName = 'DamiatLandingPage';

