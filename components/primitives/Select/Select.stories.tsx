import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const SIZES = ['sm', 'md', 'lg'] as const;
const STATES = ['base', 'hover', 'focus', 'disabled'] as const;

const OPTIONS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte', disabled: true },
];

const meta: Meta<typeof Select> = {
  title: 'Primitives/Select',
  component: Select,
  parameters: {
    docs: {
      description: {
        component:
          'Select (@UI/Select): native-style dropdown. ' +
          '3 sizes (sm/md/lg), states base/hover/focus/disabled. Chevron on the right.',
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: SIZES },
    state: { control: 'select', options: STATES },
    disabled: { control: 'boolean' },
    onValueChange: { action: 'changed' },
  },
  decorators: [(Story) => (
    <div style={{ padding: 24, maxWidth: 280 }}>
      <Story />
    </div>
  )],
};
export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('react');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Select {...args} value={value} onValueChange={setValue} options={OPTIONS} />
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Выбрано: {value}</div>
      </div>
    );
  },
  args: { size: 'md', placeholder: 'Select framework...' },
};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {SIZES.map((s) => (
        <Select key={s} {...args} size={s} defaultValue="react" options={OPTIONS} />
      ))}
    </div>
  ),
};

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {STATES.map((st) => (
        <Select key={st} {...args} state={st as typeof STATES[number]} />
      ))}
    </div>
  ),
  args: { size: 'md' },
};

export const Disabled: Story = {
  args: { size: 'md', disabled: true, value: 'react', options: OPTIONS },
};
