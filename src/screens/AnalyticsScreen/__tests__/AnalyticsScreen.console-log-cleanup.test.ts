/**
 * Verifies that placeholder console.log handlers have been removed
 * from AnalyticsScreen and its sub-components.
 *
 * These were debug placeholders that leaked to production.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const HOOKS_PATH = path.resolve(
  __dirname,
  '../AnalyticsScreen.hooks.ts'
);
const CHART_PATH = path.resolve(
  __dirname,
  '../components/ChartSections.tsx'
);
const INSIGHTS_PATH = path.resolve(
  __dirname,
  '../components/InsightsSections.tsx'
);

let hooksSource: string;
let chartSource: string;
let insightsSource: string;

beforeAll(() => {
  hooksSource = fs.readFileSync(HOOKS_PATH, 'utf-8');
  chartSource = fs.readFileSync(CHART_PATH, 'utf-8');
  insightsSource = fs.readFileSync(INSIGHTS_PATH, 'utf-8');
});

describe('AnalyticsScreen - no placeholder console.log handlers', () => {
  it('handleHabitPress should not contain console.log', () => {
    expect(hooksSource).not.toContain(
      "console.log('Navigate to habit detail:"
    );
  });

  it('handleHabitPress should be a no-op', () => {
    expect(hooksSource).toMatch(
      /handleHabitPress\s*=\s*useCallback\(\(_habitId:\s*string\)\s*=>\s*\{\}/
    );
  });

  it('ChartSections should not pass console.log to onSegmentPress', () => {
    expect(chartSource).not.toContain('onSegmentPress');
  });

  it('ChartSections should not pass console.log to onDataPointPress', () => {
    expect(chartSource).not.toContain('onDataPointPress');
  });

  it('ChartSections should not pass console.log to onDayPress', () => {
    expect(chartSource).not.toContain('onDayPress');
  });

  it('ChartSections should have no console.log calls', () => {
    expect(chartSource).not.toContain('console.log');
  });

  it('InsightsSections should not pass console.log to onArchivePress', () => {
    expect(insightsSource).not.toContain('onArchivePress');
  });

  it('InsightsSections should have no console.log calls', () => {
    expect(insightsSource).not.toContain('console.log');
  });

  it('isPremiumUser TODO should still be tracked', () => {
    expect(hooksSource).toContain(
      '// TODO: Replace with actual premium status check'
    );
  });
});
