/**
 * DAMIAT user cabinet — monitoring UI from landing (#dashboard + #scenarios).
 */
import type { AppShellNavItem } from '../AppShellBlock';
import type { CabinetStatItem } from '../CabinetStatsStrip';
import type { ShowcasePanelItem } from '../ShowcasePanelBlock/ShowcasePanelBlock.types';
import type { DamiatCabinetPageProps } from './DamiatCabinetPage/DamiatCabinetPage';
import {
  damiatDashboardStatsContent,
  damiatScenarioContent,
} from './damiatLandingFixtures';

export const damiatCabinetNav: AppShellNavItem[] = [
  { id: 'overview', label: 'Обзор' },
  { id: 'c2h4', label: 'Этилен' },
  { id: 'co2', label: 'CO₂' },
  { id: 'climate', label: 'Микроклимат' },
];

export const damiatCabinetPanels: ShowcasePanelItem[] = damiatScenarioContent.panels;

export const damiatCabinetTelemetry: CabinetStatItem[] = damiatDashboardStatsContent.stats;

export const damiatCabinetArgs: DamiatCabinetPageProps = {
  storageLabel: 'Краснодар · Бокс 3',
  userLabel: 'ООО «Агро холдинг»',
  nav: damiatCabinetNav,
  telemetry: damiatCabinetTelemetry,
  panels: damiatCabinetPanels,
  defaultActiveId: 'overview',
};
