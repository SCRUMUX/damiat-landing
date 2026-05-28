import React from 'react';
import { BlockArrowUpRightIcon } from '../../_shared/BlockArrowIcons';

const iconClass = 'shrink-0';

export const ArrowUpRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <BlockArrowUpRightIcon className={className ?? iconClass} />
);

export const SolutionCategoryIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className ?? iconClass}
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.78907 5.67127V5.15344C6.78907 4.29549 7.48458 3.59998 8.34254 3.59998H10.4138C11.2718 3.59998 11.9673 4.29549 11.9673 5.15344V5.67127H14.5564V7.48365L12.4851 8.26038H6.27124L4.19995 7.48365V5.67127H6.78907ZM8.08362 5.15344C8.08362 5.01045 8.19954 4.89453 8.34254 4.89453H10.4138C10.5568 4.89453 10.6727 5.01045 10.6727 5.15344V5.67127H8.08362V5.15344Z"
      fill="currentColor"
    />
    <path
      d="M14.5564 8.86624L12.7199 9.55494H11.9673V10.5906H10.6727V9.55494H8.08362V10.5906H6.78907V9.55494H6.0365L4.19995 8.86624V13.9564H14.5564V8.86624Z"
      fill="currentColor"
    />
  </svg>
);
