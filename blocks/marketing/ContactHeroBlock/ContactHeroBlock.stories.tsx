import type { Meta, StoryObj } from '@storybook/react';
import { ContactHeroBlock } from './ContactHeroBlock';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';
import { aicadsContactHeroDemoContent } from '../marketingDemoContent';

const meta: Meta<typeof ContactHeroBlock> = {
  title: 'Blocks/Marketing/ContactHeroBlock',
  component: ContactHeroBlock,
  parameters: {
    ...marketingBlockParameters,
    controls: { disable: true },
  },
};
export default meta;

type Story = StoryObj<typeof ContactHeroBlock>;

/** Cortel-style contact hero — brand parallax, split copy + glass form. */
export const Default: Story = {
  render: () => <ContactHeroBlock {...aicadsContactHeroDemoContent} />,
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const Mobile: Story = {
  render: () => <ContactHeroBlock {...aicadsContactHeroDemoContent} />,
  parameters: { viewport: { defaultViewport: 'mobile' } },
};

export const Tablet: Story = {
  render: () => <ContactHeroBlock {...aicadsContactHeroDemoContent} />,
  parameters: { viewport: { defaultViewport: 'tablet' } },
};

export const Desktop: Story = {
  render: () => <ContactHeroBlock {...aicadsContactHeroDemoContent} />,
  parameters: { viewport: { defaultViewport: 'desktop' } },
};
