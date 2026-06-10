import React from 'react';
import { cn } from '../../../components/primitives/_shared';
import {
  APP_SHELL_MAIN_CLASS,
  APP_SHELL_MAIN_INNER_CLASS,
  APP_SHELL_MAIN_WRAP_CLASS,
  APP_SHELL_MOBILE_NAV_CLASS,
  APP_SHELL_MOBILE_NAV_LIST_CLASS,
  APP_SHELL_NAV_ICON_ROW_CLASS,
  APP_SHELL_NAV_LINK_ACTIVE_CLASS,
  APP_SHELL_NAV_LINK_CLASS,
  APP_SHELL_ROOT_CLASS,
  APP_SHELL_SIDEBAR_CLASS,
  APP_SHELL_SIDEBAR_HEADER_CLASS,
  APP_SHELL_SIDEBAR_LOGO_CLASS,
  APP_SHELL_SIDEBAR_NAV_CLASS,
  APP_SHELL_TOPBAR_CLASS,
  APP_SHELL_TOPBAR_CONTEXT_CLASS,
  APP_SHELL_TOPBAR_USER_CLASS,
} from '../../_shared/blockLayout';
import { SectionShell } from '../../_shared/SectionShell';
import type { AppShellBlockProps } from './AppShellBlock.types';

export type { AppShellBlockProps, AppShellNavItem } from './AppShellBlock.types';

function AppShellNavLinks({
  nav,
  activeId,
  onNavigate,
  className,
}: Pick<AppShellBlockProps, 'nav' | 'activeId' | 'onNavigate'> & {
  className?: string;
}) {
  return (
    <ul className={cn(className)}>
      {nav.map((item) => {
        const active = item.id === activeId;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={active ? APP_SHELL_NAV_LINK_ACTIVE_CLASS : APP_SHELL_NAV_LINK_CLASS}
              aria-current={active ? 'page' : undefined}
              onClick={(event) => {
                event.preventDefault();
                onNavigate?.(item.id);
              }}
            >
              {item.icon ? (
                <span className={APP_SHELL_NAV_ICON_ROW_CLASS}>
                  {item.icon}
                  {item.label}
                </span>
              ) : (
                item.label
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export const AppShellBlock: React.FC<AppShellBlockProps> = ({
  logo = 'DAMIAT',
  storageLabel,
  userLabel,
  nav,
  activeId,
  onNavigate,
  children,
  className,
}) => (
  <div className={cn(APP_SHELL_ROOT_CLASS, className)} aria-label="Application shell">
    <aside className={APP_SHELL_SIDEBAR_CLASS} aria-label="Primary navigation">
      <div className={APP_SHELL_SIDEBAR_HEADER_CLASS}>
        {typeof logo === 'string' ? (
          <span className={APP_SHELL_SIDEBAR_LOGO_CLASS}>{logo}</span>
        ) : (
          <div className={APP_SHELL_SIDEBAR_LOGO_CLASS}>{logo}</div>
        )}
      </div>
      <AppShellNavLinks
        nav={nav}
        activeId={activeId}
        onNavigate={onNavigate}
        className={APP_SHELL_SIDEBAR_NAV_CLASS}
      />
    </aside>

    <div className={APP_SHELL_MAIN_WRAP_CLASS}>
      <header className={APP_SHELL_TOPBAR_CLASS}>
        <h1 className={APP_SHELL_TOPBAR_CONTEXT_CLASS}>{storageLabel}</h1>
        <span className={APP_SHELL_TOPBAR_USER_CLASS}>{userLabel}</span>
      </header>

      <nav className={APP_SHELL_MOBILE_NAV_CLASS} aria-label="Mobile navigation">
        <AppShellNavLinks
          nav={nav}
          activeId={activeId}
          onNavigate={onNavigate}
          className={APP_SHELL_MOBILE_NAV_LIST_CLASS}
        />
      </nav>

      <SectionShell
        recipe="section.app-shell"
        appearance="surface"
        as="main"
        growContent
        className={cn(APP_SHELL_MAIN_CLASS, '!py-0')}
        contentClassName="mx-0 max-w-none px-0"
        style={{ paddingTop: 0, paddingBottom: 0 }}
      >
        <div className={APP_SHELL_MAIN_INNER_CLASS}>{children}</div>
      </SectionShell>
    </div>
  </div>
);

AppShellBlock.displayName = 'AppShellBlock';
