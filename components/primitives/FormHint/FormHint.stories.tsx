/**
 * AUTO-GENERATED – do not edit by hand.
 * Regenerate: npm run stories:generate
 */
import type { Meta, StoryObj } from '@storybook/react';
import { FormHint } from './FormHint';
import { SearchIcon } from '../../icons';

const meta: Meta<typeof FormHint> = {
  title: 'Primitives/FormHint',
  component: FormHint,
  parameters: {
    docs: { description: { component: "Helper text под полем ввода. 3 размера (sm/md/lg), 4 вида (base, success, warning, danger). Опционально иконка слева." } },
  },
  argTypes: {
    size: { control: 'select', options: ["sm","md","lg"] },
    appearance: { control: 'select', options: ["base","success","warning","danger"] },
    showIcon: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof FormHint>;

export const Default: Story = {
  args: { children: 'FormHint', size: 'sm', appearance: 'base', icon: <SearchIcon style={{ width: '1em', height: '1em' }} />, showIcon: true },
};

export const AllSlotsVisible: Story = {
  args: { children: 'FormHint', size: 'sm', appearance: 'base', showIcon: true, icon: <SearchIcon style={{ width: '1em', height: '1em' }} /> },
};

export const AllAppearances: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 12, alignItems: 'center' }}>
      {["base","success","warning","danger"].map((a) => (
        <FormHint key={a} {...args} appearance={a as any}>{a}</FormHint>
      ))}
    </div>
  ),
  args: { size: 'sm', appearance: 'base', icon: <SearchIcon style={{ width: '1em', height: '1em' }} />, showIcon: true },
};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      {["sm","md","lg"].map((s) => (
        <FormHint key={s} {...args} size={s as any}>{s}</FormHint>
      ))}
    </div>
  ),
  args: { size: 'sm', appearance: 'base', icon: <SearchIcon style={{ width: '1em', height: '1em' }} />, showIcon: true },
};

export const VariantMatrix: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: 8, alignItems: 'center' }}>
      {["base","success","warning","danger"].flatMap((a) =>
        ["sm","md","lg"].map((s) => (
          <FormHint key={a + s} {...args} appearance={a as any} size={s as any}>{a + ' ' + s}</FormHint>
        ))
      )}
    </div>
  ),
  args: { size: 'sm', appearance: 'base', icon: <SearchIcon style={{ width: '1em', height: '1em' }} />, showIcon: true },
};
