import React from 'react';
import { cn } from '../../../components/primitives/_shared';
import {
  CABINET_STAT_CARD_CLASS,
  CABINET_STAT_LABEL_CLASS,
  CABINET_STATS_STRIP_CLASS,
  CABINET_STAT_VALUE_CLASS,
} from '../../_shared/blockLayout';

export interface CabinetStatItem {
  value: string;
  label: string;
}

export interface CabinetStatsStripProps {
  stats: CabinetStatItem[];
  className?: string;
}

export const CabinetStatsStrip: React.FC<CabinetStatsStripProps> = ({ stats, className }) => (
  <div className={cn(CABINET_STATS_STRIP_CLASS, className)} aria-label="Telemetry overview">
    {stats.map((stat) => (
      <article key={stat.label} className={CABINET_STAT_CARD_CLASS}>
        <p className={CABINET_STAT_VALUE_CLASS}>{stat.value}</p>
        <p className={CABINET_STAT_LABEL_CLASS}>{stat.label}</p>
      </article>
    ))}
  </div>
);

CabinetStatsStrip.displayName = 'CabinetStatsStrip';
