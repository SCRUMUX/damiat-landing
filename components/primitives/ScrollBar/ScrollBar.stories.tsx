import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ScrollBar } from './ScrollBar';
import type { ScrollBarOrientation, ScrollBarSize, ScrollBarShape } from './ScrollBar.types';

const meta: Meta<typeof ScrollBar> = {
  title: 'Primitives/ScrollBar',
  component: ScrollBar,
  parameters: {
    docs: {
      description: {
        component:
          '`@UI/ScrollBar` — кастомный скроллбар. ' +
          'orientation: horizontal | vertical. ' +
          'size: sm / md / lg. ' +
          'shape: circle (круглый thumb) | rect (прямоугольный thumb с r=6).',
      },
    },
    layout: 'centered',
  },
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    size:        { control: 'select', options: ['sm', 'md', 'lg'] },
    shape:       { control: 'select', options: ['circle', 'rect'] },
    value:       { control: { type: 'range', min: 0, max: 100 } },
    showArrows:  { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof ScrollBar>;

// ─── Default ─────────────────────────────────────────────────────────────────
export const Default: Story = {
  args: {
    orientation: 'horizontal',
    size: 'sm',
    shape: 'circle',
    value: 33,
    trackLength: 120,
    showArrows: true,
  },
};

// ─── All Sizes Horizontal ─────────────────────────────────────────────────────
export const AllSizesHorizontal: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 16 }}>
      {(['sm', 'md', 'lg'] as ScrollBarSize[]).map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>size={s}</span>
          <ScrollBar size={s} orientation="horizontal" shape="circle" value={40} trackLength={156} />
        </div>
      ))}
    </div>
  ),
};

// ─── Both Shapes ─────────────────────────────────────────────────────────────
export const BothShapes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 16 }}>
      {(['circle', 'rect'] as ScrollBarShape[]).map((sh) => (
        <div key={sh} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>shape={sh}</span>
          <ScrollBar size="sm" orientation="horizontal" shape={sh} value={33} trackLength={156} />
        </div>
      ))}
    </div>
  ),
};

// ─── Vertical ─────────────────────────────────────────────────────────────────
export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'row', gap: 24, alignItems: 'flex-start', padding: 16 }}>
      {(['sm', 'md', 'lg'] as ScrollBarSize[]).map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>size={s}</span>
          <ScrollBar size={s} orientation="vertical" shape="circle" value={25} trackLength={160} />
        </div>
      ))}
    </div>
  ),
};

// ─── Vertical Both Shapes ─────────────────────────────────────────────────────
export const VerticalBothShapes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'row', gap: 32, alignItems: 'flex-start', padding: 16 }}>
      {(['circle', 'rect'] as ScrollBarShape[]).map((sh) => (
        <div key={sh} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>shape={sh}</span>
          <ScrollBar size="sm" orientation="vertical" shape={sh} value={33} trackLength={160} />
        </div>
      ))}
    </div>
  ),
};

// ─── Interactive Horizontal ───────────────────────────────────────────────────
export const InteractiveHorizontal: StoryObj = {
  render: () => {
    const [val, setVal] = useState(33);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
        <ScrollBar
          size="md"
          orientation="horizontal"
          shape="rect"
          value={val}
          trackLength={200}
          onChange={setVal}
        />
        <input
          type="range"
          min={0} max={100}
          value={val}
          onChange={(e) => setVal(Number(e.target.value))}
          style={{ width: 200 }}
        />
        <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>value={val}</span>
      </div>
    );
  },
};

// ─── Interactive Vertical ─────────────────────────────────────────────────────
export const InteractiveVertical: StoryObj = {
  render: () => {
    const [val, setVal] = useState(25);
    return (
      <div style={{ display: 'flex', flexDirection: 'row', gap: 24, padding: 16, alignItems: 'center' }}>
        <ScrollBar
          size="md"
          orientation="vertical"
          shape="circle"
          value={val}
          trackLength={200}
          onChange={setVal}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            type="range"
            min={0} max={100}
            value={val}
            onChange={(e) => setVal(Number(e.target.value))}
          />
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>value={val}</span>
        </div>
      </div>
    );
  },
};

// ─── Without Arrows ───────────────────────────────────────────────────────────
export const WithoutArrows: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
      {(['sm', 'md', 'lg'] as ScrollBarSize[]).map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>size={s}, no arrows</span>
          <ScrollBar size={s} orientation="horizontal" shape="circle" value={50} showArrows={false} trackLength={120} />
        </div>
      ))}
    </div>
  ),
};

// ─── Full Matrix ─────────────────────────────────────────────────────────────
export const FullMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 16 }}>
      {(['horizontal', 'vertical'] as ScrollBarOrientation[]).map((o) => (
        <div key={o}>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 8 }}>orientation={o}</div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            {(['sm', 'md', 'lg'] as ScrollBarSize[]).map((s) =>
              (['circle', 'rect'] as ScrollBarShape[]).map((sh) => (
                <div key={`${s}-${sh}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{s}/{sh}</span>
                  <ScrollBar
                    size={s}
                    orientation={o}
                    shape={sh}
                    value={33}
                    trackLength={o === 'horizontal' ? 120 : 120}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  ),
};
