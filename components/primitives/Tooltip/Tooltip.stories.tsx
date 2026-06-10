import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip, TooltipBubble } from './Tooltip';
import type { TooltipPosition, TooltipAppearance } from './Tooltip.types';
import { Button } from '../Button/Button';

const meta: Meta<typeof TooltipBubble> = {
  title: 'Primitives/Tooltip',
  component: TooltipBubble,
  parameters: {
    docs: {
      description: {
        component:
          '`@UI/Tooltip` — всплывающая подсказка с пузырьком и стрелкой. ' +
          '4 позиции: top / bottom / left / right. ' +
          '4 вида: base / success / warning / danger. ' +
          '`TooltipBubble` — чистый пузырёк (для Storybook). `Tooltip` — обёртка над trigger с hover/focus.',
      },
    },
    layout: 'centered',
  },
  argTypes: {
    position:   { control: 'select', options: ['top', 'bottom', 'left', 'right'], description: 'Позиция пузырька' },
    appearance: { control: 'select', options: ['base', 'success', 'warning', 'danger'], description: 'Визуальный стиль. base = инвертированный (тёмный на светлом / светлый на тёмном)' },
    content:    { control: 'text',   description: 'Текст подсказки' },
  },
  args: {
    content: 'Tooltip text',
    position: 'top',
    appearance: 'base',
  },
};
export default meta;
type Story = StoryObj<typeof TooltipBubble>;

// ─── Default ─────────────────────────────────────────────────────────────────
export const Default: Story = {
  args: {
    content: 'Tooltip text',
    position: 'top',
    appearance: 'base',
  },
};

// ─── All Appearances ──────────────────────────────────────────────────────────
// base tooltip is intentionally inverted: dark on light, light on dark.
export const AllAppearances: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 16 }}>
      {/* Light background context */}
      <div style={{ background: 'var(--color-bg-base)', borderRadius: 8, padding: 24, display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <span style={{ fontSize: 11, color: 'var(--color-text-muted)', width: '100%' }}>Light background (base = dark tooltip)</span>
        {(['base', 'success', 'warning', 'danger'] as TooltipAppearance[]).map((a) => (
          <div key={a} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <TooltipBubble content="Tooltip text" position="top" appearance={a} />
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{a}</span>
          </div>
        ))}
      </div>
      {/* Dark background context */}
      <div data-theme="dark" style={{ background: 'var(--color-bg-base)', borderRadius: 8, padding: 24, display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <span style={{ fontSize: 11, color: 'var(--color-text-muted)', width: '100%' }}>Dark background (base = light tooltip)</span>
        {(['base', 'success', 'warning', 'danger'] as TooltipAppearance[]).map((a) => (
          <div key={a} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <TooltipBubble content="Tooltip text" position="top" appearance={a} />
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{a}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

// ─── All Positions ────────────────────────────────────────────────────────────
export const AllPositions: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center', padding: 16 }}>
      {(['top', 'bottom', 'left', 'right'] as TooltipPosition[]).map((p) => (
        <div key={p} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <TooltipBubble content="Tooltip text" position={p} appearance="base" />
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{p}</span>
        </div>
      ))}
    </div>
  ),
};

// ─── Full Matrix ─────────────────────────────────────────────────────────────
export const FullMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 16 }}>
      {(['top', 'bottom', 'left', 'right'] as TooltipPosition[]).map((pos) => (
        <div key={pos}>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 8 }}>position={pos}</div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            {(['base', 'success', 'warning', 'danger'] as TooltipAppearance[]).map((a) => (
              <div key={a} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <TooltipBubble content="Tooltip text" position={pos} appearance={a} />
                <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{a}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

// ─── Interactive (hover to show) ─────────────────────────────────────────────
export const Interactive: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', padding: 48, alignItems: 'center', justifyContent: 'center' }}>
      <Tooltip content="Top tooltip" position="top" appearance="base">
        <Button appearance="outline" size="sm">Hover me (top)</Button>
      </Tooltip>
      <Tooltip content="Bottom tooltip" position="bottom" appearance="base">
        <Button appearance="outline" size="sm">Hover me (bottom)</Button>
      </Tooltip>
      <Tooltip content="Left tooltip" position="left" appearance="base">
        <Button appearance="outline" size="sm">Hover me (left)</Button>
      </Tooltip>
      <Tooltip content="Right tooltip" position="right" appearance="base">
        <Button appearance="outline" size="sm">Hover me (right)</Button>
      </Tooltip>
    </div>
  ),
};

// ─── Interactive All Appearances ─────────────────────────────────────────────
export const InteractiveAppearances: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', padding: 48, alignItems: 'center', justifyContent: 'center' }}>
      {(['base', 'success', 'warning', 'danger'] as TooltipAppearance[]).map((a) => (
        <Tooltip key={a} content={`${a} tooltip`} position="top" appearance={a}>
          <Button
            appearance={a === 'base' ? 'outline' : a}
            size="sm"
          >
            {a}
          </Button>
        </Tooltip>
      ))}
    </div>
  ),
};

// ─── With Delay ──────────────────────────────────────────────────────────────
export const WithDelay: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, padding: 48, alignItems: 'center', justifyContent: 'center' }}>
      <Tooltip content="No delay" position="top" appearance="base" delayMs={0}>
        <Button appearance="outline" size="sm">No delay</Button>
      </Tooltip>
      <Tooltip content="300ms delay" position="top" appearance="base" delayMs={300}>
        <Button appearance="outline" size="sm">300ms delay</Button>
      </Tooltip>
      <Tooltip content="600ms delay" position="top" appearance="base" delayMs={600}>
        <Button appearance="outline" size="sm">600ms delay</Button>
      </Tooltip>
    </div>
  ),
};

// ─── Inverted Base (light/dark theme demo) ────────────────────────────────────
export const InvertedBase: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 0, borderRadius: 8, overflow: 'hidden' }}>
      {/* Light side */}
      <div style={{ flex: 1, background: 'var(--color-surface-1)', padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Light theme</span>
        <TooltipBubble content="Tooltip text" position="top" appearance="base" />
        <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>dark bubble</span>
      </div>
      {/* Dark side */}
      <div data-theme="dark" style={{ flex: 1, background: 'var(--color-bg-base)', padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Dark theme</span>
        <TooltipBubble content="Tooltip text" position="top" appearance="base" />
        <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>light bubble</span>
      </div>
    </div>
  ),
};

// ─── Long Content ─────────────────────────────────────────────────────────────
export const LongContent: Story = {
  args: {
    content: 'This is a longer tooltip message that wraps',
    position: 'top',
    appearance: 'base',
  },
};

// ─── Danger ───────────────────────────────────────────────────────────────────
export const Danger: Story = {
  args: {
    content: 'Error: invalid value',
    position: 'top',
    appearance: 'danger',
  },
};

// ─── Success ──────────────────────────────────────────────────────────────────
export const Success: Story = {
  args: {
    content: 'Saved successfully',
    position: 'bottom',
    appearance: 'success',
  },
};

// ─── Warning ──────────────────────────────────────────────────────────────────
export const Warning: Story = {
  args: {
    content: 'Required field',
    position: 'right',
    appearance: 'warning',
  },
};
