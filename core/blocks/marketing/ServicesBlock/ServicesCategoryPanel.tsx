import React, { useEffect, useState } from 'react';
import { BlockGrid } from '../../_shared/BlockGrid';
import { Button } from '../../../components/primitives/Button';
import { ServiceCard } from './ServiceCard';
import type { ServiceItem } from './ServicesBlock.types';

export interface ServicesCategoryPanelProps {
  items: ServiceItem[];
  pageSize: number;
  showMoreLabel: string;
}

export const ServicesCategoryPanel: React.FC<ServicesCategoryPanelProps> = ({
  items,
  pageSize,
  showMoreLabel,
}) => {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [items, pageSize]);

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  return (
    <div
      className="flex w-full min-w-0 flex-col"
      style={{ gap: 'var(--space-section-content-l)' }}
    >
      <BlockGrid columns={3}>
        {visibleItems.map((item) => (
          <ServiceCard
            key={item.id}
            title={item.title}
            description={item.description}
            image={item.image}
            imageSrc={item.imageSrc}
            imageAlt={item.imageAlt}
            action={item.action}
          />
        ))}
      </BlockGrid>

      {hasMore ? (
        <div className="flex w-full justify-center">
          <Button
            type="button"
            appearance="outline"
            size="lg"
            onClick={() => setVisibleCount((count) => count + pageSize)}
          >
            {showMoreLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

ServicesCategoryPanel.displayName = 'ServicesCategoryPanel';
