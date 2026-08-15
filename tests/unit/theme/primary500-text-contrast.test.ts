/**
 * Readable green text uses primary-700 (#047857)
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC = path.resolve(__dirname, '../../../src');

const TEXT_FILES = [
  {
    file: 'components/HabitRankingsList/itemStyles.ts',
    pattern: 'colors.primary[700]',
  },
  {
    file: 'components/WeeklyInsightsCard/SuggestedActions.styles.ts',
    pattern: 'colors.primary[700]',
  },
  {
    file: 'components/ShareCardGenerator/components/ShareCardHeader.tsx',
    pattern: 'primary[700]',
  },
];

describe('Primary-700 for readable text', () => {
  for (const { file, pattern } of TEXT_FILES) {
    it(`${file} uses ${pattern}`, () => {
      const content = fs.readFileSync(path.join(SRC, file), 'utf-8');
      expect(content).toContain(pattern);
    });
  }

  it('button config maps fill to primary[500] and text to primary[700]', () => {
    const content = fs.readFileSync(
      path.join(SRC, 'components/Button/useButtonConfig.ts'),
      'utf-8'
    );
    expect(content).toContain('primary?.[500]');
    expect(content).toContain('primary?.[700]');
  });

  it('theme token primary[700] is #047857', () => {
    const content = fs.readFileSync(path.join(SRC, 'theme/colors/core.ts'), 'utf-8');
    expect(content).toMatch(/700:\s*'#047857'/);
  });
});
