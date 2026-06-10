/**
 * Hand-maintained Storybook index for Synaptik AI Icon Builder.
 * Imported by GeneratedIcons.stories.tsx (regenerated on publish; do not remove this file).
 */
import type { CSSProperties } from 'react';

export interface SynaptikIndexProps {
  projectSlugs?: string[];
}

const sectionStyle: CSSProperties = {
  marginBottom: 24,
};

const headingStyle: CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  margin: '0 0 8px',
  color: 'var(--color-text-primary, #353535)',
};

const bodyStyle: CSSProperties = {
  fontSize: 14,
  lineHeight: 1.55,
  margin: '0 0 8px',
  color: 'var(--color-text-secondary, #485B76)',
};

const codeBlockStyle: CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontFamily: 'ui-monospace, monospace',
  background: 'var(--color-surface-2, #F7F8FA)',
  border: '1px solid var(--color-border-base, #E5E7EB)',
  borderRadius: 8,
  padding: '10px 12px',
  margin: '8px 0',
  whiteSpace: 'pre-wrap',
  color: 'var(--color-text-primary, #353535)',
};

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 13,
  marginTop: 8,
};

const thStyle: CSSProperties = {
  textAlign: 'left',
  padding: '8px 10px',
  borderBottom: '1px solid var(--color-border-base, #E5E7EB)',
  color: 'var(--color-text-primary, #353535)',
  fontWeight: 600,
};

const tdStyle: CSSProperties = {
  padding: '8px 10px',
  borderBottom: '1px solid var(--color-border-base, #E5E7EB)',
  color: 'var(--color-text-secondary, #485B76)',
  verticalAlign: 'top',
};

const listStyle: CSSProperties = {
  margin: '8px 0 0',
  paddingLeft: 20,
  fontSize: 14,
  lineHeight: 1.55,
  color: 'var(--color-text-secondary, #485B76)',
};

const pillStyle: CSSProperties = {
  display: 'inline-block',
  fontSize: 12,
  padding: '4px 10px',
  margin: '4px 6px 4px 0',
  borderRadius: 6,
  background: 'var(--color-brand-subtle, #E7F0FF)',
  color: 'var(--color-text-primary, #353535)',
};

export function SynaptikIndex({ projectSlugs = [] }: SynaptikIndexProps) {
  return (
    <article style={{ maxWidth: 720, padding: '8px 0 24px' }}>
      <header style={{ ...sectionStyle, marginBottom: 28 }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 600,
            margin: '0 0 8px',
            color: 'var(--color-text-primary, #353535)',
          }}
        >
          Synaptik AI Icon Builder
        </h1>
        <p style={bodyStyle}>
          Raster icon catalog produced by Synaptik. Published projects appear in the sidebar under{' '}
          <strong>Generated Icons / {'{projectSlug}'}</strong> (All icons, By blocks, per-icon
          stories).
        </p>
      </header>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Prerequisites</h2>
        <p style={bodyStyle}>
          Copy <code>.env.example</code> to <code>.env</code> at the repo root. Set{' '}
          <code>FAL_KEY</code> (Flux render) and vision keys (<code>OPENAI_API_KEY</code> or
          OpenRouter). Full reference:{' '}
          <code>docs/synaptik-icon-builder.md</code>.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Launch the generator</h2>
        <p style={bodyStyle}>From the repository root:</p>
        <code style={codeBlockStyle}>
          {`cd modules/synaptik-icon-builder/ui
npm ci
npm run dev:reset`}
        </code>
        <p style={bodyStyle}>
          UI: <a href="http://127.0.0.1:3740/">http://127.0.0.1:3740</a>
          {' · '}
          API: <a href="http://127.0.0.1:3742/api/health">http://127.0.0.1:3742</a>
        </p>
        <p style={bodyStyle}>
          Use <strong>dev:reset</strong> if ports 3740/3742 are stuck or the UI shows a blank
          screen.
        </p>
        <p style={bodyStyle}>
          <strong>Another product repo (variant A):</strong> keep API keys in one shared{' '}
          <code>.env</code> (this monorepo root). Copy <code>synaptik.local.env.example</code> →{' '}
          <code>synaptik.local.env</code>, set <code>SYNAPTIK_ENV_FILE</code> and{' '}
          <code>SYNAPTIK_WORKSPACE_ROOT</code>, then from AICADS-PRO:{' '}
          <code>npm run synaptik:ui -- --workspace C:/your/product</code>. Keys are not sent to the
          browser — only the local API uses them.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Workflow</h2>
        <ol style={listStyle}>
          <li>Enter a site URL and run <strong>New analysis</strong> (creates a session under <code>.synaptik/sessions/</code>).</li>
          <li>For each card: pick metaphor <strong>A / B / C</strong>.</li>
          <li>
            <strong>Generate</strong> — preview PNG in the session only (<code>.synaptik/…/renders/</code>).
          </li>
          <li>
            <strong>Publish</strong> (or <strong>Publish all ready</strong>) — copies QA-ok previews into{' '}
            <code>generated-icons/</code> and regenerates Storybook stories.
          </li>
          <li>Open this Storybook section to review the catalog.</li>
        </ol>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Preview vs catalog</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Stage</th>
              <th style={thStyle}>On disk</th>
              <th style={thStyle}>In Storybook</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>After Generate</td>
              <td style={tdStyle}>
                <code>.synaptik/sessions/{'{id}'}/renders/</code>
              </td>
              <td style={tdStyle}>No</td>
            </tr>
            <tr>
              <td style={tdStyle}>After Publish</td>
              <td style={tdStyle}>
                <code>generated-icons/{'{projectSlug}'}/{'{iconSlug}'}/</code>
              </td>
              <td style={tdStyle}>Yes (commit recommended)</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Resume work with this repository</h2>
        <ol style={listStyle}>
          <li>
            <code>npm ci</code> (root) and <code>cd playground && npm ci</code>
          </li>
          <li>
            If you have local sessions: <code>npm run synaptik:fix-stories</code> (restores published
            assets from <code>.synaptik</code> and regenerates stories)
          </li>
          <li>
            After publish, commit <code>generated-icons/{'{projectSlug}'}/</code> (see{' '}
            <code>generated-icons/README.md</code>)
          </li>
          <li>
            <code>npm run storybook</code> (dev) or <code>npm run storybook:sync</code> (fix-stories +
            static build)
          </li>
        </ol>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Active projects</h2>
        {projectSlugs.length === 0 ? (
          <p style={bodyStyle}>
            No published projects yet. Run Synaptik, publish icons, then regenerate stories with{' '}
            <code>npm run synaptik:fix-stories</code>.
          </p>
        ) : (
          <>
            <p style={bodyStyle}>Open in the sidebar:</p>
            <div>
              {projectSlugs.map((slug) => (
                <span key={slug} style={pillStyle}>
                  Generated Icons / {slug}
                </span>
              ))}
            </div>
          </>
        )}
      </section>
    </article>
  );
}
