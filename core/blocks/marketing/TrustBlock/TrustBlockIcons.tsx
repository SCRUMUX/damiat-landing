import React from 'react';
import { BlockArrowUpRightIcon } from '../../_shared/BlockArrowIcons';

const iconClass = 'shrink-0';

export const ArrowUpRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <BlockArrowUpRightIcon className={className ?? iconClass} />
);
