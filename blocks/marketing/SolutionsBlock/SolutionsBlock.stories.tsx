import type { Meta, StoryObj } from '@storybook/react';
import { SolutionsBlock } from './SolutionsBlock';
import { HeroBlock } from '../HeroBlock/HeroBlock';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';
import {
  aicadsSolutionsCatalogDemoContent,
  aicadsSolutionsDemoContent,
  aicadsSolutionsPageHeroDemoContent,
} from '../marketingDemoContent';
import { withSolutionCardCovers } from '../solutionsDemoMedia';
import { withSolutionCatalogIcons } from './solutionsCatalogDemoMedia';
import { solutionsPageHeroMedia } from '../solutionsPageHeroMedia';
import { damiatCaseDetailRelatedProjects } from '../damiatCaseDetailFixtures';

const meta: Meta<typeof SolutionsBlock> = {
  title: 'Blocks/Marketing/SolutionsBlock',
  component: SolutionsBlock,
  parameters: {
    ...marketingBlockParameters,
    controls: { disable: true },
  },
};
export default meta;

type Story = StoryObj<typeof SolutionsBlock>;

const renderShowcaseDemo = () => (
  <SolutionsBlock {...withSolutionCardCovers({ ...aicadsSolutionsDemoContent })} />
);

const renderCatalogDemo = () => (
  <SolutionsBlock {...withSolutionCatalogIcons({ ...aicadsSolutionsCatalogDemoContent })} />
);

const renderSolutionsPageDemo = () => (
  <>
    <HeroBlock {...aicadsSolutionsPageHeroDemoContent} media={solutionsPageHeroMedia} />
    <SolutionsBlock {...withSolutionCatalogIcons({ ...aicadsSolutionsCatalogDemoContent })} />
  </>
);

/** Cortel landing case studies — asymmetric desktop grid, mobile scroll, inverse hover reveal. */
export const Showcase: Story = {
  render: () => renderShowcaseDemo(),
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

/** @deprecated Use Showcase — kept for existing story IDs. */
export const Default: Story = {
  render: () => renderShowcaseDemo(),
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const ShowcaseMobile: Story = {
  render: () => renderShowcaseDemo(),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};

/** Cortel /solutions catalog — equal 3-col bordered cards with icon + arrow CTA. */
export const Catalog: Story = {
  render: () => renderCatalogDemo(),
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const CatalogMobile: Story = {
  render: () => renderCatalogDemo(),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};

export const CatalogTablet: Story = {
  render: () => renderCatalogDemo(),
  parameters: { viewport: { defaultViewport: 'tablet' } },
};

/** Cortel case detail related projects — equal 3-col SolutionCard grid. */
export const Grid: Story = {
  render: () => <SolutionsBlock {...damiatCaseDetailRelatedProjects} />,
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

/** Full Cortel /solutions page — hero panel + catalog grid. */
export const SolutionsPage: Story = {
  render: () => renderSolutionsPageDemo(),
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const SolutionsPageMobile: Story = {
  render: () => renderSolutionsPageDemo(),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};

export const Desktop: Story = {
  render: () => renderShowcaseDemo(),
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const Mobile: Story = {
  render: () => renderShowcaseDemo(),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};

export const Tablet: Story = {
  render: () => renderShowcaseDemo(),
  parameters: { viewport: { defaultViewport: 'tablet' } },
};
