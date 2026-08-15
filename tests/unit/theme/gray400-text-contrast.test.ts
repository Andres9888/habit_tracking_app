/**
 * Gray-400 / gray-500 contrast tokens
 */

import * as fs from 'fs';
import * as path from 'path';
import { colors } from '@/theme/colors';

const SRC = path.resolve(__dirname, '../../../src');

describe('Gray contrast tokens', () => {
  it('gray-400 is #6E6660 and gray-500 is #6B6560', () => {
    expect(colors.gray[400]).toBe('#6E6660');
    expect(colors.gray[500]).toBe('#6B6560');
    const core = fs.readFileSync(path.join(SRC, 'theme/colors/core.ts'), 'utf-8');
    expect(core).toMatch(/400:\s*'#6E6660'/);
    expect(core).toMatch(/500:\s*'#6B6560'/);
  });

  it('StrengthProgressBar hint text uses gray[500]', () => {
    const content = fs.readFileSync(
      path.join(
        SRC,
        'components/StrengthProgressBar/StrengthProgressBar.styles.ts'
      ),
      'utf-8'
    );
    expect(content).toContain('colors.gray[500]');
  });

  it('MilestoneProgress uses theme gray tokens (not #6B7280)', () => {
    const content = fs.readFileSync(
      path.join(
        SRC,
        'components/ProgressSectionConsolidated/MilestoneProgress/styles/progress.styles.ts'
      ),
      'utf-8'
    );
    expect(content).not.toMatch(/#6B7280/i);
    expect(content).toContain('colors.gray[400]');
    expect(content).toContain('colors.gray[500]');
  });
});
