import React, { createContext, useContext } from 'react';
import type { TabsProps } from './Tabs.types';
import { RadixTabs } from '../_internal';
import { radixRootRest } from '../_shared';

type TabsContextValue = {
  size?: TabsProps['size'];
  appearance?: TabsProps['appearance'];
};

export const TabsContext = createContext<TabsContextValue | null>(null);

export function useTabsContext() {
  return useContext(TabsContext);
}

/**
 * Tabs — tab list container, backed by `@radix-ui/react-tabs`.
 */
export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>((props, ref) => {
  const {
    value,
    defaultValue,
    onValueChange,
    size = 'md',
    appearance = 'brand',
    orientation = 'horizontal',
    className,
    children,
    ...rest
  } = props;

  return (
    <TabsContext.Provider value={{ size, appearance }}>
      <RadixTabs.Root
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        orientation={orientation}
        className={className}
        {...radixRootRest(rest)}
      >
        {children}
      </RadixTabs.Root>
    </TabsContext.Provider>
  );
});

Tabs.displayName = 'Tabs';

export const TabList = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <RadixTabs.List
      ref={ref}
      className={className}
      {...props}
    />
  ),
);
TabList.displayName = 'TabList';

export const TabPanel = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'> & { value: string }>(
  ({ className, value, ...props }, ref) => (
    <RadixTabs.Content
      ref={ref}
      value={value}
      className={className}
      {...props}
    />
  ),
);
TabPanel.displayName = 'TabPanel';
