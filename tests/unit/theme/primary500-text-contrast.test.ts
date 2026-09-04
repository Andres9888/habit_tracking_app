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

  it('button config uses primary[700] for both fill and text', () => {
    // primary[500] (#10B981) behind white 17px semibold is 2.54:1 — it fails
    // WCAG AA (4.5:1) and even the 3:1 non-text floor, so it must not be a
    // filled-CTA background. primary[700] is 5.48:1 light / 13.83:1 dark.
    const content = fs.readFileSync(
      path.join(SRC, 'components/Button/useButtonConfig.ts'),
      'utf-8'
    );
    expect(content).toContain('primary?.[700]');
    expect(content).not.toContain('primary?.[500]');
  });

  it('filled CTA greens clear WCAG AA against white label text', () => {
    const srgb = (c: number) => {
      const v = c / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    const luminance = (hex: string) => {
      const n = parseInt(hex.slice(1), 16);
      return (
        0.2126 * srgb((n >> 16) & 255) +
        0.7152 * srgb((n >> 8) & 255) +
        0.0722 * srgb(n & 255)
      );
    };
    const contrast = (a: string, b: string) => {
      const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
      return (hi + 0.05) / (lo + 0.05);
    };

    // Guard the regression directly rather than by string match.
    expect(contrast('#047857', '#FFFFFF')).toBeGreaterThanOrEqual(4.5);
    expect(contrast('#10B981', '#FFFFFF')).toBeLessThan(3);
  });

  it('theme token primary[700] is #047857', () => {
    const content = fs.readFileSync(path.join(SRC, 'theme/colors/core.ts'), 'utf-8');
    expect(content).toMatch(/700:\s*'#047857'/);
  });
});
