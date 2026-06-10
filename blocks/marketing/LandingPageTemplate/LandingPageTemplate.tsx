import React from 'react';
import { cn } from '../../../components/primitives/_shared';
import { HeroBlock, type HeroBlockProps } from '../HeroBlock';
import { FeaturesBlock, type FeaturesBlockProps } from '../FeaturesBlock';
import { PricingBlock, type PricingBlockProps } from '../PricingBlock';
import { CTABlock, type CTABlockProps } from '../CTABlock';
import { FooterBlock, type FooterBlockProps } from '../FooterBlock';
import { NavbarBlock, type NavbarBlockProps } from '../NavbarBlock';
import { LogoCloudBlock, type LogoCloudBlockProps } from '../LogoCloudBlock';
import { StatsBlock, type StatsBlockProps } from '../StatsBlock';
import { TestimonialsBlock, type TestimonialsBlockProps } from '../TestimonialsBlock';
import { FAQBlock, type FAQBlockProps } from '../FAQBlock';
import { HowItWorksBlock, type HowItWorksBlockProps } from '../HowItWorksBlock';
import { NewsletterBlock, type NewsletterBlockProps } from '../NewsletterBlock';
import { EventsBlock, type EventsBlockProps } from '../EventsBlock';
import { ServicesBlock, type ServicesBlockProps } from '../ServicesBlock';
import { SolutionsBlock, type SolutionsBlockProps } from '../SolutionsBlock';
import { TrustBlock, type TrustBlockProps } from '../TrustBlock';
import { SupportBlock, type SupportBlockProps } from '../SupportBlock';
import { ShowcasePanelBlock, type ShowcasePanelBlockProps } from '../ShowcasePanelBlock';
import { BlogBlock, type BlogBlockProps } from '../BlogBlock';
import { PartnersBlock, type PartnersBlockProps } from '../PartnersBlock';
import { ContactHeroBlock, type ContactHeroBlockProps } from '../ContactHeroBlock';
import { WhyUsBlock, type WhyUsBlockProps } from '../WhyUsBlock';
import { ChooseUsBlock, type ChooseUsBlockProps } from '../ChooseUsBlock';
import { ProcessBlock, type ProcessBlockProps } from '../ProcessBlock';
import { solutionsPageHeroMedia } from '../solutionsPageHeroMedia';
import { MarketingAboveFold } from '../../_shared/MarketingAboveFold';

export interface LandingPageTemplateProps {
  hero: HeroBlockProps;
  features: FeaturesBlockProps;
  pricing: PricingBlockProps;
  cta: CTABlockProps;
  footer: FooterBlockProps;
  navbar?: NavbarBlockProps;
  logoCloud?: LogoCloudBlockProps;
  stats?: StatsBlockProps;
  testimonials?: TestimonialsBlockProps;
  howItWorks?: HowItWorksBlockProps;
  faq?: FAQBlockProps;
  newsletter?: NewsletterBlockProps;
  events?: EventsBlockProps;
  services?: ServicesBlockProps;
  /** Cortel /solutions page hero — muted panel + decorative media bleed. */
  solutionsPageHero?: HeroBlockProps;
  solutions?: SolutionsBlockProps;
  /** Cortel /solutions catalog — bordered 3-col cards (separate from showcase mosaic). */
  solutionsCatalog?: Extract<SolutionsBlockProps, { variant: 'catalog' }>;
  trust?: TrustBlockProps;
  support?: SupportBlockProps;
  showcasePanel?: ShowcasePanelBlockProps;
  blog?: BlogBlockProps;
  partners?: PartnersBlockProps;
  contactHero?: ContactHeroBlockProps;
  whyUs?: WhyUsBlockProps;
  chooseUs?: ChooseUsBlockProps;
  process?: ProcessBlockProps;
  className?: string;
}

function resolveAboveFoldHero(hero: HeroBlockProps, navbar?: NavbarBlockProps): HeroBlockProps {
  if (!navbar?.overlay) return hero;
  return {
    ...hero,
    appearance: hero.appearance ?? 'brand',
  };
}

/**
 * Full marketing landing page — section order from ai-patterns.json pageTemplates.
 * `marketing.landing.default` uses core five sections; `marketing.landing.saas` adds optional blocks.
 */
export const LandingPageTemplate: React.FC<LandingPageTemplateProps> = ({
  hero,
  features,
  pricing,
  cta,
  footer,
  navbar,
  logoCloud,
  stats,
  testimonials,
  howItWorks,
  faq,
  newsletter,
  events,
  services,
  solutionsPageHero,
  solutions,
  solutionsCatalog,
  trust,
  support,
  showcasePanel,
  blog,
  partners,
  contactHero,
  whyUs,
  chooseUs,
  process,
  className,
}) => {
  const heroProps = resolveAboveFoldHero(hero, navbar);
  const useAboveFold = Boolean(navbar?.overlay);
  const brandBandEvents =
    useAboveFold && events && (events.variant === undefined || events.variant === 'featured');

  return (
    <div className={cn(className, useAboveFold && 'bg-[var(--color-brand-primary)]')}>
      {navbar && <NavbarBlock {...navbar} />}
      {useAboveFold ? (
        <MarketingAboveFold
          underFixedNavbar={Boolean(navbar?.sticky ?? true)}
          className="flex min-h-[100svh] flex-col"
        >
          <HeroBlock
            {...heroProps}
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
            <EventsBlock
              {...events}
              sectionStyle={{
                paddingTop: 'calc(var(--space-section-y-m) - var(--space-30))',
                paddingBottom: 'var(--space-section-y-m)',
                ...(events.sectionStyle ?? {}),
              }}
              className={cn('shrink-0 !bg-transparent', events.className)}
            />
          ) : null}
        </MarketingAboveFold>
      ) : (
        <HeroBlock {...heroProps} />
      )}
      {events && !brandBandEvents ? <EventsBlock {...events} /> : null}
      {solutions && <SolutionsBlock {...solutions} />}
      {solutionsPageHero ? (
        <HeroBlock {...solutionsPageHero} media={solutionsPageHero.media ?? solutionsPageHeroMedia} />
      ) : null}
      {solutionsCatalog && <SolutionsBlock {...solutionsCatalog} />}
      {services && <ServicesBlock {...services} />}
      {support && <SupportBlock {...support} />}
      {chooseUs && <ChooseUsBlock {...chooseUs} />}
      {trust && <TrustBlock {...trust} />}
      {showcasePanel && <ShowcasePanelBlock {...showcasePanel} />}
      {partners && <PartnersBlock {...partners} />}
      {blog && <BlogBlock {...blog} />}
      {logoCloud && <LogoCloudBlock {...logoCloud} />}
      {stats && <StatsBlock {...stats} />}
      <FeaturesBlock {...features} />
      {howItWorks && <HowItWorksBlock {...howItWorks} />}
      <PricingBlock {...pricing} />
      {testimonials && <TestimonialsBlock {...testimonials} />}
      <CTABlock {...cta} />
      {whyUs && <WhyUsBlock {...whyUs} />}
      {process && <ProcessBlock {...process} />}
      {faq && <FAQBlock {...faq} />}
      {newsletter && <NewsletterBlock {...newsletter} />}
      {contactHero && <ContactHeroBlock {...contactHero} />}
      <FooterBlock {...footer} />
    </div>
  );
};

LandingPageTemplate.displayName = 'LandingPageTemplate';
