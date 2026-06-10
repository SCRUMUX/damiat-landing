import type { Meta, StoryObj } from '@storybook/react';
import { GeneratedIcon } from './GeneratedIcon';

const meta: Meta<typeof GeneratedIcon> = {
  title: 'Components/GeneratedIcon',
  component: GeneratedIcon,
  parameters: { layout: 'centered' },
  args: {
    src: 'data:image/svg+xml,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect fill="%23e2e8f0" width="64" height="64"/><text x="32" y="36" text-anchor="middle" font-size="10" fill="%2364748b">Synaptik</text></svg>',
    ),
    alt: 'Placeholder generated icon',
    size: 64,
  },
};
export default meta;

type Story = StoryObj<typeof GeneratedIcon>;

export const Default: Story = {};

export const Large: Story = { args: { size: 128 } };
