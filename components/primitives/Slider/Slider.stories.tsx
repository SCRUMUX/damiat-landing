import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './Slider';

const SIZES = ['sm', 'md', 'lg'] as const;

const meta: Meta<typeof Slider> = {
  title: 'Primitives/Slider',
  component: Slider,
  parameters: {
    docs: {
      description: {
        component:
          'Slider (@UI/Slider): горизонтальный слайдер. Track + Fill + Thumb(s). ' +
          '3 размера (sm/md/lg), 1 или 2 thumb (range). ' +
          'Figma: 160:83289.',
      },
    },
  },
  argTypes: {
    size:     { control: 'select', options: SIZES, description: 'Размер трека и thumb' },
    thumbs:   { control: 'radio',  options: ['1', '2'], description: '1 thumb или range (2 thumb)' },
    min:      { control: { type: 'number' }, description: 'Минимальное значение' },
    max:      { control: { type: 'number' }, description: 'Максимальное значение' },
    step:     { control: { type: 'number' }, description: 'Шаг' },
    disabled: { control: 'boolean', description: 'Disabled' },
    onChange: { action: 'changed', description: 'onChange (одиночный)' },
    onRangeChange: { action: 'range-changed', description: 'onRangeChange (range)' },
  },
  args: {
    size: 'md',
    min: 0,
    max: 100,
    step: 1,
  },
  decorators: [(Story) => (
    <div style={{ padding: 24, maxWidth: 400 }}>
      <Story />
    </div>
  )],
};
export default meta;
type Story = StoryObj<typeof Slider>;

/* ── Default (одиночный, интерактивный) ── */
export const Default: Story = {
  render: (args) => {
    const [val, setVal] = useState(50);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Slider {...args} value={val} onChange={setVal} />
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Значение: {val}</div>
      </div>
    );
  },
  args: { size: 'md', thumbs: '1', min: 0, max: 100, step: 1 },
};

/* ── Все размеры ── */
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: 320 }}>
      {SIZES.map((s) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ width: 24, fontSize: 12, color: 'var(--color-text-muted)', flexShrink: 0 }}>{s}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Slider {...args} size={s} />
          </div>
        </div>
      ))}
    </div>
  ),
  args: { thumbs: '1', value: 60, min: 0, max: 100 },
};

/* ── Range (2 thumbs) ── */
export const Range: Story = {
  render: (args) => {
    const [range, setRange] = useState<[number, number]>([20, 70]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Slider {...args} thumbs="2" rangeValue={range} onRangeChange={setRange} />
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
          Диапазон: {range[0]} — {range[1]}
        </div>
      </div>
    );
  },
  args: { size: 'md', min: 0, max: 100, step: 1 },
};

/* ── Все размеры Range ── */
export const AllSizesRange: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: 320 }}>
      {SIZES.map((s) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ width: 24, fontSize: 12, color: 'var(--color-text-muted)', flexShrink: 0 }}>{s}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Slider {...args} size={s} thumbs="2" rangeValue={[25, 75]} />
          </div>
        </div>
      ))}
    </div>
  ),
  args: { min: 0, max: 100 },
};

/* ── Disabled ── */
export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Single (disabled)</div>
      <Slider {...args} disabled value={40} />
      <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Range (disabled)</div>
      <Slider {...args} thumbs="2" disabled rangeValue={[30, 60]} />
    </div>
  ),
  args: { size: 'md', min: 0, max: 100 },
};

/* ── Полная матрица ── */
export const FullMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 360 }}>
      {SIZES.map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            size={s}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ width: 56, fontSize: 12, color: 'var(--color-text-muted)', flexShrink: 0 }}>1 thumb</span>
            <div style={{ flex: 1, minWidth: 0 }}><Slider size={s} thumbs="1" value={50} /></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ width: 56, fontSize: 12, color: 'var(--color-text-muted)', flexShrink: 0 }}>2 thumbs</span>
            <div style={{ flex: 1, minWidth: 0 }}><Slider size={s} thumbs="2" rangeValue={[25, 75]} /></div>
          </div>
        </div>
      ))}
    </div>
  ),
};
