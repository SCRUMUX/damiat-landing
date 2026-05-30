/**
 * Invariants for calculator engine (Agro preset: 536 га × 28 т/га).
 * Run: npx tsx scripts/verify-engine.ts
 */
import { POTATO_CROP } from '../calculatorCropsData';
import {
  computeFullResult,
  deviceCostTotal,
  getComparisonChartSeries,
  totalTonsFromFields,
} from '../calculatorEngine';
import { CALCULATOR_MONTHS } from '../calculatorCropsData';
import { buildUniformSalesStrings, parseScheduleCell, roundTons1, redistributeSalesFromMonth } from '../calculatorSchedule';
import { STORAGE_MONTHS } from '../calculatorConfig';

const AGRO_HECTARES = 536;
const AGRO_YIELD = 28;
const volumeTons = totalTonsFromFields(AGRO_HECTARES, AGRO_YIELD);
const uniformSales = buildUniformSalesStrings(volumeTons);

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(`ASSERT: ${msg}`);
}

function approxEqual(a: number, b: number, rel = 0.002, abs = 1): boolean {
  const d = Math.abs(a - b);
  const scale = Math.max(Math.abs(a), Math.abs(b), 1);
  return d <= abs || d / scale <= rel;
}

const result = computeFullResult(POTATO_CROP, volumeTons, 0, undefined, uniformSales);
assert(result != null, 'computeFullResult returned null');
const r = result!;

assert(r.schedule.plannedSalesTons.length === STORAGE_MONTHS, 'schedule length');
assert(
  approxEqual(r.schedule.plannedSalesTons.reduce((a, b) => a + b, 0), volumeTons, 0.001, 0.1),
  'uniform sales sum === volume',
);

const lossFracWithout = r.without.totalLossTons / volumeTons;
const lossFracWith = r.with.totalLossTons / volumeTons;
assert(lossFracWithout < 0.2, `without loss frac reasonable, got ${lossFracWithout}`);
assert(lossFracWith < lossFracWithout, `with loss < without loss`);

assert(
  approxEqual(r.lossSavings, r.without.totalLossRub - r.with.totalLossRub, 1e-9, 0.01),
  'lossSavings === without.totalLossRub - with.totalLossRub',
);
assert(
  approxEqual(r.profitDelta, Math.max(0, r.totalProfitWith - r.totalProfitWithout), 1e-9, 0.01),
  'profitDelta === max(0, totalProfitWith - totalProfitWithout)',
);
assert(approxEqual(r.netBenefit, r.profitDelta, 1e-9, 0.01), 'netBenefit === profitDelta');

const costTotal = deviceCostTotal(volumeTons);
assert(approxEqual(r.deviceCostTotal, costTotal, 1e-9, 0.01), 'deviceCostTotal consistent');

for (const [name, scenario] of [
  ['without', r.without],
  ['with', r.with],
] as const) {
  assert(scenario.months.length === CALCULATOR_MONTHS, `${name}: month count`);
  for (let i = 0; i < scenario.months.length; i++) {
    const m = scenario.months[i];
    assert(
      approxEqual(m.lossRub, m.lossTons * m.priceForecast, 0.001, 0.5),
      `${name}[${i}]: lossRub ≈ lossTons × priceForecast`,
    );
    assert(
      approxEqual(m.soldRub, m.soldTons * m.priceForecast, 0.001, 0.5),
      `${name}[${i}]: soldRub ≈ soldTons × priceForecast`,
    );
    const deviceCost = name === 'with' ? costTotal / STORAGE_MONTHS : 0;
    assert(
      approxEqual(m.monthResult, Math.max(0, m.soldRub - m.lossRub - m.opexRub - deviceCost), 0.001, 1),
      `${name}[${i}]: monthResult cash-flow (non-negative)`,
    );
    assert(m.stockEnd >= -0.01, `${name}[${i}]: stockEnd non-negative`);
  }
  const last = scenario.months[scenario.months.length - 1];
  assert(
    approxEqual(last.cumLossRub, scenario.totalLossRub, 0.001, 0.5),
    `${name}: last month cumLossRub === totalLossRub`,
  );
  assert(
    approxEqual(last.cumLossTons, scenario.totalLossTons, 0.001, 0.01),
    `${name}: last month cumLossTons === totalLossTons`,
  );
  assert(
    approxEqual(scenario.finalStock, last.stockEnd, 0.001, 0.01),
    `${name}: finalStock === last stockEnd`,
  );
}

const series = getComparisonChartSeries(r);
assert(series.labels.length === CALCULATOR_MONTHS, 'chart series length');
assert(series.lossRubWithout.length === CALCULATOR_MONTHS, 'lossRubWithout length');
for (let i = 0; i < CALCULATOR_MONTHS; i++) {
  assert(
    approxEqual(series.lossRubWithout[i], r.without.months[i].lossRub, 1e-9, 0.01),
    `lossRubWithout[${i}] === without.months[i].lossRub`,
  );
  assert(
    approxEqual(series.lossRubWith[i], r.with.months[i].lossRub, 1e-9, 0.01),
    `lossRubWith[${i}] === with.months[i].lossRub`,
  );
}

assert(roundTons1(1.25) === 1.3, 'roundTons1 one decimal');

const editedSales = buildUniformSalesStrings(120);
editedSales[2] = '30';
const redistributed = redistributeSalesFromMonth(120, editedSales, 2);
const redistSum = redistributed.reduce((a, s) => a + parseScheduleCell(s, 0), 0);
assert(approxEqual(redistSum, 120, 0.001, 0.1), 'redistribute sum === volume');
assert(redistributed[2] === '30' || redistributed[2] === '30,0', 'edited month preserved');
const tailVals = redistributed.slice(3).map((s) => parseScheduleCell(s, 0));
const tailHead = tailVals.slice(0, -1);
assert(
  tailHead.length === 0 || tailHead.every((v) => approxEqual(v, tailHead[0], 0.01, 0.1)),
  'tail months uniform (last may differ by rounding)',
);

const overflowRedist = redistributeSalesFromMonth(120, ['150', ...Array(STORAGE_MONTHS - 1).fill('')], 0);
assert(overflowRedist.every((s) => parseScheduleCell(s, 0) >= 0), 'overflow redistribute: no negative tons');
assert(
  approxEqual(
    overflowRedist.reduce((a, s) => a + parseScheduleCell(s, 0), 0),
    120,
    0.001,
    0.1,
  ),
  'overflow redistribute: sum === volume',
);

console.log('verify-engine: OK', {
  volumeTons,
  lossWithoutPct: `${(lossFracWithout * 100).toFixed(1)}%`,
  lossWithPct: `${(lossFracWith * 100).toFixed(1)}%`,
  lossSavingsMln: (r.lossSavings / 1e6).toFixed(2),
  netBenefitMln: (r.netBenefit / 1e6).toFixed(2),
});
