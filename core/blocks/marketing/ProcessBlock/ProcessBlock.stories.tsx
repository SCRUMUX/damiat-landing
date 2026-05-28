import type { Meta, StoryObj } from '@storybook/react';
import { ProcessBlock } from './ProcessBlock';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';
import { aicadsProcessDemoContent } from '../marketingDemoContent';

const meta: Meta<typeof ProcessBlock> = {
  title: 'Blocks/Marketing/ProcessBlock',
  component: ProcessBlock,
  parameters: {
    ...marketingBlockParameters,
    controls: { disable: true },
  },
};
export default meta;

type Story = StoryObj<typeof ProcessBlock>;

/** Cortel vmware-style process timeline — vertical mobile, horizontal desktop. */
export const Default: Story = {
  render: () => <ProcessBlock {...aicadsProcessDemoContent} />,
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const Mobile: Story = {
  render: () => <ProcessBlock {...aicadsProcessDemoContent} />,
  parameters: { viewport: { defaultViewport: 'mobile' } },
};

export const Tablet: Story = {
  render: () => <ProcessBlock {...aicadsProcessDemoContent} />,
  parameters: { viewport: { defaultViewport: 'tablet' } },
};

export const Desktop: Story = {
  render: () => <ProcessBlock {...aicadsProcessDemoContent} />,
  parameters: { viewport: { defaultViewport: 'desktop' } },
};
