import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './Switch';
import type { SwitchSize, SwitchState } from './Switch.types';

const meta: Meta<typeof Switch> = {
  title: 'Primitives/Switch',
  component: Switch,
  parameters: {
    docs: {
      description: {
        component:
          '`@UI/Switch` — переключатель вкл/выкл. Pill track + thumb с анимацией slide.\n\n' +
          '**Размеры**: xs / sm / md / lg\n\n' +
          '**Режимы**:\n' +
          '- Uncontrolled: не передавайте `state`, используйте `defaultChecked`. Switch управляет своим состоянием сам.\n' +
          '- Controlled: передайте `state` (`on`|`off`|`disabled-on`|`disabled-off`).\n\n' +
          '**`onToggle(checked: boolean)`** — вызывается при каждом переключении.',
      },
    },
  },
  argTypes: {
    size:           { control: 'select',  options: ['xs', 'sm', 'md', 'lg'], description: 'Размер компонента' },
    state:          { control: 'select',  options: ['on', 'off', 'disabled-on', 'disabled-off'], description: 'Контролируемое состояние' },
    defaultChecked: { control: 'boolean', description: 'Начальное значение (uncontrolled)' },
    disabled:       { control: 'boolean', description: 'Disabled' },
    onToggle:       { action: 'toggled',  description: 'Вызывается при переключении' },
    onClick:        { action: 'clicked' },
  },
  args: {
    size: 'md',
    defaultChecked: false,
  },
};
export default meta;
type Story = StoryObj<typeof Switch>;

// ─── Default (uncontrolled) ───────────────────────────────────────────────────
export const Default: Story = {
  args: { size: 'md' },
};

// ─── All Sizes ────────────────────────────────────────────────────────────────
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
      {(['xs', 'sm', 'md', 'lg'] as SwitchSize[]).map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <Switch size={s} defaultChecked />
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{s}</span>
        </div>
      ))}
    </div>
  ),
};

// ─── All States ───────────────────────────────────────────────────────────────
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
      {(['on', 'off', 'disabled-on', 'disabled-off'] as SwitchState[]).map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <Switch size="md" state={s} />
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{s}</span>
        </div>
      ))}
    </div>
  ),
};

// ─── Interactive (uncontrolled) ───────────────────────────────────────────────
export const Interactive: StoryObj = {
  render: () => {
    const [log, setLog] = useState<string[]>([]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
        <Switch
          size="md"
          defaultChecked={false}
          onToggle={(v) => setLog(prev => [`toggled → ${v}`, ...prev.slice(0, 4)])}
        />
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {log.map((l, i) => <span key={i}>{l}</span>)}
        </div>
      </div>
    );
  },
};

// ─── Full Matrix ─────────────────────────────────────────────────────────────
export const FullMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 8 }}>
      {(['xs', 'sm', 'md', 'lg'] as SwitchSize[]).map((s) => (
        <div key={s} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)', width: 24 }}>{s}</span>
          {(['on', 'off', 'disabled-on', 'disabled-off'] as SwitchState[]).map((st) => (
            <div key={st} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <Switch size={s} state={st} />
              <span style={{ fontSize: 9, color: 'var(--color-text-muted)' }}>{st}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};
