export interface EthyleneModeCard {
  id: string;
  /** Card title, e.g. «Режим хранения» */
  label: string;
  /** Short badge text, e.g. «DAMIAT · КГС» */
  badge?: string;
  /** Brand-accented badge (DAMIAT mode) or muted (non-applicable mode). */
  badgeVariant?: 'brand' | 'muted';
  /** Concentration range shown prominently, e.g. «~0,3 ppm» */
  ppm: string;
  /** Delivery rhythm, e.g. «Постоянная микроподача» */
  rhythm: string;
  /** Brief physiological mechanism */
  mechanism: string;
  /** Practical outcome for the storage operator */
  effect: string;
}

export interface DamiatEthylenePhysiologyBlockProps {
  title?: string;
  subtitle?: string;
  /** Exactly two mode cards: [storage, ripening] */
  modes: [EthyleneModeCard, EthyleneModeCard];
  /** Closing note about DAMIAT automatic mode switching */
  footnote?: string;
  className?: string;
}
