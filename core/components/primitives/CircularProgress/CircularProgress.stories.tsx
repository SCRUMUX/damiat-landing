import React, { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CircularProgress } from './CircularProgress';
import type { CircularProgressSize } from './CircularProgress.types';

const meta: Meta<typeof CircularProgress> = {
  title: 'Primitives/CircularProgress',
  component: CircularProgress,
  parameters: {
    docs: {
      description: {
        component:
          '`@UI/CircularProgress` — круговой индикатор прогресса. ' +
          '5 размеров: xs(16px), sm(24px), md(32px), lg(40px), xl(48px). ' +
          'Текст процентов внутри отображается от md и выше. ' +
          '`value` — число от 0 до 100.',
      },
    },
  },
  argTypes: {
    size:      { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    value:     { control: { type: 'range', min: 0, max: 100, step: 1 } },
    showLabel: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof CircularProgress>;

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
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as CircularProgressSize[]).map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <CircularProgress size={s} value={65} />
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{s}</span>
        </div>
      ))}
    </div>
  ),
};

// ─── Figma example values (25 / 50 / 75) ────────────────────────────────────
export const FigmaExamples: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
      {[25, 50, 75].map((v) => (
        <div key={v} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <CircularProgress size="md" value={v} />
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{v}%</span>
        </div>
      ))}
    </div>
  ),
};

// ─── Full matrix: all sizes × values ─────────────────────────────────────────
export const FullMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {([0, 25, 50, 75, 100] as number[]).map((v) => (
        <div key={v} style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)', width: 36 }}>{v}%</span>
          {(['xs', 'sm', 'md', 'lg', 'xl'] as CircularProgressSize[]).map((s) => (
            <CircularProgress key={s} size={s} value={v} />
          ))}
        </div>
      ))}
    </div>
  ),
};

// ─── Edge cases: 0% and 100% ─────────────────────────────────────────────────
export const EdgeCases: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      {[0, 100].map((v) => (
        <div key={v} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <CircularProgress size="lg" value={v} />
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{v}%</span>
        </div>
      ))}
    </div>
  ),
};

// ─── Label control ────────────────────────────────────────────────────────────
export const WithLabel: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as CircularProgressSize[]).map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <CircularProgress size={s} value={42} showLabel />
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{s} + label</span>
        </div>
      ))}
    </div>
  ),
};

export const WithoutLabel: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as CircularProgressSize[]).map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <CircularProgress size={s} value={42} showLabel={false} />
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{s} – label</span>
        </div>
      ))}
    </div>
  ),
};

// ─── Interactive: animated progress ──────────────────────────────────────────
export const Animated: Story = {
  render: () => {
    const [value, setValue] = useState(0);
    const [running, setRunning] = useState(false);

    useEffect(() => {
      if (!running) return;
      if (value >= 100) { setRunning(false); return; }
      const t = setTimeout(() => setValue((v) => Math.min(v + 2, 100)), 50);
      return () => clearTimeout(t);
    }, [running, value]);

    const reset = () => { setValue(0); setRunning(false); };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          {(['xs', 'sm', 'md', 'lg', 'xl'] as CircularProgressSize[]).map((s) => (
            <CircularProgress key={s} size={s} value={value} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setRunning((r) => !r)}
            style={{ padding: '4px 12px', fontSize: 12, borderRadius: 4, border: '1px solid var(--color-border-base)', cursor: 'pointer', background: running ? 'var(--color-danger-surface)' : 'var(--color-surface-1)' }}
          >
            {running ? 'Pause' : value >= 100 ? 'Replay' : 'Start'}
          </button>
          <button
            onClick={reset}
            style={{ padding: '4px 12px', fontSize: 12, borderRadius: 4, border: '1px solid var(--color-border-base)', cursor: 'pointer', background: 'var(--color-surface-1)' }}
          >
            Reset
          </button>
        </div>
        <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>value = {value}%</span>
      </div>
    );
  },
};

// ─── Interactive: slider control ──────────────────────────────────────────────
export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState(45);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          {(['xs', 'sm', 'md', 'lg', 'xl'] as CircularProgressSize[]).map((s) => (
            <CircularProgress key={s} size={s} value={value} />
          ))}
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          style={{ width: 280 }}
        />
        <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{value}%</span>
      </div>
    );
  },
};
