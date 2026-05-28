import type { SelectOption } from '../../../components/primitives/Select';

export interface DamiatCalculatorFieldConfig {
  id: keyof DamiatCalculatorFormValues;
  label: string;
  placeholder?: string;
  inputType?: 'text' | 'number';
}

export interface DamiatCalculatorMarketItem {
  label: string;
  value: string;
}

export interface DamiatCalculatorDeviceConfig {
  id: 'device1' | 'device2';
  label: string;
}

export interface DamiatCalculatorResultMetric {
  id: string;
  value: string;
  label: string;
  /** Primary DAMIAT Index metric — larger typography */
  primary?: boolean;
}

export interface DamiatCalculatorFormValues {
  region: string;
  volume: string;
  price: string;
  storagePeriod: string;
  storageType: string;
  device1: boolean;
  device2: boolean;
}

export interface DamiatCalculatorBlockProps {
  title?: string;
  subtitle?: string;
  fields: DamiatCalculatorFieldConfig[];
  regionOptions: SelectOption[];
  storageTypeOptions: SelectOption[];
  marketTitle?: string;
  marketItems: DamiatCalculatorMarketItem[];
  devices: DamiatCalculatorDeviceConfig[];
  devicesTitle?: string;
  resultsTitle?: string;
  calculateLabel?: string;
  defaultValues?: Partial<DamiatCalculatorFormValues>;
  /** Demo metrics after «Рассчитать» (Storybook / landing fixtures). */
  demoResults: DamiatCalculatorResultMetric[];
  className?: string;
}
