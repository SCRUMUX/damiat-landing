import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';
import type { AlertAppearance, AlertVariant } from './Alert.types';
import { ExclamationDiamondFillIcon, CloseXIcon } from '../../icons';
import { Button } from '../Button/Button';

const APPEARANCES: AlertAppearance[] = ['warning', 'info', 'danger', 'success'];
const VARIANTS: AlertVariant[] = ['basic', 'leftBorder', 'topBorder', 'solid'];

const meta: Meta<typeof Alert> = {
  title: 'Primitives/Alert',
  component: Alert,
  parameters: {
    docs: { description: { component: "Alert: иконка слева, заголовок, параграф, кнопка закрытия (×). Варианты appearance (warning, info, danger, success), variant (basic, leftBorder, topBorder, solid). Проп `onClose` делает × кликабельным, `open` управляет видимостью." } },
  },
  argTypes: {
    appearance: { control: 'select', options: APPEARANCES },
    variant: { control: 'select', options: VARIANTS },
    showLeftIcon: { control: 'boolean' },
    showTitle: { control: 'boolean' },
    showParagraph: { control: 'boolean' },
    title: { control: 'text' },
    paragraph: { control: 'text' },
    onClose: { action: 'closed' },
  },
};
export default meta;
type Story = StoryObj<typeof Alert>;

const leftIcon = <ExclamationDiamondFillIcon style={{ width: '100%', height: '100%' }} />;

export const Default: Story = {
  args: {
    appearance: 'warning',
    variant: 'basic',
    iconLeft: leftIcon,
    showLeftIcon: true,
    title: 'Alert title',
    paragraph: 'Alert description or additional context.',
  },
};

export const Dismissible: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
        {!open && (
          <Button size="sm" appearance="ghost" onClick={() => setOpen(true)}>
            Show alert again
          </Button>
        )}
        <Alert
          appearance="warning"
          variant="basic"
          iconLeft={leftIcon}
          showLeftIcon
          title="Dismissible alert"
          paragraph="Click the × to close this alert."
          open={open}
          onClose={() => setOpen(false)}
        />
      </div>
    );
  },
};

export const AllAppearances: Story = {
  render: () => {
    const [hidden, setHidden] = useState<Record<string, boolean>>({});
    const allHidden = APPEARANCES.every(a => hidden[a]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
        {allHidden && (
          <Button size="sm" appearance="ghost" onClick={() => setHidden({})}>
            Show all alerts
          </Button>
        )}
        {APPEARANCES.map((a) => (
          <Alert
            key={a}
            appearance={a}
            variant="basic"
            iconLeft={leftIcon}
            showLeftIcon
            title={`${a.charAt(0).toUpperCase() + a.slice(1)} alert`}
            paragraph="Alert description or additional context."
            open={!hidden[a]}
            onClose={() => setHidden(prev => ({ ...prev, [a]: true }))}
          />
        ))}
      </div>
    );
  },
};

export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
      {VARIANTS.map((v) => (
        <Alert
          key={v}
          {...args}
          variant={v}
          iconLeft={leftIcon}
          showLeftIcon
          title={`variant="${v}"`}
          paragraph="Alert description or additional context."
        />
      ))}
    </div>
  ),
  args: { appearance: 'warning' },
};

export const AllAppearancesAllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 16 }}>
      {APPEARANCES.map((a) => (
        <div key={a} style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {VARIANTS.map((v) => (
            <Alert
              key={`${a}-${v}`}
              appearance={a}
              variant={v}
              iconLeft={leftIcon}
              showLeftIcon
              title={`${a} / ${v}`}
              paragraph="Alert description."
            />
          ))}
        </div>
      ))}
    </div>
  ),
};
