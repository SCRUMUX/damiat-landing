import React from 'react';
import { cn } from '../../../components/primitives/_shared';
import { SectionShell } from '../../_shared/SectionShell';
import { BrandPhotoHeroSection } from '../../_shared/BrandPhotoHeroSection';
import { MarketingAboveFold } from '../../_shared/MarketingAboveFold';
import { NavbarBlock, type NavbarBlockProps } from '../NavbarBlock';
import { HeroBlock, type HeroBlockProps } from '../HeroBlock';
import { SolutionsBlock, type SolutionsBlockProps } from '../SolutionsBlock';
import { ContactHeroBlock, type ContactHeroBlockProps } from '../ContactHeroBlock';
import { FooterBlock, type FooterBlockProps } from '../FooterBlock';
import { CaseStudyIntroBlock, type CaseStudyIntroBlockProps } from '../CaseStudyIntroBlock';
import { CaseStudyInlineStatsBlock, type CaseStudyInlineStatsBlockProps } from '../CaseStudyInlineStatsBlock';
import { CaseStudyImplementedBlock, type CaseStudyImplementedBlockProps } from '../CaseStudyImplementedBlock';
import { CaseStudySectionsBlock, type CaseStudySectionsBlockProps } from '../CaseStudySectionsBlock';
import { CaseStudyArticleSplit } from '../CaseStudyArticleSplit';
import type { CaseStudyAnchorNavProps } from '../CaseStudyAnchorNav';
import { damiatLandingHeroBackgrounds } from '../demo-assets/damiatLandingHeroBackgrounds';

export interface DamiatCaseDetailPageProps {
  navbar: NavbarBlockProps;
  hero: HeroBlockProps;
  intro: CaseStudyIntroBlockProps;
  anchorNav: Pick<CaseStudyAnchorNavProps, 'items'>;
  businessResults: CaseStudyInlineStatsBlockProps;
  implemented: CaseStudyImplementedBlockProps;
  narrative: CaseStudySectionsBlockProps;
  relatedProjects: Extract<SolutionsBlockProps, { variant: 'grid' }>;
  contactHero: ContactHeroBlockProps;
  footer: FooterBlockProps;
  closingBackgroundImage?: string;
  heroBackgroundImage?: string;
  className?: string;
}

export const DamiatCaseDetailPage: React.FC<DamiatCaseDetailPageProps> = ({
  navbar,
  hero,
  intro,
  anchorNav,
  businessResults,
  implemented,
  narrative,
  relatedProjects,
  contactHero,
  footer,
  closingBackgroundImage = damiatLandingHeroBackgrounds.closing,
  heroBackgroundImage = damiatLandingHeroBackgrounds.case,
  className,
}) => (
  <div className={cn('min-h-[100svh] bg-[var(--color-surface-1)]', className)} aria-label="DAMIAT case detail">
    <NavbarBlock {...navbar} />
    <MarketingAboveFold
      underFixedNavbar
      backgroundImageSrc={heroBackgroundImage}
      photoTone="deep"
      className="min-h-[min(100svh,520px)]"
    >
      <SectionShell
        recipe="section.hero.page"
        appearance="brand"
        className="!bg-transparent flex min-h-0 flex-1 flex-col justify-end text-[var(--color-text-on-brand)]"
        aria-label="Case study hero"
      >
        <HeroBlock embedded {...hero} className="!bg-transparent" />
      </SectionShell>
    </MarketingAboveFold>
    <SectionShell recipe="section.case-intro" appearance="surface" className="!pb-[var(--space-section-y-m)]">
      <CaseStudyIntroBlock embedded {...intro} />
    </SectionShell>
    <SectionShell recipe="section.case-article" appearance="surface" className="!pt-0">
      <CaseStudyArticleSplit nav={anchorNav}>
        <CaseStudyInlineStatsBlock {...businessResults} />
        <CaseStudyImplementedBlock {...implemented} />
        <CaseStudySectionsBlock embedded {...narrative} />
      </CaseStudyArticleSplit>
    </SectionShell>
    <SolutionsBlock variant="grid" {...relatedProjects} />
    <BrandPhotoHeroSection
      id="contact"
      backgroundImageSrc={closingBackgroundImage}
      photoTone="deep"
      grainIntensity="none"
      depth="standard"
      className="flex min-h-[min(100svh,720px)] flex-col"
      contentClassName="flex min-h-0 flex-1 flex-col justify-between"
    >
      <ContactHeroBlock
        {...contactHero}
        embeddedInPhotoHero
        className="!bg-transparent min-h-0 flex-1"
      />
      <FooterBlock {...footer} className="!bg-transparent" showTopDivider={false} />
    </BrandPhotoHeroSection>
  </div>
);

DamiatCaseDetailPage.displayName = 'DamiatCaseDetailPage';
