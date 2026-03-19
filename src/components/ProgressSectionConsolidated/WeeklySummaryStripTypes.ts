/**
 * WeeklySummaryStrip Types - Barrel Export
 *
 * Re-exports all types, constants, and configs for backward compatibility.
 */

export type {
  WeekDayData,
  DayVisualState,
  TrendDirection,
  WeeklySummaryStripProps,
  DayStateConfig,
} from './WeeklySummaryStrip/WeeklySummaryStrip.types';

export {
  DAY_ABBREVIATIONS,
  DAY_NAMES,
} from './WeeklySummaryStrip/WeeklySummaryStrip.constants';

export { getDayStateConfigs } from './WeeklySummaryStrip/dayStateConfigs';
