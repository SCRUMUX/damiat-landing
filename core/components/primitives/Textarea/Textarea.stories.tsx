import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const SIZES  = ['sm', 'md', 'lg'] as const;
const STATES = ['base', 'hover', 'focus', 'disabled'] as const;

const meta: Meta<typeof Textarea> = {
  title: 'Primitives/Textarea',
  component: Textarea,
  parameters: {
    docs: {
      description: {
        component:
          'Textarea (@UI/Textarea): многострочное поле ввода. ' +
          '3 размера (sm/md/lg), 4 состояния (base/hover/focus/disabled). ' +
          'cornerRadius=2px. Resizer иконка в правом нижнем углу. ' +
          'Figma: 160:85023.',
      },
    },
  },
  argTypes: {
    size:         { control: 'select', options: SIZES },
    state:        { control: 'select', options: STATES },
    disabled:     { control: 'boolean' },
    readOnly:     { control: 'boolean', description: 'Только чтение' },
    invalid:      { control: 'boolean', description: 'Невалидное значение' },
    resize:       { control: 'select', options: ['none', 'vertical', 'horizontal', 'both'], description: 'Ресайз' },
    showCharCount:{ control: 'boolean', description: 'Счётчик символов' },
    maxLength:    { control: 'number', description: 'Макс. длина' },
    rows:         { control: 'number', description: 'Количество строк' },
    placeholder:  { control: 'text' },
  },
  decorators: [(Story) => (
    <div style={{ padding: 24, maxWidth: 400 }}>
      <Story />
    </div>
  )],
};
export default meta;
type Story = StoryObj<typeof Textarea>;

/* ── Default (интерактивный) ── */
export const Default: Story = {
  render: (args) => {
    const [val, setVal] = useState('');
    return (
      <Textarea
        {...args}
        value={val}
        onChange={(e) => setVal(e.target.value)}
      />
    );
  },
  args: { size: 'md', placeholder: 'Enter text...' },
};

/* ── Все размеры ── */
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {SIZES.map((s) => (
        <div key={s} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ width: 24, fontSize: 12, color: 'var(--color-text-muted)', paddingTop: 8, flexShrink: 0 }}>{s}</span>
          <Textarea {...args} size={s} />
        </div>
      ))}
    </div>
  ),
  args: { placeholder: 'Enter text...' },
};

/* ── Все состояния ── */
export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {STATES.map((st) => (
        <div key={st} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ width: 56, fontSize: 12, color: 'var(--color-text-muted)', paddingTop: 8, flexShrink: 0 }}>{st}</span>
          <Textarea {...args} state={st} />
        </div>
      ))}
    </div>
  ),
  args: { size: 'md', placeholder: 'Enter text...' },
};

/* ── С текстом ── */
export const WithValue: Story = {
  render: (args) => {
    const [val, setVal] = useState('This is some example text that shows how the textarea looks with content inside it.');
    return (
      <Textarea
        {...args}
        value={val}
        onChange={(e) => setVal(e.target.value)}
      />
    );
  },
  args: { size: 'md' },
};

/* ── Disabled ── */
export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Textarea {...args} disabled placeholder="Disabled (empty)" />
      <Textarea {...args} disabled value="Disabled with content" />
    </div>
  ),
  args: { size: 'md' },
};

/* ── Полная матрица: sizes × states ── */
export const FullMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {SIZES.map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            size={s}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {STATES.map((st) => (
              <div key={st} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ width: 56, fontSize: 12, color: 'var(--color-text-muted)', paddingTop: 6, flexShrink: 0 }}>{st}</span>
                <div style={{ width: 280 }}>
                  <Textarea size={s} state={st} placeholder="Enter text..." />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
