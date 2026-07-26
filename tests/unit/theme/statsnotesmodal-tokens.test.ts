/**
 * Analytics token migration contracts.
 *
 * StatsNotesModal was retired; analytics now uses TrendLineChart and the
 * consolidated weekly-pattern components. These checks follow those live
 * source paths and guard centralized warm-theme usage.
 */

import fs from 'fs';
import path from 'path';
import { colors } from '@/theme/colors';

const SRC = path.resolve(__dirname, '../../../src');
const readSource = (relativePath: string) =>
  fs.readFileSync(path.join(SRC, relativePath), 'utf8');

describe('TrendLineChart uses centralized tokens', () => {
  const source = readSource('components/TrendLineChart/TrendLineChart.tsx');

  it('imports the color palette', () => {
    expect(source).toContain("from '../../theme/colors'");
  });

  it('does not use the retired green literal', () => {
    expect(source).not.toContain('#48bb78');
  });

  it('does not use the retired gray-fill literal', () => {
    expect(source).not.toContain('#dde3ed');
  });

  it('does not use the retired stone-500 literal', () => {
    expect(source).not.toContain('#78716c');
  });

  it('uses the primary token for its line', () => {
    expect(source).toContain('color={colors.primary[500]}');
  });

  it('uses the primary token for its points', () => {
    expect(source.match(/colors\.primary\[500\]/g)?.length).toBeGreaterThanOrEqual(2);
  });

  it('uses the semantic border for axes', () => {
    expect(source).toContain('lineColor: colors.border');
  });

  it('uses tertiary text for x-axis labels', () => {
    expect(source).toContain('labelColor: colors.text.tertiary');
  });

  it('uses a bounded 0-100 strength domain', () => {
    expect(source).toContain('domain={{ y: [0, 100] }}');
  });

  it('retains the empty-state path for missing data', () => {
    expect(source).toContain('return <EmptyState />');
  });
});

describe('TrendLineChart styles use design-system primitives', () => {
  const source = readSource('components/TrendLineChart/styles.ts');

  it('imports colors from the theme', () => {
    expect(source).toContain("from '../../theme/colors'");
  });

  it('imports typography from the theme', () => {
    expect(source).toContain("from '../../theme/typography'");
  });

  it('imports spacing, radii, and shadows from the theme', () => {
    expect(source).toContain("from '../../theme/spacing'");
  });

  it('uses the semantic surface token', () => {
    expect(source).toContain('backgroundColor: colors.surface');
  });

  it('uses secondary text for readable labels', () => {
    expect(source).toContain('color: colors.text.secondary');
  });

  it('uses tertiary text for empty-state supporting copy', () => {
    expect(source).toContain('color: colors.text.tertiary');
  });

  it('uses the modal shadow token for the tooltip', () => {
    expect(source).toContain('...shadows.modal');
  });
});

describe('WeeklyPatternChart uses theme-aware tokens', () => {
  const source = readSource(
    'components/ProgressSectionConsolidated/WeeklyPatternChart.tsx'
  );

  it('uses useThemeColors instead of a static page palette', () => {
    expect(source).toContain('useThemeColors');
  });

  it('uses primary text for its heading', () => {
    expect(source).toContain('colors.text.primary');
  });

  it('uses premium semantic tokens for its detail action', () => {
    expect(source).toContain('colors.status.premiumText');
  });

  it('uses a theme gray surface for the chart', () => {
    expect(source).toContain('backgroundColor: colors.gray[50]');
  });

  it('does not contain the retired completion green literal', () => {
    expect(source).not.toContain('#48bb78');
  });

  it('does not contain the retired gray-fill literal', () => {
    expect(source).not.toContain('#dde3ed');
  });

  it('keeps the chart accessible as a summarized image', () => {
    expect(source).toContain("accessibilityRole='image'");
  });
});

describe('Current core token values', () => {
  it('primary[500] remains the focus/accent green', () => {
    expect(colors.primary[500]).toBe('#10B981');
  });

  it('gray[200] is the warm border gray', () => {
    expect(colors.gray[200]).toBe('#DDD8D2');
  });

  it('gray[300] is the warm disabled gray', () => {
    expect(colors.gray[300]).toBe('#C4BFB7');
  });

  it('gray[400] is the accessible tertiary gray', () => {
    expect(colors.gray[400]).toBe('#6E6660');
  });

  it('gray[500] is the accessible secondary gray', () => {
    expect(colors.gray[500]).toBe('#6B6560');
  });

  it('border aliases gray[200]', () => {
    expect(colors.border).toBe(colors.gray[200]);
  });
});
