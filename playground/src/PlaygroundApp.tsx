import React, { useRef, useState } from 'react';
import { Popover } from '../../components/primitives/Popover/Popover';
import { Dropdown } from '../../components/primitives/Dropdown/Dropdown';

const FRUIT_OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
  { value: 'fig', label: 'Fig' },
  { value: 'grape', label: 'Grape' },
  { value: 'honeydew', label: 'Honeydew' },
];

function BarePopoverSection() {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  return (
    <div className="pg-card">
      <h2>1. Bare Popover (manual open/close)</h2>
      <p className="note">
        Direct usage. Anchor is the surrounding <code>relative</code> div.
        Verifies that the Radix-backed Popover renders into a portal, is
        positioned under the anchor, and respects <code>--radius</code>,{' '}
        <code>shadow-elevation-2</code> and <code>z-popover</code>.
      </p>
      <div className="pg-row">
        <div className="relative inline-block">
          <button
            ref={anchorRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-default)',
              border: '1px solid var(--color-border-base)',
              background: 'var(--color-surface-1)',
              cursor: 'pointer',
            }}
          >
            {open ? 'Hide popover' : 'Show popover'}
          </button>
          <Popover open={open} anchorRef={anchorRef} aria-label="Demo popover">
            <div style={{ padding: 12, minWidth: 220 }}>
              <p style={{ margin: 0, fontWeight: 600 }}>Hi from a Radix portal.</p>
              <p style={{ margin: '6px 0 0', fontSize: 12, opacity: 0.7 }}>
                If you can read this, the positioning, portal and z-index all work.
              </p>
            </div>
          </Popover>
        </div>
      </div>
    </div>
  );
}

function DropdownSingleSection() {
  const [value, setValue] = useState<string | string[] | undefined>('banana');
  return (
    <div className="pg-card">
      <h2>2. Dropdown (single select, sm/md/lg)</h2>
      <p className="note">
        Real consumer of Popover. Verifies that opening still works, that the
        listbox is wide enough (anchor width), and that Escape /
        outside-click still dismiss via AICADS <code>behaviors</code> — not via
        Radix (we suppress Radix dismissal).
      </p>
      <div className="pg-row">
        <Dropdown
          size="sm"
          options={FRUIT_OPTIONS}
          value={value}
          onChange={(v) => setValue(v)}
          placeholder="Pick a fruit (sm)"
        />
        <Dropdown
          size="md"
          options={FRUIT_OPTIONS}
          value={value}
          onChange={(v) => setValue(v)}
          placeholder="Pick a fruit (md)"
        />
        <Dropdown
          size="lg"
          options={FRUIT_OPTIONS}
          value={value}
          onChange={(v) => setValue(v)}
          placeholder="Pick a fruit (lg)"
        />
      </div>
    </div>
  );
}

function DropdownMultiSection() {
  const [value, setValue] = useState<string | string[] | undefined>([
    'apple',
    'cherry',
  ]);
  return (
    <div className="pg-card">
      <h2>3. Dropdown (multi-select)</h2>
      <p className="note">
        Verifies that multi-select chips, the listbox role and the
        aria-multiselectable attribute survive the Radix migration.
      </p>
      <div className="pg-row">
        <Dropdown
          size="md"
          multiple
          options={FRUIT_OPTIONS}
          value={value}
          onChange={(v) => setValue(v)}
          placeholder="Pick fruits"
        />
      </div>
    </div>
  );
}

export const PlaygroundApp: React.FC = () => {
  return (
    <div className="pg-grid">
      <header>
        <h1 style={{ margin: 0, fontSize: 20 }}>AICADS · Phase 1a smoke playground</h1>
        <p style={{ margin: '4px 0 0', opacity: 0.7 }}>
          Popover is now backed by <code>@radix-ui/react-popover</code> behind
          <code> _internal/Popover/RadixPopover</code>. Public API is preserved.
        </p>
      </header>
      <BarePopoverSection />
      <DropdownSingleSection />
      <DropdownMultiSection />
    </div>
  );
};
