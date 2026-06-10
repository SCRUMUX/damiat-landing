import type { Meta, StoryObj } from '@storybook/react';
import { WhyUsBlock } from './WhyUsBlock';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';
import { aicadsWhyUsDemoContent } from '../marketingDemoContent';
import { withWhyUsDemoIcons } from '../whyUsDemoMedia';

const meta: Meta<typeof WhyUsBlock> = {
  title: 'Blocks/Marketing/WhyUsBlock',
  component: WhyUsBlock,
  parameters: {
    ...marketingBlockParameters,
    controls: { disable: true },
  },
};
export default meta;

type Story = StoryObj<typeof WhyUsBlock>;

const renderWhyUsDemo = () => <WhyUsBlock {...withWhyUsDemoIcons({ ...aicadsWhyUsDemoContent })} />;

/** Cortel vmware-style credibility grid — 2+featured / 3+featured mobile. */
export const Default: Story = {
  render: () => renderWhyUsDemo(),
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const Mobile: Story = {
  render: () => renderWhyUsDemo(),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};

export const Tablet: Story = {
  render: () => renderWhyUsDemo(),
  parameters: { viewport: { defaultViewport: 'tablet' } },
};

export const Desktop: Story = {
  render: () => renderWhyUsDemo(),
  parameters: { viewport: { defaultViewport: 'desktop' } },
};
