import type React from 'react';

export interface ShowcasePanelAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export type ShowcasePanelAlert = {
  level: 'info' | 'warning' | 'success';
  title: string;
  detail?: string;
  timeframe?: string;
  actor?: 'auto' | 'operator';
};

export type ShowcasePanelMetricTrend = 'up' | 'down' | 'stable';

export type ShowcasePanelMetric = {
  label: string;
  value: string;
  unit?: string;
  min: string;
  max: string;
  trend?: ShowcasePanelMetricTrend;
};

export type ShowcasePanelHarvestStatus = {
  label: string;
  level: 'ok' | 'watch' | 'alert';
};

export type ShowcasePanelOperationMode = {
  id: string;
  label: string;
  active?: boolean;
  description?: string;
};

export type ShowcasePanelResource = {
  label: string;
  level: string;
  unit?: string;
  consumption?: string;
  remainingDays?: string;
  trend?: ShowcasePanelMetricTrend;
};

export interface ShowcasePanelItem {
  id: string;
  title: string;
  bullets: string[];
  /** Режимы работы (например, хранение / дозаривание). */
  modes?: ShowcasePanelOperationMode[];
  /** Подпись над переключателем режимов. По умолчанию — «Режим генератора». */
  modesLabel?: string;
  /** Статус урожая (слева в аккордеоне). */
  status?: ShowcasePanelHarvestStatus;
  /** Показатели с коридором min–max и трендом. */
  metrics?: ShowcasePanelMetric[];
  /** Ресурсы: бак, расход, остаток дней. */
  resources?: ShowcasePanelResource[];
  /** Рекомендации на основе динамики показателей. */
  alerts?: ShowcasePanelAlert[];
  action?: ShowcasePanelAction;
  imageSrc?: string;
  imageAlt?: string;
  /** Preview slot for Storybook render() — not CSF args. */
  preview?: React.ReactNode;
}

export interface ShowcasePanelBlockProps {
  title?: string;
  /** Optional line break in title on mobile (Cortel inserts `<br>` before last phrase). */
  titleBreakBefore?: string;
  panels: ShowcasePanelItem[];
  /** Cortel parallax cubes — disable when section sits on `BrandPhotoHeroSection`. */
  parallax?: 'section' | false;
  className?: string;
}
