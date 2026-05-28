import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GridContainer, GridItem } from './GridContainer';
import type { GridContainerMaxWidth } from './GridContainer.types';

const MAX_WIDTHS: GridContainerMaxWidth[] = ['mobile', 'tablet', 'desktop', 'full'];

const meta: Meta<typeof GridContainer> = {
  title: 'Primitives/GridContainer',
  component: GridContainer,
  parameters: {
    docs: {
      description: {
        component:
          '`@UI/GridContainer` + `@UI/GridItem` — адаптивная сетка, автоматически переключающая 4→8→12 колонок на breakpoints mobile/tablet/desktop. ' +
          '`maxWidth` ограничивает ширину контейнера. `GridItem` управляет span/start для каждого breakpoint.',
      },
    },
    layout: 'fullscreen',
  },
  argTypes: {
    maxWidth: { control: 'select', options: MAX_WIDTHS, description: 'Ограничение ширины' },
    centered: { control: 'boolean', description: 'Центрирование по горизонтали' },
  },
};
export default meta;
type Story = StoryObj<typeof GridContainer>;

const Cell: React.FC<{ label: string; span?: number }> = ({ label, span }) => (
  <div style={{
    background: 'var(--color-brand-muted)',
    border: '1px solid var(--color-brand-primary)',
    borderRadius: 4,
    padding: '12px 8px',
    fontSize: 11,
    color: 'var(--color-text-primary)',
    textAlign: 'center',
    minHeight: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    {label}{span ? ` (span ${span})` : ''}
  </div>
);

export const Default: Story = {
  render: () => (
    <GridContainer maxWidth="desktop" style={{ padding: '24px 0' }}>
      {Array.from({ length: 12 }, (_, i) => (
        <Cell key={i} label={`${i + 1}`} />
      ))}
    </GridContainer>
  ),
};

export const AllMaxWidths: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 16 }}>
      {MAX_WIDTHS.map((mw) => (
        <div key={mw}>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8, paddingLeft: 16 }}>
            maxWidth="{mw}"
          </div>
          <GridContainer maxWidth={mw} style={{ background: 'var(--color-surface-2)', padding: '16px 0' }}>
            {Array.from({ length: 4 }, (_, i) => (
              <Cell key={i} label={`${i + 1}`} />
            ))}
          </GridContainer>
        </div>
      ))}
    </div>
  ),
};

export const ResponsiveLayout: Story = {
  render: () => (
    <GridContainer maxWidth="desktop" style={{ padding: '24px 0' }}>
      <GridItem span={{ mobile: 4, tablet: 8, desktop: 12 }}>
        <Cell label="Full width (4/8/12)" />
      </GridItem>
      <GridItem span={{ mobile: 4, tablet: 4, desktop: 6 }}>
        <Cell label="Half (4/4/6)" />
      </GridItem>
      <GridItem span={{ mobile: 4, tablet: 4, desktop: 6 }}>
        <Cell label="Half (4/4/6)" />
      </GridItem>
      <GridItem span={{ mobile: 2, tablet: 2, desktop: 3 }}>
        <Cell label="Quarter" />
      </GridItem>
      <GridItem span={{ mobile: 2, tablet: 2, desktop: 3 }}>
        <Cell label="Quarter" />
      </GridItem>
      <GridItem span={{ mobile: 2, tablet: 2, desktop: 3 }}>
        <Cell label="Quarter" />
      </GridItem>
      <GridItem span={{ mobile: 2, tablet: 2, desktop: 3 }}>
        <Cell label="Quarter" />
      </GridItem>
    </GridContainer>
  ),
};

export const WithStartPositions: Story = {
  render: () => (
    <GridContainer maxWidth="desktop" style={{ padding: '24px 0' }}>
      <GridItem span={{ mobile: 2, tablet: 3, desktop: 4 }} start={{ mobile: 1, tablet: 1, desktop: 1 }}>
        <Cell label="Col 1-4" />
      </GridItem>
      <GridItem span={{ mobile: 2, tablet: 3, desktop: 4 }} start={{ mobile: 3, tablet: 4, desktop: 5 }}>
        <Cell label="Col 5-8" />
      </GridItem>
      <GridItem span={{ mobile: 4, tablet: 2, desktop: 4 }} start={{ mobile: 1, tablet: 7, desktop: 9 }}>
        <Cell label="Col 9-12" />
      </GridItem>
    </GridContainer>
  ),
};

export const DashboardLayout: Story = {
  render: () => (
    <GridContainer maxWidth="desktop" style={{ padding: '24px 0' }}>
      <GridItem span={{ mobile: 4, tablet: 8, desktop: 12 }}>
        <div style={{ background: 'var(--color-surface-2)', borderRadius: 8, padding: 16, minHeight: 60, display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>Header / Navigation</span>
        </div>
      </GridItem>
      <GridItem span={{ mobile: 4, tablet: 8, desktop: 3 }}>
        <div style={{ background: 'var(--color-surface-2)', borderRadius: 8, padding: 16, minHeight: 200 }}>
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Sidebar</span>
        </div>
      </GridItem>
      <GridItem span={{ mobile: 4, tablet: 8, desktop: 9 }}>
        <div style={{ background: 'var(--color-surface-2)', borderRadius: 8, padding: 16, minHeight: 200 }}>
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Main Content Area</span>
        </div>
      </GridItem>
    </GridContainer>
  ),
};
