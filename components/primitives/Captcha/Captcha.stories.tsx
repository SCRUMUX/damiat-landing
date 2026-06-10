import React, { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Captcha } from './Captcha';
import type { CaptchaState } from './Captcha.types';

const meta: Meta<typeof Captcha> = {
  title: 'Primitives/Captcha',
  component: Captcha,
  parameters: {
    docs: {
      description: {
        component:
          '`@UI/Captcha` — placeholder-виджет для встраивания reCAPTCHA / hCaptcha. ' +
          'Фиксированный размер 160×72px. Состояния: `idle`, `loading`, `success`, `error`.',
      },
    },
  },
  argTypes: {
    state:       { control: 'select', options: ['idle', 'loading', 'success', 'error'] },
    placeholder: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof Captcha>;

// ─── Default ─────────────────────────────────────────────────────────────────
export const Default: Story = {
  args: {
    state: 'idle',
    placeholder: 'Captcha',
  },
};

// ─── All States ───────────────────────────────────────────────────────────────
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      {(['idle', 'loading', 'success', 'error'] as CaptchaState[]).map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>state={s}</span>
          <Captcha state={s} />
        </div>
      ))}
    </div>
  ),
};

// ─── Idle ─────────────────────────────────────────────────────────────────────
export const Idle: Story = {
  args: {
    state: 'idle',
    placeholder: 'Captcha',
  },
};

// ─── Loading ─────────────────────────────────────────────────────────────────
export const Loading: Story = {
  args: {
    state: 'loading',
  },
};

// ─── Success ─────────────────────────────────────────────────────────────────
export const Success: Story = {
  args: {
    state: 'success',
  },
};

// ─── Error ───────────────────────────────────────────────────────────────────
export const Error: Story = {
  args: {
    state: 'error',
  },
};

// ─── Interactive simulation ───────────────────────────────────────────────────
export const Interactive: Story = {
  render: () => {
    const [state, setState] = useState<CaptchaState>('idle');
    const [log, setLog] = useState<string[]>([]);

    const addLog = (msg: string) => setLog((prev) => [...prev.slice(-4), msg]);

    const handleClick = () => {
      if (state === 'idle') {
        setState('loading');
        addLog('→ Verifying…');
        setTimeout(() => {
          const ok = Math.random() > 0.3;
          setState(ok ? 'success' : 'error');
          addLog(ok ? '✓ Verified!' : '✗ Verification failed');
        }, 1800);
      } else if (state === 'error' || state === 'success') {
        setState('idle');
        setLog([]);
        addLog('↺ Reset');
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
          Click the widget to simulate verification (70% success rate).
        </div>
        <div onClick={handleClick} style={{ cursor: state === 'loading' ? 'not-allowed' : 'pointer' }}>
          <Captcha state={state} />
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {log.map((l, i) => <span key={i}>{l}</span>)}
        </div>
        {(state === 'success' || state === 'error') && (
          <button
            onClick={() => { setState('idle'); setLog([]); }}
            style={{
              fontSize: 12,
              padding: '4px 12px',
              border: '1px solid var(--color-border-base)',
              borderRadius: 4,
              cursor: 'pointer',
              background: 'white',
            }}
          >
            Reset
          </button>
        )}
      </div>
    );
  },
};

// ─── Custom placeholder ───────────────────────────────────────────────────────
export const CustomPlaceholder: Story = {
  args: {
    state: 'idle',
    placeholder: 'I\'m not a robot',
  },
};
