import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditPrompt } from './prompt-audit.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../../..');
const brokenPromptPath = path.join(
  repoRoot,
  '.synaptik/sessions/1b081e1c/prompts/nevernyj-moment-prodazhi.txt',
);

describe('auditPrompt', () => {
  it('flags legacy fallback prompt with cyrillic subject', () => {
    if (!fs.existsSync(brokenPromptPath)) {
      const sample = `Isometric icon set.
Icon subject:
Single isometric stylized icon object, not a photograph, no environment: Abstract Isometric symbol representing: Неверный момент продажи
Solid white background.`;
      const report = auditPrompt(sample);
      assert.ok(report.identifiedIssues.includes('cyrillic_in_subject'));
      assert.ok(
        report.identifiedIssues.includes('subject_replaced_by_card_title_fallback'),
      );
      assert.ok(report.semanticWeight < 0.3);
      return;
    }
    const text = fs.readFileSync(brokenPromptPath, 'utf8');
    const report = auditPrompt(text);
    assert.ok(report.identifiedIssues.includes('cyrillic_in_subject'));
    assert.ok(
      report.identifiedIssues.includes('subject_replaced_by_card_title_fallback'),
    );
  });

  it('scores healthy subject higher', () => {
    const good = assembleGoodPrompt();
    const report = auditPrompt(good);
    assert.ok(report.subjectWeight > 0.1);
    assert.equal(
      report.identifiedIssues.includes('subject_replaced_by_card_title_fallback'),
      false,
    );
  });
});

function assembleGoodPrompt(): string {
  return `=== SUBJECT BLOCK ===
Single isometric stylized icon object, not a photograph, no environment: Isometric stylized wall clock with visible hour hand

=== STYLE BLOCK ===
Isometric icon set.
Damiat agriculture technology icon set

=== COMPOSITION BLOCK ===
Single centered object.
Solid white #FFFFFF background only.`;
}
