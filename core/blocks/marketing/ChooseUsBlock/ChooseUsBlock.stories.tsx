import type { Meta, StoryObj } from '@storybook/react';
import { ChooseUsBlock } from './ChooseUsBlock';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';
import { aicadsChooseUsDemoContent } from '../marketingDemoContent';
import { chooseUsFeaturedDemoMedia, withChooseUsDemoIcons } from '../chooseUsDemoMedia';

const meta: Meta<typeof ChooseUsBlock> = {
  title: 'Blocks/Marketing/ChooseUsBlock',
  component: ChooseUsBlock,
  parameters: {
    ...marketingBlockParameters,
    controls: { disable: true },
  },
};
export default meta;

type Story = StoryObj<typeof ChooseUsBlock>;

const renderChooseUsDemo = () => (
  <ChooseUsBlock
    {...withChooseUsDemoIcons({
      ...aicadsChooseUsDemoContent,
      featured: {
        ...aicadsChooseUsDemoContent.featured,
        media: chooseUsFeaturedDemoMedia,
      },
    })}
  />
);

/** Cortel /company «Почему нас выбирают» — 5-card mosaic + featured support panel. */
export const Default: Story = {
  render: () => renderChooseUsDemo(),
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const Mobile: Story = {
  render: () => renderChooseUsDemo(),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};

export const Tablet: Story = {
  render: () => renderChooseUsDemo(),
  parameters: { viewport: { defaultViewport: 'tablet' } },
};

export const Desktop: Story = {
  render: () => renderChooseUsDemo(),
  parameters: { viewport: { defaultViewport: 'desktop' } },
};
