/**
 * AUTO-GENERATED – do not edit by hand.
 * Regenerate: npm run stories:generate
 */
import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Rating } from './Rating';

const meta: Meta<typeof Rating> = {
  title: 'Primitives/Rating',
  component: Rating,
  parameters: {
    docs: {
      description: {
        component:
          'Star rating component. 3 sizes (sm/md/lg), readonly or interactive, supports fractional values such as 3.7.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    value: { control: { type: 'number', min: 0, max: 5, step: 0.1 } },
    showValue: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    allowHalf: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Rating>;

export const Default: Story = {
  args: {
    size: 'md',
    value: 3.7,
    showValue: true,
    readOnly: true,
  },
};

export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value ?? 0);
    return (
      <Rating
        {...args}
        value={value}
        onChange={setValue}
        readOnly={false}
        showValue
      />
    );
  },
  args: {
    size: 'md',
    value: 2.5,
    allowHalf: true,
  },
};

export const Fractional: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[3.7, 4.2, 2.3, 0.5].map((v) => (
        <Rating key={v} {...args} value={v} readOnly showValue />
      ))}
    </div>
  ),
  args: { size: 'md' },
};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <Rating key={s} {...args} size={s} value={3.7} readOnly showValue />
      ))}
    </div>
  ),
};

export const AllValues: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
      {[0, 1, 2, 3, 4, 5].map((v) => (
        <Rating key={v} {...args} value={v} readOnly showValue />
      ))}
    </div>
  ),
  args: { size: 'md' },
};
