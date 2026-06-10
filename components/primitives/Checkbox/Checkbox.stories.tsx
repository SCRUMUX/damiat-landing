import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const SIZES = ['xs', 'sm', 'md', 'lg'] as const;
const STATES = [
  'unchecked', 'checked', 'indeterminate', 'exclude',
  'focus-unchecked', 'focus-checked', 'focus-exclude',
  'disabled-unchecked', 'disabled-checked', 'disabled-indeterminate', 'disabled-exclude',
] as const;

const meta: Meta<typeof Checkbox> = {
  title: 'Primitives/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component:
          '`@UI/Checkbox` — квадратный элемент выбора. 4 размера (xs/sm/md/lg), 11 состояний. cornerRadius=2px.\n\n' +
          '**Режимы**:\n' +
          '- Uncontrolled: не передавайте `checked`, используйте `defaultChecked`.\n' +
          '- Controlled: передайте `checked` + `onChange`.\n\n' +
          '**`indeterminate`** — частично выбранное состояние (плюс, `aria-checked="mixed"`).\n\n' +
          '**`exclude`** — режим "кроме" (минус, зачёркнутый label).\n\n' +
          '**`label`** — текст рядом с чекбоксом.',
      },
    },
  },
  argTypes: {
    size:           { control: 'select',  options: SIZES,   description: 'Размер' },
    state:          { control: 'select',  options: STATES,  description: 'Визуальное состояние (override)' },
    label:          { control: 'text',    description: 'Текст рядом' },
    disabled:       { control: 'boolean', description: 'Disabled' },
    defaultChecked: { control: 'boolean', description: 'Начальное значение (uncontrolled)' },
    indeterminate:  { control: 'boolean', description: 'Indeterminate (плюс)' },
    exclude:        { control: 'boolean', description: 'Exclude mode (минус, зачёркнутый label)' },
    onChange:       { action: 'changed',  description: 'Вызывается при изменении' },
  },
  args: {
    size: 'md',
    label: 'Checkbox label',
  },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

/* ── Default ── */
export const Default: Story = {
  args: { size: 'md', label: 'Checkbox label' },
};

/* ── Все состояния ── */
export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16 }}>
      {STATES.map((s) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ width: 140, fontSize: 12, color: 'var(--color-text-muted)' }}>{s}</span>
          <Checkbox {...args} state={s} />
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
        <Checkbox key={s} {...args} size={s} />
      ))}
    </div>
  ),
  args: { state: 'checked' },
};

/* ── Полная матрица: sizes × states ── */
export const FullMatrix: Story = {
  render: () => (
    <div style={{ overflowX: 'auto', padding: 16 }}>
      <table style={{ borderCollapse: 'separate', borderSpacing: '12px 8px' }}>
        <thead>
          <tr>
            <th style={{ fontSize: 11, color: 'var(--color-text-muted)', textAlign: 'left', paddingRight: 16 }}>state \ size</th>
            {SIZES.map(s => (
              <th key={s} style={{ fontSize: 11, color: 'var(--color-text-muted)', textAlign: 'center', width: 40 }}>{s}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {STATES.map((st) => (
            <tr key={st}>
              <td style={{ fontSize: 12, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{st}</td>
              {SIZES.map((s) => (
                <td key={s} style={{ textAlign: 'center' }}>
                  <Checkbox size={s} state={st} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

/* ── С label ── */
export const WithLabel: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16 }}>
      <Checkbox {...args} state="unchecked"  label="Не выбрано" />
      <Checkbox {...args} state="checked"    label="Выбрано" />
      <Checkbox {...args} state="indeterminate" label="Частично выбрано (+)" />
      <Checkbox {...args} state="exclude"    label="Кроме (−)" />
      <Checkbox {...args} state="disabled-unchecked" label="Недоступно" />
      <Checkbox {...args} state="disabled-exclude" label="Кроме — недоступно" />
    </div>
  ),
  args: { size: 'md' },
};

/* ── Tri-state cycle: unchecked → checked → exclude ── */
export const TriStateCycle: Story = {
  render: (args) => {
    const [phase, setPhase] = useState<'off' | 'on' | 'exclude'>('off');
    const cycle = () => setPhase((p) => p === 'off' ? 'on' : p === 'on' ? 'exclude' : 'off');
    return (
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
          Нажимайте на чекбокс: unchecked → checked → exclude → unchecked
        </p>
        <Checkbox
          {...args}
          checked={phase === 'on'}
          exclude={phase === 'exclude'}
          label={phase === 'off' ? 'Не выбрано' : phase === 'on' ? 'Выбрано' : 'Кроме'}
          onChange={cycle}
        />
        <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
          Текущее состояние: <strong>{phase}</strong>
        </p>
      </div>
    );
  },
  args: { size: 'md' },
};

/* ── Интерактивная группа ── */
export const CheckboxGroup: Story = {
  render: (args) => {
    const [values, setValues] = useState({ apple: true, banana: false, cherry: true });
    const allChecked = Object.values(values).every(Boolean);
    const someChecked = Object.values(values).some(Boolean);

    const toggleAll = () => {
      const next = !allChecked;
      setValues({ apple: next, banana: next, cherry: next });
    };

    return (
      <fieldset style={{ border: 'none', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <legend style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--color-text-primary)' }}>
          Выберите фрукты
        </legend>
        {/* Select All */}
        <Checkbox
          {...args}
          indeterminate={someChecked && !allChecked}
          checked={allChecked}
          state={someChecked && !allChecked ? 'indeterminate' : allChecked ? 'checked' : 'unchecked'}
          label="Выбрать все"
          onChange={toggleAll}
        />
        <div style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(Object.keys(values) as Array<keyof typeof values>).map((key) => (
            <Checkbox
              key={key}
              {...args}
              checked={values[key]}
              state={values[key] ? 'checked' : 'unchecked'}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              onChange={() => setValues(prev => ({ ...prev, [key]: !prev[key] }))}
            />
          ))}
        </div>
      </fieldset>
    );
  },
  args: { size: 'md' },
};
