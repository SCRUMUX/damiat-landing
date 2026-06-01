/**
 * AICADS pattern blocks — distributable composed sections for consumer apps.
 *
 * Prefer granular imports:
 *   import { HeroBlock } from '@ai-ds/core/blocks/HeroBlock';
 */

export { HeroBlock } from './marketing/HeroBlock';
export type { HeroBlockProps, HeroBlockAction, HeroStat, HeroBreadcrumbItem } from './marketing/HeroBlock';

export { FeaturesBlock } from './marketing/FeaturesBlock';
export type { FeaturesBlockProps, FeatureItem } from './marketing/FeaturesBlock';

export { PricingBlock } from './marketing/PricingBlock';
export type { PricingBlockProps, PricingTier } from './marketing/PricingBlock';

export { CTABlock } from './marketing/CTABlock';
export type { CTABlockProps, CTABlockAction } from './marketing/CTABlock';

export { FooterBlock } from './marketing/FooterBlock';
export type { FooterBlockProps, FooterColumn, FooterSocialLink, FooterContactItem, FooterLegalLink, FooterLink } from './marketing/FooterBlock';

export { NavbarBlock } from './marketing/NavbarBlock';
export type {
  NavbarBlockProps,
  NavbarLink,
  NavbarBlockStoryProps,
  NavbarServiceCategory,
  NavbarServiceItem,
  NavbarSocialLink,
  NavbarPhoneInfo,
  NavbarCta,
  NavbarSocialIcon,
} from './marketing/NavbarBlock';
export { aicadsProNavbarFixture } from './marketing/NavbarBlock';

export { LogoCloudBlock } from './marketing/LogoCloudBlock';
export type { LogoCloudBlockProps, LogoCloudItem } from './marketing/LogoCloudBlock';

export { StatsBlock } from './marketing/StatsBlock';
export type { StatsBlockProps, StatItem } from './marketing/StatsBlock';

export { TestimonialsBlock } from './marketing/TestimonialsBlock';
export type { TestimonialsBlockProps, TestimonialItem } from './marketing/TestimonialsBlock';

export { FAQBlock } from './marketing/FAQBlock';
export type { FAQBlockProps, FAQItem } from './marketing/FAQBlock';

export { HowItWorksBlock } from './marketing/HowItWorksBlock';
export type { HowItWorksBlockProps, HowItWorksStep } from './marketing/HowItWorksBlock';

export { NewsletterBlock } from './marketing/NewsletterBlock';
export type { NewsletterBlockProps } from './marketing/NewsletterBlock';

export { EventsBlock } from './marketing/EventsBlock';
export type { EventsBlockProps, EventItem, EventFormat } from './marketing/EventsBlock';

export { ServicesBlock } from './marketing/ServicesBlock';
export type {
  ServicesBlockProps,
  ServiceCategory,
  ServiceItem,
  ServiceItemAction,
} from './marketing/ServicesBlock';

export { SolutionsBlock } from './marketing/SolutionsBlock';
export type {
  SolutionsBlockProps,
  SolutionItem,
  SolutionCatalogItem,
  SolutionsViewAllAction,
} from './marketing/SolutionsBlock';

export { TrustBlock } from './marketing/TrustBlock';
export type { TrustBlockProps, TrustPillarItem, TrustStandardItem } from './marketing/TrustBlock';

export { SupportBlock } from './marketing/SupportBlock';
export type { SupportBlockProps, SupportStatItem, SupportContactItem } from './marketing/SupportBlock';

export { ShowcasePanelBlock } from './marketing/ShowcasePanelBlock';
export type { ShowcasePanelBlockProps, ShowcasePanelItem, ShowcasePanelAction, ShowcasePanelAlert, ShowcasePanelMetric, ShowcasePanelMetricTrend, ShowcasePanelHarvestStatus, ShowcasePanelOperationMode, ShowcasePanelResource } from './marketing/ShowcasePanelBlock';

export { BlogBlock } from './marketing/BlogBlock';
export type { BlogBlockProps, BlogPostItem, BlogViewAllAction } from './marketing/BlogBlock';

export { PartnersBlock } from './marketing/PartnersBlock';
export type { PartnersBlockProps, PartnerItem } from './marketing/PartnersBlock';

export { ContactHeroBlock } from './marketing/ContactHeroBlock';
export type {
  ContactHeroBlockProps,
  ContactHeroFormLabels,
  ContactHeroFormValues,
} from './marketing/ContactHeroBlock';

export { WhyUsBlock } from './marketing/WhyUsBlock';
export type { WhyUsBlockProps, WhyUsCardItem, WhyUsFeaturedItem } from './marketing/WhyUsBlock';

export { ChooseUsBlock } from './marketing/ChooseUsBlock';
export type {
  ChooseUsBlockProps,
  ChooseUsCardItem,
  ChooseUsFeaturedItem,
  ChooseUsCardSize,
} from './marketing/ChooseUsBlock';

export { ProcessBlock } from './marketing/ProcessBlock';
export type { ProcessBlockProps, ProcessStepItem } from './marketing/ProcessBlock';

export { LandingPageTemplate } from './marketing/LandingPageTemplate';
export type { LandingPageTemplateProps } from './marketing/LandingPageTemplate';

export { DamiatCalculatorBlock } from './marketing/DamiatCalculatorBlock';
export type {
  DamiatCalculatorBlockProps,
  DamiatCalculatorFormValues,
  DamiatCalculatorSummaryData,
} from './marketing/DamiatCalculatorBlock';

export { DamiatLandingPage } from './marketing/DamiatLandingPage';
export type { DamiatLandingPageProps } from './marketing/DamiatLandingPage';

export { damiatLandingArgs, damiatNavbarFixture, damiatCalculatorContent } from './marketing/damiatLandingFixtures';

/** Enterprise landing demo fixtures — reference payloads for consumer apps. */
export {
  aicadsEnterpriseHeroDemoContent,
  aicadsEnterpriseHeroMedia,
  withEnterpriseHeroMedia,
} from './marketing/marketingDemoContent';
export { aicadsProEnterpriseLandingArgs } from './marketing/enterpriseLandingFixtures';
