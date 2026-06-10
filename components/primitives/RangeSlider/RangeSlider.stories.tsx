import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RangeSlider } from './RangeSlider';

const SIZES = ['sm', 'md', 'lg'] as const;
const STATES = ['base', 'hover', 'disabled'] as const;

const meta: Meta<typeof RangeSlider> = {
  title: 'Primitives/RangeSlider',
  component: RangeSlider,
  parameters: {
    docs: {
      description: {
        component:
          'RangeSlider (@UI/RangeSlider): dual-thumb range slider for min/max selection. ' +
          '3 sizes (sm/md/lg), states base/hover/disabled.',
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
    <div style={{ padding: 24, maxWidth: 400 }}>
      <Story />
    </div>
  )],
};
export default meta;
type Story = StoryObj<typeof RangeSlider>;

export const Default: Story = {
  render: (args) => {
    const [range, setRange] = useState<[number, number]>([25, 75]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <RangeSlider {...args} value={range} onValueChange={setRange} />
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
          Диапазон: {range[0]} — {range[1]}
        </div>
      </div>
    );
  },
  args: { size: 'md', min: 0, max: 100, step: 1 },
};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: 320 }}>
      {SIZES.map((s) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ width: 24, fontSize: 12, color: 'var(--color-text-muted)', flexShrink: 0 }}>{s}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <RangeSlider {...args} size={s} value={[25, 75]} />
          </div>
        </div>
      ))}
    </div>
  ),
  args: { min: 0, max: 100 },
};

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      {STATES.map((st) => (
        <div key={st} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ width: 64, fontSize: 12, color: 'var(--color-text-muted)' }}>{st}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <RangeSlider {...args} state={st as typeof STATES[number]} />
          </div>
        </div>
      ))}
    </div>
  ),
  args: { size: 'md' },
};

export const Disabled: Story = {
  args: { size: 'md', disabled: true, value: [30, 60], min: 0, max: 100 },
};
