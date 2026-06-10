import React, { useMemo, useState } from 'react';
import { SectionShell } from '../../_shared/SectionShell';
import { BlockSectionHeader } from '../../_shared/BlockSectionHeader';
import { Tab, TabList, TabPanel, Tabs } from '../../../components/primitives/Tab';
import { cn } from '../../../components/primitives/_shared';
import { ServicesCategoryPanel } from './ServicesCategoryPanel';
import type { ServicesBlockProps } from './ServicesBlock.types';

export type {
  ServicesBlockProps,
  ServiceCategory,
  ServiceItem,
  ServiceItemAction,
} from './ServicesBlock.types';

export const ServicesBlock: React.FC<ServicesBlockProps> = ({
  title = 'Лучшие практики для реализации бизнес-целей',
  subtitle,
  categories,
  pageSize = 3,
  showMoreLabel = 'Показать ещё',
  stickyHeader = true,
  className,
}) => {
  const defaultTab = categories[0]?.id ?? '';
  const [activeTab, setActiveTab] = useState(defaultTab);

  const resolvedTab = useMemo(
    () => (categories.some((category) => category.id === activeTab) ? activeTab : defaultTab),
    [activeTab, categories, defaultTab],
  );

  if (categories.length === 0) return null;

  return (
    <SectionShell recipe="section.services" className={className} aria-label="Services">
      <Tabs
        value={resolvedTab}
        onValueChange={setActiveTab}
        appearance="brand"
        size="md"
        className="flex w-full min-w-0 flex-col"
        style={{ gap: 'var(--space-section-content-l)' }}
      >
        <div
          className={cn(
            stickyHeader &&
              'sticky z-[calc(var(--z-header)-2)] bg-[var(--color-bg-base)] pb-[var(--space-section-stack-m)]',
          )}
          style={stickyHeader ? { top: 'var(--navbar-chrome-height, 0px)' } : undefined}
        >
          <div
            className="flex w-full min-w-0 flex-col"
            style={{ gap: 'var(--space-section-content-m)' }}
          >
            <BlockSectionHeader title={title} subtitle={subtitle} />
            <TabList
              className="flex w-full min-w-0 items-center overflow-x-auto"
              style={{ gap: 'var(--space-2)' }}
            >
              {categories.map((category) => (
                <Tab
                  key={category.id}
                  value={category.id}
                  showLeftIcon={false}
                  showRightIcon={false}
                  showBadge={false}
                >
                  {category.label}
                </Tab>
              ))}
            </TabList>
          </div>
        </div>

        {categories.map((category) => (
          <TabPanel key={category.id} value={category.id} className="w-full min-w-0 outline-none">
            <ServicesCategoryPanel
              items={category.items}
              pageSize={pageSize}
              showMoreLabel={showMoreLabel}
            />
          </TabPanel>
        ))}
      </Tabs>
    </SectionShell>
  );
};

ServicesBlock.displayName = 'ServicesBlock';
