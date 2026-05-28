import React, { useEffect, useId, useState } from 'react';
import { cn } from '../../../components/primitives/_shared';
import './damiatGasOscilloscope.css';

const CX = 250;
const CY = 250;

type TelemetryFrame = {
  scan: string;
  co2: string;
  c2h4: string;
  o3: string;
  rh: string;
  temp: string;
  index: string;
};

const TELEMETRY_FRAMES: TelemetryFrame[] = [
  { scan: '041', co2: '912', c2h4: '0.11', o3: '0.38', rh: '86', temp: '+4.1', index: '76' },
  { scan: '042', co2: '918', c2h4: '0.12', o3: '0.39', rh: '87', temp: '+4.2', index: '77' },
  { scan: '043', co2: '920', c2h4: '0.12', o3: '0.40', rh: '87', temp: '+4.2', index: '78' },
  { scan: '044', co2: '917', c2h4: '0.13', o3: '0.41', rh: '88', temp: '+4.3', index: '78' },
  { scan: '045', co2: '923', c2h4: '0.12', o3: '0.40', rh: '87', temp: '+4.2', index: '79' },
  { scan: '046', co2: '919', c2h4: '0.11', o3: '0.39', rh: '86', temp: '+4.1', index: '77' },
];

function TickRing({ r, majorEvery = 10 }: { r: number; majorEvery?: number }) {
  const ticks: React.ReactNode[] = [];
  for (let i = 0; i < 60; i++) {
    const deg = i * 6 - 90;
    const rad = (deg * Math.PI) / 180;
    const major = i % majorEvery === 0;
    const len = major ? 10 : 5;
    const x1 = CX + (r - len) * Math.cos(rad);
    const y1 = CY + (r - len) * Math.sin(rad);
    const x2 = CX + r * Math.cos(rad);
    const y2 = CY + r * Math.sin(rad);
    ticks.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="currentColor"
        strokeOpacity={major ? 0.75 : 0.35}
        strokeWidth={major ? 1.25 : 0.75}
      />,
    );
  }
  return <g>{ticks}</g>;
}

/** Symmetric accent arcs — 12–3 h and 6–9 h on outer radius. */
function SymmetricAccentArcs({ r }: { r: number }) {
  const topArc = `M ${CX} ${CY - r} A ${r} ${r} 0 0 1 ${CX + r} ${CY}`;
  const bottomArc = `M ${CX} ${CY + r} A ${r} ${r} 0 0 1 ${CX - r} ${CY}`;
  return (
    <g stroke="currentColor" strokeLinecap="round" fill="none">
      <path d={topArc} strokeOpacity={0.45} strokeWidth={2} strokeDasharray="40 120" />
      <path d={bottomArc} strokeOpacity={0.3} strokeWidth={1.5} strokeDasharray="32 128" />
    </g>
  );
}

const DIGIT_FADE_MS = 420;

function HudFadingValue({ value, large, className }: { value: string; large?: boolean; className?: string }) {
  const [shown, setShown] = useState(value);
  const [faded, setFaded] = useState(false);

  useEffect(() => {
    if (value === shown) return undefined;
    setFaded(true);
    const swap = window.setTimeout(() => {
      setShown(value);
      setFaded(false);
    }, DIGIT_FADE_MS);
    return () => window.clearTimeout(swap);
  }, [value, shown]);

  return (
    <span
      className={cn(
        'damiat-hud-sensor__digit damiat-hud-sensor__digit-value font-normal leading-none',
        large ? 'text-[18px] min-[1024px]:text-[22px]' : 'text-[13px] min-[1024px]:text-[16px]',
        className,
      )}
      style={{ ['--damiat-digit-opacity' as string]: faded ? 0.14 : 0.55 }}
    >
      {shown}
    </span>
  );
}

function HudDigit({
  label,
  value,
  large,
  className,
}: {
  label: string;
  value: string;
  large?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-[2px]', className)}>
      <span
        className={cn(
          'damiat-hud-sensor__label text-[9px] uppercase tracking-[0.16em] min-[1024px]:text-[10px]',
        )}
      >
        {label}
      </span>
      <HudFadingValue value={value} large={large} />
    </div>
  );
}

export const DamiatGasOscilloscope: React.FC<{ className?: string }> = ({ className }) => {
  const uid = useId().replace(/:/g, '');
  const glowId = `damiat-hud-glow-${uid}`;
  const waveClipId = `damiat-hud-wave-clip-${uid}`;
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setFrameIndex((i) => (i + 1) % TELEMETRY_FRAMES.length);
    }, 1100);
    return () => window.clearInterval(id);
  }, []);

  const t = TELEMETRY_FRAMES[frameIndex];
  const wavePath =
    'M0 12 L6 8 L12 14 L18 6 L24 16 L30 10 L36 18 L42 7 L48 13 L54 9 L60 15 L66 11 L72 17 L78 8 L84 14 L90 10';

  return (
    <div
      className={cn(
        'damiat-hud-sensor relative mx-auto w-full max-w-[var(--space-400)] bg-transparent min-[1024px]:mx-0 min-[1024px]:max-w-[var(--space-480)]',
        className,
      )}
      style={{ aspectRatio: '1' }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 500 500"
        className="damiat-hud-sensor__svg-layer overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id={waveClipId}>
            <rect x={52} y={238} width={80} height={28} />
          </clipPath>
        </defs>

        <g filter={`url(#${glowId})`} className="damiat-hud-sensor__graphics">
          <g className="damiat-hud-sensor__ring--ccw-mid">
            <circle
              cx={CX}
              cy={CY}
              r={198}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.2}
              strokeWidth={0.75}
              strokeDasharray="3 8"
            />
          </g>

          <SymmetricAccentArcs r={185} />

          <g className="damiat-hud-sensor__ring--ticks">
            <circle cx={CX} cy={CY} r={175} fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={0.75} />
            <TickRing r={175} majorEvery={5} />
          </g>

          <g className="damiat-hud-sensor__ring--cw-slow">
            <circle cx={CX} cy={CY} r={142} fill="none" stroke="currentColor" strokeOpacity={0.22} strokeWidth={1} />
            <circle
              cx={CX}
              cy={CY}
              r={128}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.12}
              strokeWidth={0.75}
              strokeDasharray="1 12"
            />
          </g>

          <g className="damiat-hud-sensor__ring--cw-fast">
            <circle
              cx={CX}
              cy={CY}
              r={98}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.35}
              strokeWidth={1.25}
              strokeDasharray="20 40"
            />
          </g>

          {[0, 30, 60, 90, 120, 150].map((deg) => {
            const rad = ((deg - 90) * Math.PI) / 180;
            return (
              <line
                key={deg}
                x1={CX}
                y1={CY}
                x2={CX + 185 * Math.cos(rad)}
                y2={CY + 185 * Math.sin(rad)}
                stroke="currentColor"
                strokeOpacity={0.06}
                strokeWidth={0.75}
              />
            );
          })}

          <g className="damiat-hud-sensor__core">
            <circle cx={CX} cy={CY} r={28} fill="none" stroke="currentColor" strokeOpacity={0.55} strokeWidth={1.5} />
            <circle
              cx={CX}
              cy={CY}
              r={14}
              fill="currentColor"
              fillOpacity={0.12}
              stroke="currentColor"
              strokeOpacity={0.8}
              strokeWidth={1}
            />
            <circle cx={CX} cy={CY} r={4} fill="currentColor" fillOpacity={0.95} />
            <line x1={CX - 22} y1={CY} x2={CX + 22} y2={CY} stroke="currentColor" strokeOpacity={0.35} strokeWidth={0.75} />
            <line x1={CX} y1={CY - 22} x2={CX} y2={CY + 22} stroke="currentColor" strokeOpacity={0.35} strokeWidth={0.75} />
          </g>

          <g className="damiat-hud-sensor__sweep">
            <line
              x1={CX}
              y1={CY}
              x2={CX}
              y2={CY - 175}
              stroke="currentColor"
              strokeOpacity={0.35}
              strokeWidth={1}
              strokeLinecap="round"
            />
            <circle
              cx={CX}
              cy={CY - 168}
              r={4}
              fill="var(--color-success-base)"
              fillOpacity={0.95}
            />
          </g>

          {[12, 78, 145, 210, 285, 330].map((deg) => {
            const rad = ((deg - 90) * Math.PI) / 180;
            return (
              <circle
                key={deg}
                cx={CX + 188 * Math.cos(rad)}
                cy={CY + 188 * Math.sin(rad)}
                r={2}
                fill="currentColor"
                fillOpacity={0.5}
              />
            );
          })}
        </g>

        <g className="damiat-hud-sensor__graphics">
          <rect
            x={48}
            y={234}
            width={88}
            height={28}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.25}
            strokeWidth={0.75}
            rx={2}
          />
          <g clipPath={`url(#${waveClipId})`}>
            <g className="damiat-hud-sensor__wave-track" transform="translate(52, 238)">
              <path
                d={wavePath}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={wavePath}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="translate(48 0)"
                opacity={0.55}
              />
            </g>
          </g>
        </g>

      </svg>

      <div className="damiat-hud-sensor__readouts">
        <div className="absolute left-1/2 top-[3%] flex -translate-x-1/2 items-baseline gap-[var(--space-2)]">
          <span className="damiat-hud-sensor__label damiat-hud-sensor__scan text-[10px] tracking-[0.2em] min-[1024px]:text-[11px]">
            SCAN ·
          </span>
          <HudFadingValue value={t.scan} className="text-[10px] min-[1024px]:text-[11px]" />
        </div>
        <HudDigit
          label="CO₂ ppm"
          value={t.co2}
          large
          className="absolute right-[-2%] top-[14%] items-end text-right"
        />
        <HudDigit
          label="C₂H₄"
          value={t.c2h4}
          className="absolute right-[-4%] top-[42%] items-end text-right"
        />
        <HudDigit
          label="O₃"
          value={t.o3}
          className="absolute right-[-2%] top-[58%] items-end text-right"
        />
        <HudDigit
          label="RH"
          value={`${t.rh}%`}
          className="absolute left-[-2%] top-[58%]"
        />
        <HudDigit
          label="T°"
          value={t.temp}
          className="absolute left-[-4%] top-[72%]"
        />
        <HudDigit
          label="Оценка хранения"
          value={t.index}
          large
          className="absolute bottom-[-2%] left-1/2 -translate-x-1/2 items-center text-center"
        />
      </div>
    </div>
  );
};

DamiatGasOscilloscope.displayName = 'DamiatGasOscilloscope';
