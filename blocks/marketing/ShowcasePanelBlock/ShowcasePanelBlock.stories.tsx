import type { Meta, StoryObj } from '@storybook/react';
import { ShowcasePanelBlock } from './ShowcasePanelBlock';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';
import { aicadsShowcasePanelDemoContent } from '../marketingDemoContent';
import { withShowcasePanelDemoMedia } from '../showcasePanelDemoMedia';

const meta: Meta<typeof ShowcasePanelBlock> = {
  title: 'Blocks/Marketing/ShowcasePanelBlock',
  component: ShowcasePanelBlock,
  parameters: {
    ...marketingBlockParameters,
    controls: { disable: true },
  },
};
export default meta;

type Story = StoryObj<typeof ShowcasePanelBlock>;

const renderShowcasePanelDemo = () => (
  <ShowcasePanelBlock {...withShowcasePanelDemoMedia({ ...aicadsShowcasePanelDemoContent })} />
);

/** Cortel-style interactive panel — flex accordion cards + crossfade preview. */
export const Default: Story = {
  render: () => renderShowcasePanelDemo(),
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const Mobile: Story = {
  render: () => renderShowcasePanelDemo(),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};

export const Tablet: Story = {
  render: () => renderShowcasePanelDemo(),
  parameters: { viewport: { defaultViewport: 'tablet' } },
};

export const Desktop: Story = {
  render: () => renderShowcasePanelDemo(),
  parameters: { viewport: { defaultViewport: 'desktop' } },
};
