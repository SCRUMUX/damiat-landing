import React from 'react';
import { cn } from '@ai-ds/core/shared';
import './damiatLandingScroll.css';
import './damiatLandingTypography.css';
import { useScrollActivity } from '../../../hooks/useScrollActivity';
import { BrandPhotoHeroSection } from '@ai-ds/core/blocks/_shared/BrandPhotoHeroSection';
import { DamiatBridgeSection } from '../../_shared/DamiatBridgeSection';
import { MarketingAboveFold } from '@ai-ds/core/blocks/_shared/MarketingAboveFold';
import {
  ScrollDepthReveal,
  type ScrollDepthIntensity,
} from '../../_shared/ScrollDepthReveal';
import { NavbarBlock, type NavbarBlockProps } from '@ai-ds/core/blocks/NavbarBlock';
import { HeroBlock, type HeroBlockProps } from '@ai-ds/core/blocks/HeroBlock';
import { EventsBlock, type EventsBlockProps } from '@ai-ds/core/blocks/EventsBlock';
import { FeaturesBlock, type FeaturesBlockProps } from '@ai-ds/core/blocks/FeaturesBlock';
import { DamiatCalculatorBlock, type DamiatCalculatorBlockProps } from '../DamiatCalculatorBlock';
import { ShowcasePanelBlock, type ShowcasePanelBlockProps } from '@ai-ds/core/blocks/ShowcasePanelBlock';
import { WhyUsBlock, type WhyUsBlockProps } from '@ai-ds/core/blocks/WhyUsBlock';
import { StatsBlock, type StatsBlockProps } from '@ai-ds/core/blocks/StatsBlock';
import { ProcessBlock, type ProcessBlockProps } from '@ai-ds/core/blocks/ProcessBlock';
import { ChooseUsBlock, type ChooseUsBlockProps } from '@ai-ds/core/blocks/ChooseUsBlock';
import { DamiatCaseStudiesBlock, type DamiatCaseStudiesBlockProps } from '../DamiatCaseStudiesBlock';
import { DamiatVolumeBenefitBlock, type DamiatVolumeBenefitBlockProps } from '../DamiatVolumeBenefitBlock';
import { TrustBlock, type TrustBlockProps } from '@ai-ds/core/blocks/TrustBlock';
import { PartnersBlock, type PartnersBlockProps } from '@ai-ds/core/blocks/PartnersBlock';
import { ContactHeroBlock, type ContactHeroBlockProps } from '@ai-ds/core/blocks/ContactHeroBlock';
import { FooterBlock, type FooterBlockProps } from '@ai-ds/core/blocks/FooterBlock';
import {
  damiatLandingHeroBackgrounds,
  type DamiatLandingHeroBackgroundKey,
} from '../demo-assets/damiatLandingHeroBackgrounds';
import { DamiatGasOscilloscope } from '../demo-assets/DamiatGasOscilloscope';
import { damiatBridgeImage, damiatBridgePhrase } from '../damiatBridgeContent';

export type DamiatLandingHeroBackgrounds = typeof damiatLandingHeroBackgrounds;

/** `lean` — no parallax, fade reveals on key sections; `full` — legacy motion stack. */
export type DamiatMotionProfile = 'lean' | 'full';

function LandingSectionReveal({
  profile,
  intensity = 'medium',
  staggerChildren,
  children,
}: {
  profile: DamiatMotionProfile;
  intensity?: ScrollDepthIntensity;
  staggerChildren?: boolean;
  children: React.ReactNode;
}) {
  if (profile === 'full') {
    return (
      <ScrollDepthReveal
        variant="depth"
        intensity={intensity}
        staggerChildren={staggerChildren}
      >
        {children}
      </ScrollDepthReveal>
    );
  }

  return (
    <ScrollDepthReveal variant="fade" intensity={intensity} staggerChildren={staggerChildren}>
      {children}
    </ScrollDepthReveal>
  );
}

export interface DamiatLandingScrollBodyProps {
  events: EventsBlockProps;
  problem: FeaturesBlockProps;
  calculator: DamiatCalculatorBlockProps;
  scenario: ShowcasePanelBlockProps;
  deviceIntro: WhyUsBlockProps;
  devicePrinciple: ProcessBlockProps;
  dashboardStats: StatsBlockProps;
  generatorBenefits: ChooseUsBlockProps;
  caseStudies: DamiatCaseStudiesBlockProps;
  volumeBenefit: DamiatVolumeBenefitBlockProps;
  trust: TrustBlockProps;
  partners: PartnersBlockProps;
  contactHero: ContactHeroBlockProps;
  footer: FooterBlockProps;
  navbar: NavbarBlockProps;
  heroProps: HeroBlockProps;
  brandBandEvents: boolean;
  mainHeroImage?: string;
  backgrounds: DamiatLandingHeroBackgrounds;
  motionProfile?: DamiatMotionProfile;
}

/** Scrollable landing body (hero through footer). */
export const DamiatLandingScrollBody: React.FC<DamiatLandingScrollBodyProps> = ({
  events,
  problem,
  calculator,
  scenario,
  deviceIntro,
  devicePrinciple,
  dashboardStats,
  generatorBenefits,
  caseStudies,
  volumeBenefit,
  trust,
  partners,
  contactHero,
  footer,
  navbar,
  heroProps,
  brandBandEvents,
  mainHeroImage,
  backgrounds,
  motionProfile = 'lean',
}) => {
  const lean = motionProfile === 'lean';
  useScrollActivity(lean);
  const imageParallax = lean ? 0 : 0.14;
  const contentParallax = lean ? 0 : 0.05;
  const contactContentParallax = lean ? 0 : 0.03;
  const photoGrain = lean ? 'none' : 'strong';
  const contactGrain = lean ? 'none' : 'heavy';
  const photoDepth = lean ? 'standard' : 'enhanced';
  const heroGrain = lean ? 'none' : 'strong';

  const photoHeroSectionClass = lean
    ? 'flex min-h-[min(100svh,720px)] flex-col'
    : 'flex min-h-[100svh] flex-col';
  const photoHeroContentClass = 'flex min-h-0 flex-1 flex-col justify-center';
  const contactHeroContentClass = 'flex min-h-0 flex-1 flex-col justify-between';

  return (
    <>
      <MarketingAboveFold
        underFixedNavbar={Boolean(navbar.sticky ?? true)}
        backgroundImageSrc={mainHeroImage}
        photoTone={mainHeroImage ? 'deep' : 'brand'}
        imageParallaxFactor={imageParallax}
        grainIntensity={heroGrain}
        className={cn('flex min-h-[100svh] flex-col')}
      >
        <HeroBlock
          {...heroProps}
          depthParallax={!lean}
          media={heroProps.media ?? <DamiatGasOscilloscope staticDisplay={lean} />}
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
        <LandingSectionReveal profile={motionProfile} intensity="subtle">
          <FeaturesBlock {...problem} />
        </LandingSectionReveal>
      </div>

      <div id="calculator">
        <LandingSectionReveal profile={motionProfile} intensity="strong">
          <DamiatCalculatorBlock {...calculator} />
        </LandingSectionReveal>
      </div>

      <BrandPhotoHeroSection
        id="scenarios"
        backgroundImageSrc={backgrounds.scenarios}
        photoTone="deep"
        grainIntensity={photoGrain}
        depth={photoDepth}
        className={photoHeroSectionClass}
        contentClassName={photoHeroContentClass}
        imageParallaxFactor={imageParallax}
        contentParallaxFactor={contentParallax}
      >
        <LandingSectionReveal profile={motionProfile} intensity="strong">
          <ShowcasePanelBlock {...scenario} parallax={false} className="!bg-transparent" />
        </LandingSectionReveal>
      </BrandPhotoHeroSection>

      <div id="device">
        <LandingSectionReveal profile={motionProfile} intensity="strong">
          <WhyUsBlock {...deviceIntro} />
        </LandingSectionReveal>
      </div>

      <div id="technology">
        <LandingSectionReveal profile={motionProfile} intensity="strong">
          <ProcessBlock {...devicePrinciple} />
        </LandingSectionReveal>
      </div>

      <div id="dashboard">
        <BrandPhotoHeroSection
          backgroundImageSrc={backgrounds.platform}
          photoTone="deep"
          grainIntensity={photoGrain}
          depth={photoDepth}
          className={photoHeroSectionClass}
          contentClassName={photoHeroContentClass}
          imageParallaxFactor={imageParallax}
          contentParallaxFactor={contentParallax}
        >
          <LandingSectionReveal profile={motionProfile} intensity="strong">
            <StatsBlock {...dashboardStats} className="!bg-transparent" />
          </LandingSectionReveal>
        </BrandPhotoHeroSection>

        <div id="benefits">
          <LandingSectionReveal profile={motionProfile} intensity="medium">
            <ChooseUsBlock {...generatorBenefits} />
          </LandingSectionReveal>
        </div>
      </div>

      <div id="case">
        <BrandPhotoHeroSection
          backgroundImageSrc={backgrounds.case}
          photoTone="deep"
          grainIntensity={photoGrain}
          depth={photoDepth}
          className={photoHeroSectionClass}
          contentClassName={photoHeroContentClass}
          imageParallaxFactor={imageParallax}
          contentParallaxFactor={contentParallax}
        >
          <LandingSectionReveal profile={motionProfile} intensity="strong">
            <DamiatCaseStudiesBlock {...caseStudies} embeddedInPhotoHero className="!bg-transparent" />
          </LandingSectionReveal>
        </BrandPhotoHeroSection>

        <LandingSectionReveal profile={motionProfile} intensity="medium">
          <DamiatVolumeBenefitBlock {...volumeBenefit} />
        </LandingSectionReveal>
      </div>

      <div id="trust">
        <LandingSectionReveal profile={motionProfile} intensity="medium" staggerChildren>
          <TrustBlock {...trust} />
          <PartnersBlock {...partners} />
        </LandingSectionReveal>
      </div>

      <div>
        <DamiatBridgeSection
          imageSrc={damiatBridgeImage}
          phrase={damiatBridgePhrase}
          grain={!lean}
        />
      </div>

      <BrandPhotoHeroSection
        id="contact"
        backgroundImageSrc={backgrounds.closing}
        photoTone="deep"
        grainIntensity={contactGrain}
        depth={photoDepth}
        className={photoHeroSectionClass}
        contentClassName={contactHeroContentClass}
        imageParallaxFactor={imageParallax}
        contentParallaxFactor={contactContentParallax}
      >
        <LandingSectionReveal profile={motionProfile} intensity="subtle" staggerChildren>
          <ContactHeroBlock
            {...contactHero}
            embeddedInPhotoHero
            className="!bg-transparent min-h-0 flex-1"
          />
          <FooterBlock {...footer} className="!bg-transparent" showTopDivider={false} />
        </LandingSectionReveal>
      </BrandPhotoHeroSection>
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
  dashboardStats: StatsBlockProps;
  generatorBenefits: ChooseUsBlockProps;
  caseStudies: DamiatCaseStudiesBlockProps;
  volumeBenefit: DamiatVolumeBenefitBlockProps;
  trust: TrustBlockProps;
  partners: PartnersBlockProps;
  contactHero: ContactHeroBlockProps;
  footer: FooterBlockProps;
  heroBackgroundImage?: string;
  sectionBackgrounds?: Partial<Record<DamiatLandingHeroBackgroundKey, string>>;
  /** Default `lean` for Product Landing — lighter scroll + fade reveals on key sections. */
  motionProfile?: DamiatMotionProfile;
  className?: string;
}

/** DAMIAT product landing — calculator & scenarios, then ethylene generator, platform, case study. */
export const DamiatLandingPage: React.FC<DamiatLandingPageProps> = ({
  navbar,
  hero,
  events,
  problem,
  calculator,
  scenario,
  deviceIntro,
  devicePrinciple,
  dashboardStats,
  generatorBenefits,
  caseStudies,
  volumeBenefit,
  trust,
  partners,
  contactHero,
  footer,
  heroBackgroundImage,
  sectionBackgrounds,
  motionProfile = 'lean',
  className,
}) => {
  const heroProps =
    navbar.overlay && !hero.appearance ? { ...hero, appearance: 'brand' as const } : hero;
  const brandBandEvents = events.variant === undefined || events.variant === 'featured';
  const backgrounds = { ...damiatLandingHeroBackgrounds, ...sectionBackgrounds };
  const mainHeroImage = heroBackgroundImage ?? backgrounds.main;

  return (
    <div
      data-damiat-landing-scroll=""
      className={cn(className, navbar.overlay && !mainHeroImage && 'bg-[var(--core-green-900)]')}
    >
      <NavbarBlock {...navbar} scrollPerf={motionProfile === 'lean'} />
      <DamiatLandingScrollBody
        events={events}
        problem={problem}
        calculator={calculator}
        scenario={scenario}
        deviceIntro={deviceIntro}
        devicePrinciple={devicePrinciple}
        dashboardStats={dashboardStats}
        generatorBenefits={generatorBenefits}
        caseStudies={caseStudies}
        volumeBenefit={volumeBenefit}
        trust={trust}
        partners={partners}
        contactHero={contactHero}
        footer={footer}
        navbar={navbar}
        heroProps={heroProps}
        brandBandEvents={brandBandEvents}
        mainHeroImage={mainHeroImage}
        backgrounds={backgrounds}
        motionProfile={motionProfile}
      />
    </div>
  );
};

DamiatLandingPage.displayName = 'DamiatLandingPage';
