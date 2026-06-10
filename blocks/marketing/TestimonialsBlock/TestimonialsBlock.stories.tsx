import type { Meta, StoryObj } from '@storybook/react';
import { TestimonialsBlock } from './TestimonialsBlock';

const meta: Meta<typeof TestimonialsBlock> = {
  title: 'Blocks/Marketing/TestimonialsBlock',
  component: TestimonialsBlock,
  parameters: { layout: 'fullscreen' },
  args: {
    testimonials: [
      {
        quote: 'We stopped hand-rolling landing spacing. AICADS blocks gave us a consistent rhythm overnight.',
        author: 'Alex Kim',
        role: 'Design Lead, Pattern Labs',
      },
      {
        quote: 'Storybook + ai-patterns.json is exactly what our AI assembler needed.',
        author: 'Jordan Lee',
        role: 'Staff Engineer, Token Studio',
      },
      {
        quote: 'Pricing and hero sections look production-ready on mobile without custom CSS.',
        author: 'Sam Rivera',
        role: 'Founder, Startup Co',
      },
    ],
  },
};
export default meta;

type Story = StoryObj<typeof TestimonialsBlock>;

export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile' } } };
export const Tablet: Story = { parameters: { viewport: { defaultViewport: 'tablet' } } };
export const Desktop: Story = { parameters: { viewport: { defaultViewport: 'desktop' } } };
