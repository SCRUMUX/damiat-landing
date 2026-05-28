import React, { useCallback, useState } from 'react';
import { Input } from '../../../components/primitives/Input';
import { Select } from '../../../components/primitives/Select';
import { Switch } from '../../../components/primitives/Switch';
import { cn } from '../../../components/primitives/_shared';
import {
  BLOCK_CARD_COMPACT_CLASS,
  BLOCK_CARD_COMPACT_INSET_CLASS,
} from '../../_shared/blockLayout';
import type {
  DamiatCalculatorBlockProps,
  DamiatCalculatorFormValues,
} from './DamiatCalculatorBlock.types';

const DEFAULT_VALUES: DamiatCalculatorFormValues = {
  region: '',
  volume: '',
  price: '',
  storagePeriod: '',
  storageType: '',
  device1: true,
  device2: true,
};

export interface DamiatCalculatorFormProps
  extends Pick<
    DamiatCalculatorBlockProps,
    | 'fields'
    | 'regionOptions'
    | 'storageTypeOptions'
    | 'marketTitle'
    | 'marketItems'
    | 'devices'
    | 'devicesTitle'
    | 'defaultValues'
  > {
  values: DamiatCalculatorFormValues;
  onValuesChange: (values: DamiatCalculatorFormValues) => void;
}

const FIELD_STACK_CLASS = 'flex w-full min-w-0 flex-col gap-[var(--space-12)]';
const FIELD_ROW_CLASS = cn(
  'flex w-full min-w-0 flex-col gap-[var(--space-12)]',
  'min-[1024px]:grid min-[1024px]:grid-cols-2 min-[1024px]:gap-[var(--space-16)]',
);

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-[var(--space-4)] block text-style-caption font-medium text-[var(--color-text-secondary)]">
      {children}
    </span>
  );
}

export const DamiatCalculatorForm: React.FC<DamiatCalculatorFormProps> = ({
  fields,
  regionOptions,
  storageTypeOptions,
  marketTitle = 'Рыночный слой (авто)',
  marketItems,
  devices,
  devicesTitle = 'Оборудование',
  defaultValues,
  values,
  onValuesChange,
}) => {
  const update = useCallback(
    (patch: Partial<DamiatCalculatorFormValues>) => {
      onValuesChange({ ...values, ...patch });
    },
    [onValuesChange, values],
  );

  const textFields = fields.filter((f) => f.id !== 'region' && f.id !== 'storageType');

  return (
    <div className={FIELD_STACK_CLASS}>
      <div className={FIELD_ROW_CLASS}>
        <div>
          <FieldLabel>Регион</FieldLabel>
          <Select
            size="md"
            placeholder="Выберите регион"
            options={regionOptions}
            value={values.region || undefined}
            onValueChange={(region) => update({ region })}
          />
        </div>
        {textFields.slice(0, 1).map((field) => (
          <div key={field.id}>
            <FieldLabel>{field.label}</FieldLabel>
            <Input
              size="md"
              fullWidth
              type={field.inputType ?? 'text'}
              placeholder={field.placeholder}
              value={values[field.id] as string}
              onChange={(e) => update({ [field.id]: e.target.value } as Partial<DamiatCalculatorFormValues>)}
            />
          </div>
        ))}
      </div>

      <div className={FIELD_ROW_CLASS}>
        {textFields.slice(1).map((field) => (
          <div key={field.id}>
            <FieldLabel>{field.label}</FieldLabel>
            <Input
              size="md"
              fullWidth
              type={field.inputType ?? 'text'}
              placeholder={field.placeholder}
              value={values[field.id] as string}
              onChange={(e) => update({ [field.id]: e.target.value } as Partial<DamiatCalculatorFormValues>)}
            />
          </div>
        ))}
        <div>
          <FieldLabel>Тип хранилища</FieldLabel>
          <Select
            size="md"
            placeholder="Тип хранилища"
            options={storageTypeOptions}
            value={values.storageType || undefined}
            onValueChange={(storageType) => update({ storageType })}
          />
        </div>
      </div>

      <div className={cn(BLOCK_CARD_COMPACT_CLASS, BLOCK_CARD_COMPACT_INSET_CLASS, 'bg-[var(--color-surface-2)]')}>
        <p className="m-0 mb-[var(--space-12)] text-style-body-strong text-[var(--color-text-primary)]">
          {marketTitle}
        </p>
        <ul className="m-0 flex list-none flex-col gap-[var(--space-8)] p-0">
          {marketItems.map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between gap-[var(--space-16)] text-style-body-sm"
            >
              <span className="text-[var(--color-text-secondary)]">{item.label}</span>
              <span className="text-style-tabular font-medium text-[var(--color-text-primary)]">{item.value}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="m-0 mb-[var(--space-12)] text-style-body-strong text-[var(--color-text-primary)]">
          {devicesTitle}
        </p>
        <div className="flex flex-col gap-[var(--space-12)] min-[1024px]:flex-row min-[1024px]:gap-[var(--space-24)]">
          {devices.map((device) => (
            <label
              key={device.id}
              className="flex cursor-pointer items-center gap-[var(--space-12)] text-style-body-sm text-[var(--color-text-primary)]"
            >
              <Switch
                size="md"
                state={values[device.id] ? 'on' : 'off'}
                onToggle={(checked) => update({ [device.id]: checked } as Partial<DamiatCalculatorFormValues>)}
                aria-label={device.label}
              />
              {device.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

DamiatCalculatorForm.displayName = 'DamiatCalculatorForm';
