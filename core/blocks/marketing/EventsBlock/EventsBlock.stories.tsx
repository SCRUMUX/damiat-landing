import type { Meta, StoryObj } from '@storybook/react';
import { EventsBlock } from './EventsBlock';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';
import {
  aicadsEnterpriseEventsCarouselDemo,
  aicadsEnterpriseEventsDemo,
  aicadsEnterpriseEventsListDemo,
} from '../marketingDemoContent';

const meta: Meta<typeof EventsBlock> = {
  title: 'Blocks/Marketing/EventsBlock',
  component: EventsBlock,
  parameters: marketingBlockParameters,
  args: aicadsEnterpriseEventsDemo,
};
export default meta;

type Story = StoryObj<typeof EventsBlock>;

/** Cortel-style brand band — title + nav left, meta tags + event title right. */
export const Featured: Story = {
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const FeaturedCarousel: Story = {
  args: aicadsEnterpriseEventsCarouselDemo,
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const FeaturedMobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile' } },
};

export const List: Story = {
  args: aicadsEnterpriseEventsListDemo,
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile' } } };
export const Tablet: Story = { parameters: { viewport: { defaultViewport: 'tablet' } } };
export const Desktop: Story = { parameters: { viewport: { defaultViewport: 'desktop' } } };
