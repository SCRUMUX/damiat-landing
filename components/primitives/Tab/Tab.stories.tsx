/**
 * AUTO-GENERATED – do not edit by hand.
 * Regenerate: npm run stories:generate
 */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tab } from './Tab';
import { Tabs, TabList, TabPanel } from './Tabs';
import { SearchIcon, ChevronRightIcon } from '../../icons';
import { Badge } from '../Badge/Badge';

const iconL = <SearchIcon style={{ width: '100%', height: '100%' }} />;
const iconR = <ChevronRightIcon style={{ width: '100%', height: '100%' }} />;
const badge = <Badge appearance="outline" size="sm">5</Badge>;

const APPEARANCES = ['brand', 'base', 'ghost', 'outline', 'ticket'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;
const STATES = ['base', 'hover', 'active', 'focus', 'disabled'] as const;

const meta: Meta<typeof Tab> = {
  title: 'Primitives/Tab',
  component: Tab,
  parameters: {
    docs: { description: { component: "Tab: appearance (brand/base/ghost/outline/ticket), size (sm/md/lg), state (base/hover/active/focus/disabled). Ticket — «билет» с обводкой сверху/сбоку, без нижней границы." } },
  },
  argTypes: {
    appearance: { control: 'select', options: APPEARANCES },
    size: { control: 'select', options: SIZES },
    state: { control: 'select', options: STATES },
    showLeftIcon: { control: 'boolean' },
    showBadge: { control: 'boolean' },
    showRightIcon: { control: 'boolean' },
    badge: { control: false },
    iconLeft: { control: false },
    iconRight: { control: false },
  },
};
export default meta;
type Story = StoryObj<typeof Tab>;

export const Default: Story = {
  args: {
    children: 'Tab',
    appearance: 'brand',
    size: 'md',
    iconLeft: iconL,
    badge,
    showLeftIcon: true,
    showBadge: true,
    showRightIcon: false,
  },
};

export const AllAppearances: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', padding: 16 }}>
      {APPEARANCES.map((a) => (
        <Tab key={a} {...args} appearance={a}>{a}</Tab>
      ))}
    </div>
  ),
  args: { size: 'md', iconLeft: iconL, showLeftIcon: true, showBadge: false },
};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 16 }}>
      {SIZES.map((s) => (
        <Tab key={s} {...args} size={s}>{s}</Tab>
      ))}
    </div>
  ),
  args: { appearance: 'brand', iconLeft: iconL, showLeftIcon: true, showBadge: false },
};

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 16 }}>
      {STATES.map((st) => (
        <Tab key={st} {...args} state={st}>{st}</Tab>
      ))}
    </div>
  ),
  args: { appearance: 'brand', size: 'md', iconLeft: iconL, showLeftIcon: true, showBadge: false },
};

/** Полная матрица appearance × state */
export const AllAppearancesAllStates: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${STATES.length}, auto)`, gap: 6, padding: 16 }}>
      {APPEARANCES.flatMap((a) =>
        STATES.map((st) => (
          <Tab key={a + st} {...args} appearance={a} state={st}>{a}</Tab>
        ))
      )}
    </div>
  ),
  args: { size: 'sm', showLeftIcon: false, showBadge: false },
};

export const VariantMatrix: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SIZES.length}, auto)`, gap: 8, padding: 16 }}>
      {APPEARANCES.flatMap((a) =>
        SIZES.map((s) => (
          <Tab key={a + s} {...args} appearance={a} size={s}>{a}</Tab>
        ))
      )}
    </div>
  ),
  args: { showLeftIcon: false, showBadge: false },
};

export const WithBadgeAndIcons: Story = {
  args: {
    children: 'Tab label',
    appearance: 'brand',
    size: 'md',
    iconLeft: iconL,
    iconRight: iconR,
    badge,
    showLeftIcon: true,
    showBadge: true,
    showRightIcon: true,
  },
};

export const TabGroup: Story = {
  name: 'Tab Group',
  render: () => {
    const [value, setValue] = React.useState('tab1');
    return (
      <div style={{ padding: 16 }}>
        <Tabs value={value} onValueChange={setValue} appearance="base" size="md">
          <TabList style={{ display: 'flex', gap: 4 }}>
            <Tab value="tab1">Overview</Tab>
            <Tab value="tab2">Analytics</Tab>
            <Tab value="tab3">Settings</Tab>
          </TabList>
          <TabPanel value="tab1" style={{ padding: '16px 0' }}>Overview content</TabPanel>
          <TabPanel value="tab2" style={{ padding: '16px 0' }}>Analytics content</TabPanel>
          <TabPanel value="tab3" style={{ padding: '16px 0' }}>Settings content</TabPanel>
        </Tabs>
      </div>
    );
  },
};

/**
 * In-Tabs appearance matrix — verifies that the selected tab inside `<Tabs/>`
 * follows the per-appearance contract instead of falling back to a hardcoded
 * brand pill. After Phase 10 task 10.7, `data-[state=active]:` classes are
 * driven by Tab.contract.json rules for (appearance, state="active").
 */
export const TabGroupAppearanceMatrix: Story = {
  name: 'Tab Group / All appearances',
  render: () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 16 }}>
        {APPEARANCES.map((a) => (
          <TabGroupRow key={a} appearance={a} />
        ))}
      </div>
    );
  },
};

const TabGroupRow: React.FC<{ appearance: (typeof APPEARANCES)[number] }> = ({ appearance }) => {
  const [value, setValue] = React.useState('overview');
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'var(--color-text-muted)' }}>
        appearance="{appearance}"
      </span>
      <Tabs value={value} onValueChange={setValue} appearance={appearance} size="md">
        <TabList style={{ display: 'flex', gap: 4, alignItems: appearance === 'ticket' ? 'flex-end' : 'center' }}>
          <Tab value="overview">Overview</Tab>
          <Tab value="analytics">Analytics</Tab>
          <Tab value="settings">Settings</Tab>
        </TabList>
      </Tabs>
    </section>
  );
};

/** Ticket tabs in a horizontal row — borders on top/sides, active tab merges with panel below. */
export const TicketTabGroup: Story = {
  name: 'Tab Group / Ticket',
  render: () => {
    const [value, setValue] = React.useState('overview');
    return (
      <div style={{ padding: 16, maxWidth: 560 }}>
        <Tabs value={value} onValueChange={setValue} appearance="ticket" size="md">
          <TabList style={{ display: 'flex', gap: 4, alignItems: 'flex-end' }}>
            <Tab value="overview">Overview</Tab>
            <Tab value="analytics">Analytics</Tab>
            <Tab value="settings">Settings</Tab>
          </TabList>
          <TabPanel
            value="overview"
            style={{
              padding: 16,
              marginTop: -1,
              border: '1px solid var(--color-border-base)',
              borderTop: 'none',
              borderRadius: '0 0 var(--radius-default) var(--radius-default)',
              background: 'var(--color-surface-1)',
            }}
          >
            Overview panel — active ticket tab shares background and hides the panel top edge.
          </TabPanel>
          <TabPanel
            value="analytics"
            style={{
              padding: 16,
              marginTop: -1,
              border: '1px solid var(--color-border-base)',
              borderTop: 'none',
              borderRadius: '0 0 var(--radius-default) var(--radius-default)',
              background: 'var(--color-surface-1)',
            }}
          >
            Analytics panel content.
          </TabPanel>
          <TabPanel
            value="settings"
            style={{
              padding: 16,
              marginTop: -1,
              border: '1px solid var(--color-border-base)',
              borderTop: 'none',
              borderRadius: '0 0 var(--radius-default) var(--radius-default)',
              background: 'var(--color-surface-1)',
            }}
          >
            Settings panel content.
          </TabPanel>
        </Tabs>
      </div>
    );
  },
};
