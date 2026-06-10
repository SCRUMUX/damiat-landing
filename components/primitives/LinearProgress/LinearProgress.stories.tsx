import React, { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LinearProgress } from './LinearProgress';
import type { LinearProgressSize } from './LinearProgress.types';

const meta: Meta<typeof LinearProgress> = {
  title: 'Primitives/LinearProgress',
  component: LinearProgress,
  parameters: {
    docs: {
      description: {
        component:
          '`@UI/LinearProgress` — линейный прогресс-бар с pill-скруглением. ' +
          '3 размера: sm (4px), md (6px), lg (8px). ' +
          '`value` — число от 0 до 100.',
      },
    },
  },
  argTypes: {
    size:  { control: 'select', options: ['sm', 'md', 'lg'] },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    label: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 240, padding: 8 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof LinearProgress>;

// ─── Default ─────────────────────────────────────────────────────────────────
export const Default: Story = {
  args: {
    size: 'md',
    value: 65,
  },
};

// ─── All Sizes ────────────────────────────────────────────────────────────────
export const AllSizes: Story = {
  render: () => (
    <div style={{ width: 240, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(['sm', 'md', 'lg'] as LinearProgressSize[]).map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>size={s}</span>
          <LinearProgress size={s} value={65} />
        </div>
      ))}
    </div>
  ),
};

// ─── Figma example values (25 / 50 / 75) ─────────────────────────────────────
export const FigmaExamples: Story = {
  render: () => (
    <div style={{ width: 240, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[25, 50, 75].map((v) => (
        <div key={v} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{v}%</span>
          <LinearProgress size="md" value={v} />
        </div>
      ))}
    </div>
  ),
};

// ─── Full Matrix: all sizes × values ──────────────────────────────────────────
export const FullMatrix: Story = {
  render: () => (
    <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {([0, 25, 50, 75, 100] as number[]).map((v) => (
        <div key={v} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{v}%</span>
          {(['sm', 'md', 'lg'] as LinearProgressSize[]).map((s) => (
            <LinearProgress key={s} size={s} value={v} />
          ))}
        </div>
      ))}
    </div>
  ),
};

// ─── Edge cases: 0% and 100% ─────────────────────────────────────────────────
export const EdgeCases: Story = {
  render: () => (
    <div style={{ width: 240, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[0, 100].map((v) => (
        <div key={v} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{v}%</span>
          <LinearProgress size="md" value={v} />
        </div>
      ))}
    </div>
  ),
};

// ─── Animated progress ────────────────────────────────────────────────────────
export const Animated: Story = {
  render: () => {
    const [value, setValue] = useState(0);
    const [running, setRunning] = useState(false);

    useEffect(() => {
      if (!running) return;
      if (value >= 100) { setRunning(false); return; }
      const t = setTimeout(() => setValue((v) => Math.min(v + 1, 100)), 40);
      return () => clearTimeout(t);
    }, [running, value]);

    return (
      <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(['sm', 'md', 'lg'] as LinearProgressSize[]).map((s) => (
            <LinearProgress key={s} size={s} value={value} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={() => setRunning((r) => !r)}
            style={{ padding: '4px 12px', fontSize: 12, borderRadius: 4, border: '1px solid var(--color-border-base)', cursor: 'pointer', background: running ? 'var(--color-danger-surface)' : 'var(--color-surface-1)' }}
          >
            {running ? 'Pause' : value >= 100 ? 'Replay' : 'Start'}
          </button>
          <button
            onClick={() => { setValue(0); setRunning(false); }}
            style={{ padding: '4px 12px', fontSize: 12, borderRadius: 4, border: '1px solid var(--color-border-base)', cursor: 'pointer', background: 'var(--color-surface-1)' }}
          >
            Reset
          </button>
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{value}%</span>
        </div>
      </div>
    );
  },
};

// ─── Interactive: slider control ──────────────────────────────────────────────
export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState(45);
    return (
      <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(['sm', 'md', 'lg'] as LinearProgressSize[]).map((s) => (
          <div key={s} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{s}</span>
            <LinearProgress size={s} value={value} />
          </div>
        ))}
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          style={{ width: '100%', marginTop: 4 }}
        />
        <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{value}%</span>
      </div>
    );
  },
};
