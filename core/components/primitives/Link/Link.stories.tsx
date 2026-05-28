/**
 * AUTO-GENERATED – do not edit by hand.
 * Regenerate: npm run stories:generate
 */
import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './Link';
import { ChevronRightIcon } from '../../icons';

const meta: Meta<typeof Link> = {
  title: 'Primitives/Link',
  component: Link,
  parameters: {
    docs: { description: { component: "Ссылка: опциональный лейбл, опциональная правая иконка (link-45deg). 3 размера (sm, md, lg). Состояния: base, hover, visited, disabled." } },
  },
  argTypes: {
    size: { control: 'select', options: ["sm","md","lg"] },
    state: { control: 'select', options: ["base","hover","visited","disabled"] },
    showLabel: { control: 'boolean' },
    showRightIcon: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {
  args: { children: 'Link', size: 'sm', iconRight: <ChevronRightIcon style={{ width: '1em', height: '1em' }} />, showRightIcon: true },
};

export const AllSlotsVisible: Story = {
  args: { children: 'Link', size: 'sm', showLabel: true, showRightIcon: true, iconRight: <ChevronRightIcon style={{ width: '1em', height: '1em' }} /> },
};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      {["sm","md","lg"].map((s) => (
        <Link key={s} {...args} size={s as any}>{s}</Link>
      ))}
    </div>
  ),
  args: { size: 'sm', iconRight: <ChevronRightIcon style={{ width: '1em', height: '1em' }} />, showRightIcon: true },
};

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      {["base","hover","visited","disabled"].map((st) => (
        <Link key={st} {...args} state={st as any}>{st}</Link>
      ))}
    </div>
  ),
  args: { size: 'sm', iconRight: <ChevronRightIcon style={{ width: '1em', height: '1em' }} />, showRightIcon: true },
};
