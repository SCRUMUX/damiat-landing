import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toaster, toast } from './Toast';
import type { ToastAppearance } from './Toast.types';
import { Button } from '../Button/Button';

const InfoIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10 9v4M10 7h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CheckCircle: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
    <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WarningIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 3L2 17h16L10 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M10 8v4M10 14h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/**
 * AICADS v0.5.0 ships only the imperative `toast()` API + `<Toaster />` host.
 * The legacy presentational `<Toast>` component has been removed — see
 * docs/migrations/v0.4-to-v0.5.md for the upgrade path.
 */
const meta: Meta<typeof Toaster> = {
  title: 'Primitives/Toast',
  component: Toaster,
  parameters: {
    docs: {
      description: {
        component:
          '`toast()` — imperative notification API. Mount `<Toaster />` once near the app root; call `toast({ appearance, title, ... })` from anywhere. Backed by `sonner` under the hood (see `components/primitives/_internal/Toast`).',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Toaster>;

export const ImperativeAPI: Story = {
  render: () => {
    const appearances: ToastAppearance[] = ['info', 'success', 'warning', 'danger'];
    const icons: Record<ToastAppearance, React.ReactNode> = {
      info: <InfoIcon />,
      success: <CheckCircle />,
      warning: <WarningIcon />,
      danger: <WarningIcon />,
    };
    return (
      <div className="flex flex-wrap gap-[var(--space-8)]">
        <Toaster position="top-right" />
        {appearances.map((a) => (
          <Button
            key={a}
            appearance="base"
            size="sm"
            onClick={() =>
              toast({
                appearance: a,
                title: `${a.charAt(0).toUpperCase() + a.slice(1)} toast`,
                description: `This is a ${a} notification.`,
                icon: icons[a],
                showClose: true,
                duration: 4000,
              })
            }
          >
            Show {a}
          </Button>
        ))}
      </div>
    );
  },
};

export const Positions: Story = {
  render: () => {
    const positions = ['top-right', 'top-center', 'top-left', 'bottom-right', 'bottom-center', 'bottom-left'] as const;
    const [position, setPosition] = React.useState<(typeof positions)[number]>('top-right');
    return (
      <div className="flex flex-col gap-[var(--space-12)]">
        <Toaster position={position} />
        <div className="flex flex-wrap gap-[var(--space-8)]">
          {positions.map((p) => (
            <Button
              key={p}
              appearance={p === position ? 'brand' : 'base'}
              size="sm"
              onClick={() => setPosition(p)}
            >
              {p}
            </Button>
          ))}
        </div>
        <Button
          appearance="base"
          size="md"
          onClick={() =>
            toast({
              appearance: 'info',
              title: `Pinned at ${position}`,
              description: 'Click any position button above to relocate the stack.',
              icon: <InfoIcon />,
              duration: 4000,
            })
          }
        >
          Fire toast
        </Button>
      </div>
    );
  },
};
