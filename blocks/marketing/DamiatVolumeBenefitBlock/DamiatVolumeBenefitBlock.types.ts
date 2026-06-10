export interface VolumeBenefitBarItem {
  volumeTons: number;
  /** Override computed benefit (₽). */
  benefitRub?: number;
}

export interface DamiatVolumeBenefitBlockProps {
  title?: string;
  subtitle?: string;
  /** Storage volumes for ascending bars, t — default from 1 000 t. */
  volumeStepsTons?: number[];
  calculatorHref?: string;
  calculatorCtaLabel?: string;
  className?: string;
}
