import React, { useCallback, useState } from 'react';
import { Button } from '../../../components/primitives/Button';
import { cn } from '../../../components/primitives/_shared';
import { SectionShell } from '../../_shared/SectionShell';
import { BlockSectionHeader } from '../../_shared/BlockSectionHeader';
import { BLOCK_SPLIT_CLASS } from '../../_shared/blockLayout';
import { DamiatCalculatorForm } from './DamiatCalculatorForm';
import { DamiatCalculatorResults } from './DamiatCalculatorResults';
import type {
  DamiatCalculatorBlockProps,
  DamiatCalculatorFormValues,
} from './DamiatCalculatorBlock.types';

export type {
  DamiatCalculatorBlockProps,
  DamiatCalculatorFormValues,
  DamiatCalculatorFieldConfig,
  DamiatCalculatorMarketItem,
  DamiatCalculatorDeviceConfig,
  DamiatCalculatorResultMetric,
} from './DamiatCalculatorBlock.types';

const INITIAL_VALUES: DamiatCalculatorFormValues = {
  region: '',
  volume: '',
  price: '',
  storagePeriod: '',
  storageType: '',
  device1: true,
  device2: true,
};

export const DamiatCalculatorBlock: React.FC<DamiatCalculatorBlockProps> = ({
  title = 'Рассчитайте DAMIAT Index вашего урожая',
  subtitle,
  fields,
  regionOptions,
  storageTypeOptions,
  marketTitle,
  marketItems,
  devices,
  devicesTitle,
  resultsTitle,
  calculateLabel = 'Рассчитать DAMIAT Index',
  defaultValues,
  demoResults,
  className,
}) => {
  const [values, setValues] = useState<DamiatCalculatorFormValues>({
    ...INITIAL_VALUES,
    ...defaultValues,
  });
  const [resultsVisible, setResultsVisible] = useState(Boolean(defaultValues?.region));

  const handleCalculate = useCallback(() => {
    setResultsVisible(true);
  }, []);

  return (
    <SectionShell recipe="section.calculator" appearance="base" className={className} aria-label="DAMIAT calculator">
      <BlockSectionHeader title={title} subtitle={subtitle} />
      <div className={cn(BLOCK_SPLIT_CLASS, 'items-start')}>
        <div className="flex w-full min-w-0 flex-col gap-[var(--space-24)] min-[1024px]:flex-[1_1_55%]">
          <DamiatCalculatorForm
            fields={fields}
            regionOptions={regionOptions}
            storageTypeOptions={storageTypeOptions}
            marketTitle={marketTitle}
            marketItems={marketItems}
            devices={devices}
            devicesTitle={devicesTitle}
            defaultValues={defaultValues}
            values={values}
            onValuesChange={setValues}
          />
          <Button appearance="brand" size="lg" onClick={handleCalculate}>
            {calculateLabel}
          </Button>
        </div>
        <div className="w-full min-w-0 min-[1024px]:flex-[1_1_45%]">
          <DamiatCalculatorResults
            title={resultsTitle}
            metrics={demoResults}
            visible={resultsVisible}
          />
        </div>
      </div>
    </SectionShell>
  );
};

DamiatCalculatorBlock.displayName = 'DamiatCalculatorBlock';
