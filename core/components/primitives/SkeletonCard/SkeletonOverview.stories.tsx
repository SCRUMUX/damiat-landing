import React, { useState, useEffect, useCallback } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SkeletonCard } from '../SkeletonCard/SkeletonCard';
import { SkeletonTable } from '../SkeletonTable/SkeletonTable';
import { SkeletonList } from '../SkeletonList/SkeletonList';
import { SkeletonChart } from '../SkeletonChart/SkeletonChart';
import { SkeletonPage } from '../SkeletonPage/SkeletonPage';
import { Card } from '../Card/Card';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';

const meta: Meta = {
  title: 'Primitives/Skeleton/Overview',
  parameters: {
    docs: {
      description: {
        component:
          'Обзор всех скелетонов дизайн-системы. Каждый скелетон соответствует реальному компоненту ' +
          'и используется как плейсхолдер во время загрузки данных. ' +
          'Нажмите «Reload» для демонстрации перехода skeleton → content.',
      },
    },
    layout: 'padded',
  },
};
export default meta;
type Story = StoryObj;

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: '1px solid var(--color-border-base)',
  }}>
    {children}
  </div>
);

function useLoadingCycle(delay = 2000) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(t);
  }, [delay]);
  const reload = useCallback(() => setLoading(true), []);
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(t);
  }, [loading, delay]);
  return { loading, reload };
}

export const AllSkeletons: Story = {
  render: () => {
    const card = useLoadingCycle(2000);
    const table = useLoadingCycle(2500);
    const list = useLoadingCycle(1800);
    const chart = useLoadingCycle(3000);
    const page = useLoadingCycle(3500);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40, maxWidth: 900 }}>

        {/* ── SkeletonCard → Card ── */}
        <div>
          <SectionLabel>SkeletonCard → Card</SectionLabel>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {card.loading ? (
              <SkeletonCard size="md" shimmer />
            ) : (
              <Card
                variant="base"
                size="md"
                title="Dashboard KPIs"
                description="Revenue, users, and conversion metrics for Q4 2025."
                style={{ width: 480 }}
                header={
                  <div style={{
                    height: 110,
                    background: 'linear-gradient(135deg, var(--color-brand-muted), var(--color-info-surface))',
                    borderRadius: '4px 4px 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-text-muted)',
                    fontSize: 12,
                  }}>
                    Chart / Image
                  </div>
                }
                footer={
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Badge appearance="success" size="sm">+12%</Badge>
                    <Badge appearance="info" size="sm">Updated</Badge>
                  </div>
                }
              />
            )}
            <Button size="sm" appearance="ghost" onClick={card.reload}>Reload</Button>
          </div>
        </div>

        {/* ── SkeletonTable → Table ── */}
        <div>
          <SectionLabel>SkeletonTable → Table</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {table.loading ? (
              <SkeletonTable size="md" shimmer rows={4} cols={4} />
            ) : (
              <table style={{
                width: 460,
                borderCollapse: 'collapse',
                border: '1px solid var(--color-border-base)',
                borderRadius: 4,
                overflow: 'hidden',
                fontSize: 12,
              }}>
                <thead>
                  <tr style={{ background: 'var(--color-surface-2)' }}>
                    {['Name', 'Role', 'Status', 'Score'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--color-text-muted)', fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Alice', role: 'Designer', status: 'Active', score: 98 },
                    { name: 'Bob', role: 'Engineer', status: 'Pending', score: 73 },
                    { name: 'Carol', role: 'Manager', status: 'Active', score: 85 },
                    { name: 'Dave', role: 'Designer', status: 'Inactive', score: 60 },
                  ].map(r => (
                    <tr key={r.name} style={{ borderTop: '1px solid var(--color-border-base)' }}>
                      <td style={{ padding: '8px 12px', color: 'var(--color-text-primary)' }}>{r.name}</td>
                      <td style={{ padding: '8px 12px', color: 'var(--color-text-muted)' }}>{r.role}</td>
                      <td style={{ padding: '8px 12px' }}>
                        <Badge size="sm" appearance={r.status === 'Active' ? 'success' : r.status === 'Pending' ? 'warning' : 'danger'}>{r.status}</Badge>
                      </td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--color-text-primary)' }}>{r.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <Button size="sm" appearance="ghost" onClick={table.reload} style={{ alignSelf: 'flex-start' }}>Reload</Button>
          </div>
        </div>

        {/* ── SkeletonList → ListItem ── */}
        <div>
          <SectionLabel>SkeletonList → List</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {list.loading ? (
              <SkeletonList size="sm" shimmer rows={4} />
            ) : (
              <div style={{ width: 320, background: 'var(--color-surface-1)', borderRadius: 4, padding: '8px 16px' }}>
                {['Alice Johnson', 'Bob Smith', 'Carol White', 'Dave Brown'].map((name, i, arr) => (
                  <div key={name}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      height: 36,
                      fontSize: 12,
                      color: 'var(--color-text-primary)',
                    }}>
                      <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--color-brand-muted)', flexShrink: 0 }} />
                      <span style={{ flex: 1 }}>{name}</span>
                      <span style={{ color: 'var(--color-text-muted)', fontSize: 10 }}>Online</span>
                    </div>
                    {i < arr.length - 1 && <div style={{ height: 1, background: 'var(--color-border-base)' }} />}
                  </div>
                ))}
              </div>
            )}
            <Button size="sm" appearance="ghost" onClick={list.reload} style={{ alignSelf: 'flex-start' }}>Reload</Button>
          </div>
        </div>

        {/* ── SkeletonChart → Chart placeholder ── */}
        <div>
          <SectionLabel>SkeletonChart → Chart</SectionLabel>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {(['bar', 'line', 'donut'] as const).map(type => (
              <div key={type}>
                <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 4 }}>{type}</div>
                {chart.loading ? (
                  <SkeletonChart size="sm" shimmer chartType={type} />
                ) : (
                  <div style={{
                    width: 320,
                    height: 146,
                    background: 'var(--color-surface-2)',
                    borderRadius: 4,
                    padding: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)' }}>Revenue ({type})</span>
                    <span style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-brand-primary)' }}>$12,450</span>
                    <div style={{ flex: 1, background: 'var(--color-surface-3)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: 11 }}>
                      {type} chart area
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <Button size="sm" appearance="ghost" onClick={chart.reload} style={{ marginTop: 8 }}>Reload</Button>
        </div>

        {/* ── SkeletonPage → Page ── */}
        <div>
          <SectionLabel>SkeletonPage → Full Page</SectionLabel>
          {page.loading ? (
            <SkeletonPage size="md" shimmer />
          ) : (
            <div style={{
              width: 480,
              background: 'var(--color-surface-1)',
              borderRadius: 4,
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              <div style={{ display: 'flex', gap: 8, fontSize: 11, color: 'var(--color-text-muted)' }}>
                Home / Dashboard / Analytics
              </div>
              <div style={{ height: 120, background: 'linear-gradient(135deg, var(--color-brand-muted), var(--color-success-surface))', borderRadius: 4 }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>Analytics Dashboard</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Key metrics and performance indicators for your application.</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <Badge appearance="brand" size="sm">Analytics</Badge>
                <Badge appearance="info" size="sm">Q4</Badge>
                <Badge appearance="success" size="sm">Live</Badge>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {['Users', 'Revenue', 'Growth'].map(label => (
                  <div key={label} style={{
                    background: 'var(--color-surface-2)',
                    borderRadius: 4,
                    padding: 8,
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{label}</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {label === 'Users' ? '1.2k' : label === 'Revenue' ? '$8.4k' : '+15%'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <Button size="sm" appearance="ghost" onClick={page.reload} style={{ marginTop: 8 }}>Reload</Button>
        </div>
      </div>
    );
  },
};
