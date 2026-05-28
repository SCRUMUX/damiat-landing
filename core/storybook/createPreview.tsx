import React, { useLayoutEffect } from 'react';
import type { Preview, Decorator } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { MARKETING_VIEWPORTS } from './marketingViewports';

type ThemeName = 'light' | 'dark';

const ThemeWrapper: React.FC<{ theme: ThemeName; children: React.ReactNode }> = ({
  theme,
  children,
}) => {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const prev = root.getAttribute('data-theme');
    root.setAttribute('data-theme', theme);
    document.body.style.background = 'var(--color-bg-base)';
    document.body.style.color = 'var(--color-text-primary)';
    return () => {
      if (prev === null) root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', prev);
    };
  }, [theme]);

  return <>{children}</>;
};

const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals.theme as ThemeName) ?? 'light';
  return (
    <ThemeWrapper theme={theme}>
      <Story />
    </ThemeWrapper>
  );
};

export function createPreview(): Preview {
  return {
    globalTypes: {
      theme: {
        name: 'Theme',
        description: 'AICADS theme (sets data-theme on <html>)',
        defaultValue: 'light',
        toolbar: {
          icon: 'paintbrush',
          items: [
            { value: 'light', title: 'Light', icon: 'sun' },
            { value: 'dark', title: 'Dark', icon: 'moon' },
          ],
          showName: true,
          dynamicTitle: true,
        },
      },
    },
    decorators: [withTheme],
    parameters: {
      layout: 'padded',
      backgrounds: { disable: true },
      viewport: {
        viewports: {
          ...INITIAL_VIEWPORTS,
          ...MARKETING_VIEWPORTS,
        },
      },
      controls: {
        matchers: {
          color: /(background|color)$/i,
          date: /Date$/i,
        },
      },
    },
  };
}
