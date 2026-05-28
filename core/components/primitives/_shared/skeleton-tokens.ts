import contract from '../../../contracts/components/Skeleton.contract.json';
import type { VR } from './utils';

const rules = (contract.variantRules || []) as unknown as VR[];

export type SkeletonComponent = 'card' | 'chart' | 'list' | 'page' | 'table';
export type SkeletonContainerSize = 'sm' | 'md' | 'lg';

/** Container classes from Skeleton.contract — both axes are layout, not findClasses({ size }). */
export function getSkeletonContainerClasses(
  component: SkeletonComponent,
  size: SkeletonContainerSize,
): string[] {
  return rules
    .filter((r) => r.when.component === component && r.when.size === size)
    .flatMap((r) => r.tailwindClasses);
}
