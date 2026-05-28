/**
 * Curated enterprise landing fixtures for consumer apps and Storybook.
 * Media/icon wrappers (withBlogDemoMedia, etc.) stay in stories — import block props only here.
 */
import type { LandingPageTemplateProps } from './LandingPageTemplate';
import { aicadsProNavbarFixture } from './NavbarBlock/navbarBlock.fixtures';
import {
  aicadsEnterpriseCtaDemo,
  aicadsEnterpriseEventsDemo,
  aicadsEnterpriseFeaturesDemo,
  aicadsEnterpriseFooterDemo,
  aicadsEnterpriseHeroDemoContent,
  aicadsEnterprisePricingDemo,
} from './marketingDemoContent';

/** Base AICADS PRO enterprise landing props — overlay navbar + brand hero (no demo media wrappers). */
export const aicadsProEnterpriseLandingArgs: LandingPageTemplateProps = {
  navbar: aicadsProNavbarFixture,
  hero: aicadsEnterpriseHeroDemoContent,
  events: aicadsEnterpriseEventsDemo,
  features: aicadsEnterpriseFeaturesDemo,
  pricing: aicadsEnterprisePricingDemo,
  cta: aicadsEnterpriseCtaDemo,
  footer: aicadsEnterpriseFooterDemo,
};
