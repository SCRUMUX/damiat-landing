import type React from 'react';

export interface AppShellNavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface AppShellBlockProps {
  logo?: React.ReactNode;
  storageLabel: string;
  userLabel: string;
  nav: AppShellNavItem[];
  activeId: string;
  onNavigate?: (id: string) => void;
  children: React.ReactNode;
  className?: string;
}
