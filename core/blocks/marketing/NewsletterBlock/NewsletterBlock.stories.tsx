import type { Meta, StoryObj } from '@storybook/react';
import { NewsletterBlock } from './NewsletterBlock';

const meta: Meta<typeof NewsletterBlock> = {
  title: 'Blocks/Marketing/NewsletterBlock',
  component: NewsletterBlock,
  parameters: { layout: 'fullscreen' },
  args: {
    subtitle: 'Product updates, pattern releases, and migration guides — no spam.',
    onSubmit: (email: string) => console.log('Subscribe:', email),
  },
};
export default meta;

type Story = StoryObj<typeof NewsletterBlock>;

export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile' } } };
export const Tablet: Story = { parameters: { viewport: { defaultViewport: 'tablet' } } };
export const Desktop: Story = { parameters: { viewport: { defaultViewport: 'desktop' } } };
