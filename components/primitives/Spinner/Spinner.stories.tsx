import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';
import type { SpinnerSize, SpinnerAppearance } from './Spinner.types';

const meta: Meta<typeof Spinner> = {
  title: 'Primitives/Spinner',
  component: Spinner,
  parameters: {
    docs: {
      description: {
        component:
          '`@UI/Spinner` — индикатор загрузки. ' +
          'Кольцо с дугой 270° и анимацией вращения. ' +
          '5 размеров: xs=16 / sm=24 / md=32 / lg=40 / xl=48 px. ' +
          '3 варианта: brand (синий) | base (серый) | inherit (currentColor).',
      },
    },
    layout: 'centered',
  },
  argTypes: {
    size:       { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    appearance: { control: 'select', options: ['brand', 'base', 'inherit'] },
    label:      { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof Spinner>;

// ─── Default ─────────────────────────────────────────────────────────────────
export const Default: Story = {
  args: { size: 'md', appearance: 'brand' },
};

// ─── All Sizes ────────────────────────────────────────────────────────────────
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', padding: 16 }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as SpinnerSize[]).map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <Spinner size={s} appearance="brand" />
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{s}</span>
        </div>
      ))}
    </div>
  ),
};

// ─── All Appearances ──────────────────────────────────────────────────────────
export const AllAppearances: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', padding: 16 }}>
      {(['brand', 'base'] as SpinnerAppearance[]).map((a) => (
        <div key={a} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <Spinner size="md" appearance={a} />
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{a}</span>
        </div>
      ))}
      {/* inherit — shown on colored bg */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{ background: 'var(--color-brand-primary)', borderRadius: 8, padding: 8, display: 'inline-flex' }}>
          <Spinner size="md" appearance="inherit" />
        </div>
        <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>inherit (on brand bg)</span>
      </div>
    </div>
  ),
};

// ─── Full Matrix ─────────────────────────────────────────────────────────────
export const FullMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 16 }}>
      {(['brand', 'base', 'inherit'] as SpinnerAppearance[]).map((a) => (
        <div key={a}>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 8 }}>appearance={a}</div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            {(['xs', 'sm', 'md', 'lg', 'xl'] as SpinnerSize[]).map((s) => (
              <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={a === 'inherit' ? { background: 'var(--color-brand-primary)', borderRadius: 6, padding: 6, display: 'inline-flex' } : {}}>
                  <Spinner size={s} appearance={a} />
                </div>
                <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

// ─── Brand ───────────────────────────────────────────────────────────────────
export const Brand: Story = {
  args: { size: 'lg', appearance: 'brand' },
};

// ─── Base (grey) ──────────────────────────────────────────────────────────────
export const Base: Story = {
  args: { size: 'lg', appearance: 'base' },
};

// ─── Inherit (on coloured background) ────────────────────────────────────────
export const Inherit: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', padding: 16 }}>
      {['var(--color-brand-primary)', 'var(--color-danger-base)', 'var(--color-success-base)', 'var(--color-text-primary)'].map((bg) => (
        <div key={bg} style={{ background: bg, borderRadius: 8, padding: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          <Spinner size="md" appearance="inherit" />
        </div>
      ))}
    </div>
  ),
};

// ─── In Button context ────────────────────────────────────────────────────────
export const InButton: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 16 }}>
      <button
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 16px', borderRadius: 4,
          background: 'var(--color-brand-primary)', border: 'none',
          color: 'white', fontSize: 14, cursor: 'not-allowed', opacity: 0.85,
        }}
        disabled
      >
        <Spinner size="xs" appearance="inherit" />
        Loading…
      </button>
      <button
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 16px', borderRadius: 4,
          background: 'white', border: '1px solid var(--color-border-base)',
          color: 'var(--color-text-primary)', fontSize: 14, cursor: 'not-allowed', opacity: 0.85,
        }}
        disabled
      >
        <Spinner size="xs" appearance="base" />
        Loading…
      </button>
    </div>
  ),
};
