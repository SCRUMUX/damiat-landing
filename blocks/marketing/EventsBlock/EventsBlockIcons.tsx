import React from 'react';

const iconClass = 'shrink-0';

export const DotIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className ?? iconClass} width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
    <circle cx="4" cy="4" r="3" fill="currentColor" />
  </svg>
);

export const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className ?? iconClass} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className ?? iconClass} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className ?? iconClass} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
