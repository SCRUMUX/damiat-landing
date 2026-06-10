import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Image } from './Image';

const SIZES = ['xs', 'sm', 'md', 'lg'] as const;
const RATIOS = ['1:1', '4:3', '16:9', '3:2'] as const;
const STATES = ['loading', 'loaded', 'error', 'empty'] as const;
const LAYOUTS = ['image', 'hero-full', 'hero-half'] as const;

const meta: Meta<typeof Image> = {
  title: 'Primitives/Image',
  component: Image,
  parameters: {
    docs: {
      description: {
        component:
          'Image (@UI/Image): изображение с aspect ratio, fallback, skeleton. ' +
          '4 размера (xs=120px/sm=200px/md=320px/lg=480px) × 4 ratio × 4 состояния = 64 варианта. ' +
          'Плюс layout=hero-full (1920×1080) / hero-half (960×1080). ' +
          'Figma: 161:93092.',
      },
    },
  },
  argTypes: {
    layout: { control: 'select', options: LAYOUTS },
    size:   { control: 'select', options: SIZES },
    ratio:  { control: 'select', options: RATIOS },
    state:  { control: 'select', options: STATES },
    src:    { control: 'text' },
    alt:    { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof Image>;

/* ── Default ── */
export const Default: Story = {
  args: {
    layout: 'image',
    size:   'md',
    ratio:  '16:9',
    state:  'loading',
  },
  decorators: [(Story) => <div style={{ padding: 24 }}><Story /></div>],
};

/* ── Все состояния ── */
export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', padding: 24 }}>
      {STATES.map((s) => (
        <div key={s}>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 6 }}>state={s}</div>
          <Image
            {...args}
            state={s}
            src={s === 'loaded' ? 'https://picsum.photos/seed/demo/320/213' : undefined}
          />
        </div>
      ))}
    </div>
  ),
  args: { layout: 'image', size: 'md', ratio: '3:2' },
  decorators: [(Story) => <Story />],
};

/* ── Все размеры ── */
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start', padding: 24 }}>
      {SIZES.map((s) => (
        <div key={s}>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 6 }}>size={s}</div>
          <Image {...args} size={s} />
        </div>
      ))}
    </div>
  ),
  args: { layout: 'image', ratio: '16:9', state: 'loading' },
  decorators: [(Story) => <Story />],
};

/* ── Все соотношения сторон ── */
export const AllRatios: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start', padding: 24 }}>
      {RATIOS.map((r) => (
        <div key={r}>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 6 }}>ratio={r}</div>
          <Image {...args} ratio={r} />
        </div>
      ))}
    </div>
  ),
  args: { layout: 'image', size: 'md', state: 'loading' },
  decorators: [(Story) => <Story />],
};

/* ── Loaded с реальным изображением ── */
export const Loaded: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', padding: 24 }}>
      {RATIOS.map((r) => (
        <div key={r}>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 6 }}>ratio={r}</div>
          <Image
            layout="image"
            size="md"
            ratio={r}
            state="loaded"
            src={`https://picsum.photos/seed/${r}/640/480`}
            alt={`Demo ${r}`}
          />
        </div>
      ))}
    </div>
  ),
  decorators: [(Story) => <Story />],
};

/* ── Shimmer loading animation ── */
export const Loading: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start', padding: 24 }}>
      {SIZES.map((s) => (
        <div key={s}>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 6 }}>size={s}</div>
          <Image layout="image" size={s} ratio="16:9" state="loading" />
        </div>
      ))}
    </div>
  ),
  decorators: [(Story) => <Story />],
};

/* ── Интерактивная загрузка ── */
export const InteractiveLoad: Story = {
  render: () => {
    const [imgState, setImgState] = useState<'loading' | 'loaded' | 'error'>('loading');
    const [src] = useState('https://picsum.photos/320/213');

    return (
      <div style={{ padding: 24 }}>
        <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
          {(['loading', 'loaded', 'error'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setImgState(s)}
              style={{
                padding: '4px 12px',
                fontSize: 12,
                border: '1px solid var(--color-border-base)',
                borderRadius: 4,
                background: imgState === s ? 'var(--color-brand-muted)' : 'transparent',
                cursor: 'pointer',
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <Image
          layout="image"
          size="md"
          ratio="3:2"
          state={imgState}
          src={src}
          alt="Demo image"
        />
      </div>
    );
  },
  decorators: [(Story) => <Story />],
};

/* ── Hero layouts ── */
export const HeroLayouts: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div style={{ padding: '8px 16px', fontSize: 11, color: 'var(--color-text-muted)' }}>hero-full (state=loading)</div>
        <div style={{ width: '100%', height: 240, overflow: 'hidden' }}>
          <Image layout="hero-full" state="loading" style={{ width: '100%', height: '100%', minHeight: 0 }} />
        </div>
      </div>
      <div>
        <div style={{ padding: '8px 16px', fontSize: 11, color: 'var(--color-text-muted)' }}>hero-full (state=loaded)</div>
        <div style={{ width: '100%', height: 240, overflow: 'hidden' }}>
          <Image layout="hero-full" state="loaded" src="https://picsum.photos/1920/1080" alt="Hero" style={{ width: '100%', height: '100%', minHeight: 0 }} />
        </div>
      </div>
      <div>
        <div style={{ padding: '8px 16px', fontSize: 11, color: 'var(--color-text-muted)' }}>hero-half (state=loading)</div>
        <div style={{ width: '50%', height: 240, overflow: 'hidden' }}>
          <Image layout="hero-half" state="loading" style={{ width: '100%', height: '100%', minHeight: 0 }} />
        </div>
      </div>
    </div>
  ),
  decorators: [(Story) => <Story />],
};

/* ── Полная матрица sizes × ratios ── */
export const FullMatrix: Story = {
  render: () => (
    <div style={{ padding: 24, overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '4px 12px 8px 0', fontSize: 11, color: 'var(--color-text-muted)', textAlign: 'left', fontWeight: 400 }}>size\ratio</th>
            {RATIOS.map((r) => (
              <th key={r} style={{ padding: '4px 12px 8px', fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 400 }}>{r}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SIZES.map((s) => (
            <tr key={s}>
              <td style={{ padding: '8px 12px 8px 0', fontSize: 12, color: 'var(--color-text-muted)', verticalAlign: 'middle' }}>{s}</td>
              {RATIOS.map((r) => (
                <td key={r} style={{ padding: '8px 12px', verticalAlign: 'top' }}>
                  <Image layout="image" size={s} ratio={r} state="loading" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
  decorators: [(Story) => <Story />],
};
