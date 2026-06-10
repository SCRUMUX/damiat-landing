import React from 'react';
import { DamiatC2h4ScenarioPreview } from './DamiatC2h4ScenarioPreview';
import { DamiatCo2ScenarioPreview } from './DamiatCo2ScenarioPreview';
import { DamiatClimateScenarioPreview } from './DamiatClimateScenarioPreview';

const PREVIEW_BY_ID: Record<string, React.ComponentType<{ className?: string }>> = {
  c2h4: DamiatC2h4ScenarioPreview,
  co2: DamiatCo2ScenarioPreview,
  climate: DamiatClimateScenarioPreview,
};

export function getDamiatScenarioPreview(panelId: string): React.ReactNode | undefined {
  const Preview = PREVIEW_BY_ID[panelId];
  return Preview ? React.createElement(Preview) : undefined;
}

export { DamiatC2h4ScenarioPreview } from './DamiatC2h4ScenarioPreview';
export { DamiatCo2ScenarioPreview } from './DamiatCo2ScenarioPreview';
export { DamiatClimateScenarioPreview } from './DamiatClimateScenarioPreview';
export { DamiatScenarioPreviewFrame, SCENARIO_WEEK_DAY_LABELS } from './scenarioShared';
export { ScenarioCorridorChart } from './ScenarioCorridorChart';
export type { ScenarioCorridorChartProps } from './ScenarioCorridorChart';
