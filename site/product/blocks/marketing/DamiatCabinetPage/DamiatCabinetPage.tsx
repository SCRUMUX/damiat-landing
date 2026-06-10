import React, { useMemo, useState } from 'react';
import {
  CABINET_OVERVIEW_SECTION_CLASS,
  CABINET_SCENARIO_SUMMARY_CARD_INTERACTIVE_CLASS,
  CABINET_SCENARIO_SUMMARY_GRID_CLASS,
  CABINET_SCENARIO_SUMMARY_ITEM_TITLE_CLASS,
  CABINET_SCENARIO_SUMMARY_METRIC_CLASS,
  CABINET_SCENARIO_SUMMARY_TITLE_CLASS,
} from '@ai-ds/core/blocks/_shared/blockLayout';
import { AppShellBlock, type AppShellBlockProps } from '@ai-ds/core/blocks/AppShellBlock';
import { CabinetStatsStrip, type CabinetStatItem } from '@ai-ds/core/blocks/CabinetStatsStrip';
import { MonitoringWorkspaceBlock } from '@ai-ds/core/blocks/MonitoringWorkspaceBlock';
import { ShowcasePanelStatusPill } from '@ai-ds/core/blocks/ShowcasePanelBlock/ShowcasePanelAccordion';
import type { ShowcasePanelItem } from '@ai-ds/core/blocks/ShowcasePanelBlock/ShowcasePanelBlock.types';

export interface DamiatCabinetPageProps {
  logo?: AppShellBlockProps['logo'];
  storageLabel: string;
  userLabel: string;
  nav: AppShellBlockProps['nav'];
  telemetry: CabinetStatItem[];
  panels: ShowcasePanelItem[];
  defaultActiveId?: string;
  className?: string;
}

function formatPrimaryMetric(panel: ShowcasePanelItem): string | undefined {
  const metric = panel.metrics?.[0];
  if (!metric) return undefined;
  return [metric.value, metric.unit].filter(Boolean).join(' ');
}

function CabinetScenarioSummaryGrid({
  panels,
  onSelect,
}: {
  panels: ShowcasePanelItem[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className={CABINET_SCENARIO_SUMMARY_GRID_CLASS}>
      {panels.map((panel) => {
        const metric = formatPrimaryMetric(panel);
        return (
          <button
            key={panel.id}
            type="button"
            className={CABINET_SCENARIO_SUMMARY_CARD_INTERACTIVE_CLASS}
            onClick={() => onSelect(panel.id)}
          >
            <span className={CABINET_SCENARIO_SUMMARY_ITEM_TITLE_CLASS}>{panel.title}</span>
            {panel.status ? <ShowcasePanelStatusPill status={panel.status} /> : null}
            {metric ? (
              <span className={CABINET_SCENARIO_SUMMARY_METRIC_CLASS}>{metric}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export const DamiatCabinetPage: React.FC<DamiatCabinetPageProps> = ({
  logo,
  storageLabel,
  userLabel,
  nav,
  telemetry,
  panels,
  defaultActiveId = 'overview',
  className,
}) => {
  const [activeId, setActiveId] = useState(defaultActiveId);

  const activePanel = useMemo(
    () => panels.find((panel) => panel.id === activeId),
    [activeId, panels],
  );

  return (
    <AppShellBlock
      logo={logo}
      storageLabel={storageLabel}
      userLabel={userLabel}
      nav={nav}
      activeId={activeId}
      onNavigate={setActiveId}
      className={className}
    >
      {activeId === 'overview' ? (
        <>
          <CabinetStatsStrip stats={telemetry} />
          <section className={CABINET_OVERVIEW_SECTION_CLASS} aria-label="Scenario summary">
            <h2 className={CABINET_SCENARIO_SUMMARY_TITLE_CLASS}>Сценарии</h2>
            <CabinetScenarioSummaryGrid panels={panels} onSelect={setActiveId} />
          </section>
        </>
      ) : activePanel ? (
        <MonitoringWorkspaceBlock panel={activePanel} />
      ) : null}
    </AppShellBlock>
  );
};

DamiatCabinetPage.displayName = 'DamiatCabinetPage';
