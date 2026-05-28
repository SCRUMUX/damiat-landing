import type React from 'react';

export type RadixDirection = 'ltr' | 'rtl';

export function toRadixDirection(dir?: string): RadixDirection | undefined {
  return dir === 'ltr' || dir === 'rtl' ? dir : undefined;
}

/** Strip HTML attrs that conflict with Radix roots (slider, tabs, accordion, …). */
export function radixRootRest<T extends React.HTMLAttributes<HTMLElement>>(rest: T) {
  const { defaultValue: _defaultValue, defaultChecked: _defaultChecked, dir, onClick: _onClick, ...safe } = rest;
  const radixDir = toRadixDirection(dir);
  return {
    ...safe,
    ...(radixDir ? { dir: radixDir } : {}),
  };
}

/** Strip HTML input attrs that conflict with Radix checkbox (button root). */
export function radixCheckboxRest<T extends React.InputHTMLAttributes<HTMLInputElement>>(rest: T) {
  const { onClick: _onClick, dir, defaultValue: _defaultValue, defaultChecked: _defaultChecked, ...safe } = rest;
  const radixDir = toRadixDirection(dir);
  return {
    ...safe,
    ...(radixDir ? { dir: radixDir } : {}),
  };
}

/** Strip HTML input attrs that conflict with Radix radio item. */
export function radixRadioItemRest<T extends React.InputHTMLAttributes<HTMLInputElement>>(rest: T) {
  const {
    value: _value,
    onClick: _onClick,
    dir,
    defaultValue: _defaultValue,
    defaultChecked: _defaultChecked,
    ...safe
  } = rest;
  const radixDir = toRadixDirection(dir);
  return {
    ...safe,
    ...(radixDir ? { dir: radixDir } : {}),
  };
}

/** Strip HTML div attrs that conflict with Radix select trigger (button root). */
export function radixSelectTriggerRest<T extends React.HTMLAttributes<HTMLDivElement>>(rest: T) {
  const { onClick: _onClick, dir, defaultValue: _defaultValue, defaultChecked: _defaultChecked, ...safe } = rest;
  const radixDir = toRadixDirection(dir);
  return {
    ...safe,
    ...(radixDir ? { dir: radixDir } : {}),
  };
}
