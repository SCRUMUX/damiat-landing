import React, { createContext, useContext, useCallback } from 'react';
import type { RadioGroupProps } from './RadioGroup.types';
import { RadixRadioGroup } from '../_internal';
import { radixRootRest } from '../_shared';

type RadioGroupContextValue = {
  value?: string;
  disabled?: boolean;
  name?: string;
};

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export function useRadioGroupContext() {
  return useContext(RadioGroupContext);
}

/**
 * RadioGroup — группа взаимоисключающих RadioButton, backed by `@radix-ui/react-radio-group`.
 */
export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>((props, ref) => {
  const {
    value,
    defaultValue,
    onValueChange,
    disabled = false,
    name,
    orientation = 'vertical',
    className,
    children,
    ...rest
  } = props;

  const handleValueChange = useCallback((next: string) => {
    onValueChange?.(next);
  }, [onValueChange]);

  return (
    <RadioGroupContext.Provider value={{ value, disabled, name }}>
      <RadixRadioGroup.Root
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        disabled={disabled}
        name={name}
        orientation={orientation}
        className={className}
        {...radixRootRest(rest)}
      >
        {children}
      </RadixRadioGroup.Root>
    </RadioGroupContext.Provider>
  );
});

RadioGroup.displayName = 'RadioGroup';
