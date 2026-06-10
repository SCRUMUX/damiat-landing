import React from 'react';
import { cn } from '../../../components/primitives/_shared';
import {
  MONITORING_WORKSPACE_SHELL_CLASS,
  MONITORING_WORKSPACE_TITLE_CLASS,
} from '../../_shared/blockLayout';
import { ShowcasePanelMonitoringView } from '../ShowcasePanelBlock/ShowcasePanelAccordion';
import type { ShowcasePanelItem } from '../ShowcasePanelBlock/ShowcasePanelBlock.types';

export interface MonitoringWorkspaceBlockProps {
  panel: ShowcasePanelItem;
  title?: string;
  className?: string;
}

export const MonitoringWorkspaceBlock: React.FC<MonitoringWorkspaceBlockProps> = ({
  panel,
  title,
  className,
}) => (
  <section
    className={cn(MONITORING_WORKSPACE_SHELL_CLASS, className)}
    aria-label={title ?? panel.title}
  >
    <h2 className={MONITORING_WORKSPACE_TITLE_CLASS}>{title ?? panel.title}</h2>
    <ShowcasePanelMonitoringView panel={panel} expanded layout="workspace" />
  </section>
);

MonitoringWorkspaceBlock.displayName = 'MonitoringWorkspaceBlock';
