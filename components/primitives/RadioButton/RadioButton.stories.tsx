import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RadioButton } from './RadioButton';
import { RadioGroup } from './RadioGroup';

const SIZES = ['xs', 'sm', 'md', 'lg'] as const;
const STATES = ['base', 'filled', 'focus', 'always-filled', 'disabled'] as const;

const meta: Meta<typeof RadioButton> = {
  title: 'Primitives/RadioButton',
  component: RadioButton,
  parameters: {
    docs: {
      description: {
        component:
          'RadioButton (@UI/RadioButton): круглый индикатор выбора. ' +
          '4 размера (xs/sm/md/lg), 5 состояний (base/filled/focus/always-filled/disabled). ' +
          'Ring: ELLIPSE с fill + stroke 1px inside. ' +
          'Figma: 160:82848.',
      },
    },
  },
  argTypes: {
    size:     { control: 'select',  options: SIZES,  description: 'Размер' },
    state:    { control: 'select',  options: STATES, description: 'Визуальное состояние' },
    label:    { control: 'text',    description: 'Текст рядом' },
    disabled: { control: 'boolean', description: 'Disabled' },
    onChange: { action: 'changed',  description: 'onChange' },
  },
  args: {
    size: 'md',
    label: 'Option label',
  },
};
export default meta;
type Story = StoryObj<typeof RadioButton>;

/* ── Default ── */
export const Default: Story = {
  args: { size: 'md', label: 'Option label' },
};

/* ── Все состояния ── */
export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
      {STATES.map((s) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ width: 88, fontSize: 12, color: 'var(--color-text-muted)' }}>{s}</span>
          <RadioButton {...args} state={s} />
        </div>
      ))}
    </div>
  ),
  args: { size: 'md' },
};

/* ── Все размеры ── */
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: 16 }}>
      {SIZES.map((s) => (
        <RadioButton key={s} {...args} size={s} />
      ))}
    </div>
  ),
  args: { state: 'base' },
};

/* ── Полная матрица: sizes × states ── */
export const FullMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
      {/* header */}
      <div style={{ display: 'grid', gridTemplateColumns: '88px repeat(4, 40px)', gap: 12, alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>state \ size</span>
        {SIZES.map(s => <span key={s} style={{ fontSize: 11, color: 'var(--color-text-muted)', textAlign: 'center' }}>{s}</span>)}
      </div>
      {STATES.map((st) => (
        <div key={st} style={{ display: 'grid', gridTemplateColumns: '88px repeat(4, 40px)', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{st}</span>
          {SIZES.map((s) => (
            <div key={s} style={{ display: 'flex', justifyContent: 'center' }}>
              <RadioButton size={s} state={st} />
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};

/* ── С label ── */
export const WithLabel: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
      <RadioButton {...args} state="base"    label="Не выбрано" />
      <RadioButton {...args} state="filled"  label="Выбрано" />
      <RadioButton {...args} state="disabled" label="Недоступно" />
    </div>
  ),
  args: { size: 'md' },
};

/* ── Radio Group (интерактивный) ── */
export const RadioGroupStory: Story = {
  name: 'Radio Group',
  render: (args) => {
    const [selected, setSelected] = useState('option1');
    const options = [
      { value: 'option1', label: 'Опция 1' },
      { value: 'option2', label: 'Опция 2' },
      { value: 'option3', label: 'Опция 3' },
      { value: 'option4', label: 'Недоступная опция', disabled: true },
    ];
    return (
      <fieldset style={{ border: 'none', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <legend style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--color-text-primary)' }}>
          Выберите вариант
        </legend>
        <RadioGroup
          value={selected}
          onValueChange={setSelected}
          name="demo-group"
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
        >
          {options.map((opt) => (
            <RadioButton
              key={opt.value}
              {...args}
              value={opt.value}
              disabled={opt.disabled}
              label={opt.label}
            />
          ))}
        </RadioGroup>
      </fieldset>
    );
  },
  args: { size: 'md' },
};
