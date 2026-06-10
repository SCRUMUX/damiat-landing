import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PinInput } from './PinInput';

const SIZES = ['sm', 'md', 'lg'] as const;
const STATES = ['unfilled', 'filled', 'error', 'disabled'] as const;

const meta: Meta<typeof PinInput> = {
  title: 'Primitives/PinInput',
  component: PinInput,
  parameters: {
    docs: {
      description: {
        component:
          'PinInput (@UI/PinInput): 6 квадратных ячеек с точкой внутри. ' +
          '3 размера (sm/md/lg), 4 состояния (unfilled/filled/error/disabled). ' +
          'Поддерживает ввод с клавиатуры, вставку через paste, маскирование. ' +
          'Figma: 160:82793.',
      },
    },
  },
  argTypes: {
    size:   { control: 'select', options: SIZES },
    state:  { control: 'select', options: STATES },
    length: { control: { type: 'number', min: 4, max: 8 } },
    mask:   { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof PinInput>;

/* ── Default (интерактивная) ── */
export const Default: Story = {
  render: (args) => {
    const [val, setVal] = useState('');
    return <PinInput {...args} value={val} onChange={setVal} />;
  },
  args: { size: 'md', state: 'unfilled', mask: true, length: 6 },
};

/* ── Все состояния ── */
export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
      {STATES.map((s) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ width: 64, fontSize: 12, color: 'var(--color-text-muted)' }}>{s}</span>
          <PinInput {...args} state={s} />
        </div>
      ))}
    </div>
  ),
  args: { size: 'sm', mask: true, length: 6 },
};

/* ── Все размеры ── */
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
      {SIZES.map((s) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ width: 24, fontSize: 12, color: 'var(--color-text-muted)' }}>{s}</span>
          <PinInput {...args} size={s} />
        </div>
      ))}
    </div>
  ),
  args: { state: 'unfilled', mask: true, length: 6 },
};

/* ── Полная матрица: sizes × states ── */
export const FullMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 16 }}>
      {SIZES.map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            size={s}
          </div>
          {STATES.map((st) => (
            <div key={st} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ width: 64, fontSize: 12, color: 'var(--color-text-muted)' }}>{st}</span>
              <PinInput size={s} state={st} mask length={6} />
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};

/* ── Без маски (открытый ввод) ── */
export const Unmasked: Story = {
  render: (args) => {
    const [val, setVal] = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
        <PinInput {...args} value={val} onChange={setVal} mask={false} />
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
          Значение: <code>{val || '(пусто)'}</code>
        </div>
      </div>
    );
  },
  args: { size: 'md', state: 'unfilled', length: 6 },
};

/* ── С onComplete ── */
export const WithOnComplete: Story = {
  render: (args) => {
    const [val, setVal] = useState('');
    const [completed, setCompleted] = useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
        <PinInput
          {...args}
          value={val}
          onChange={(v) => { setVal(v); setCompleted(false); }}
          onComplete={() => setCompleted(true)}
          state={completed ? 'filled' : 'unfilled'}
        />
        <div style={{ fontSize: 12, color: completed ? 'var(--color-success-base)' : 'var(--color-text-muted)' }}>
          {completed ? '✓ Код введён полностью' : `Введите ${args.length ?? 6}-значный код`}
        </div>
      </div>
    );
  },
  args: { size: 'md', mask: true, length: 6 },
};

/* ── Error state ── */
export const ErrorState: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>
      <PinInput {...args} state="error" />
      <div style={{ fontSize: 12, color: 'var(--color-danger-base)' }}>
        Неверный код. Попробуйте ещё раз.
      </div>
    </div>
  ),
  args: { size: 'md', mask: true, length: 6 },
};
