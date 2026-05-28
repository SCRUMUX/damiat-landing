import type { Meta, StoryObj } from '@storybook/react';
import { ServicesBlock } from './ServicesBlock';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';
import { aicadsServicesDemoContent } from '../marketingDemoContent';
import { withServiceCardMedia } from '../servicesDemoMedia';

const meta: Meta<typeof ServicesBlock> = {
  title: 'Blocks/Marketing/ServicesBlock',
  component: ServicesBlock,
  parameters: {
    ...marketingBlockParameters,
    // Demo injects JSX card media in render() — keep args out of controls to avoid prettyPrint stack overflow.
    controls: { disable: true },
  },
};
export default meta;

type Story = StoryObj<typeof ServicesBlock>;

const renderServicesDemo = (overrides?: Partial<typeof aicadsServicesDemoContent>) => (
  <ServicesBlock {...withServiceCardMedia({ ...aicadsServicesDemoContent, ...overrides })} />
);

/** Cortel-style services catalog — sticky title + tabs, 3 cards, show more. */
export const Default: Story = {
  render: () => renderServicesDemo(),
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const Mobile: Story = {
  render: () => renderServicesDemo(),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};

export const Tablet: Story = {
  render: () => renderServicesDemo(),
  parameters: { viewport: { defaultViewport: 'tablet' } },
};

export const Desktop: Story = {
  render: () => renderServicesDemo(),
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const WithoutStickyHeader: Story = {
  render: () => renderServicesDemo({ stickyHeader: false }),
  parameters: { viewport: { defaultViewport: 'desktop' } },
};
