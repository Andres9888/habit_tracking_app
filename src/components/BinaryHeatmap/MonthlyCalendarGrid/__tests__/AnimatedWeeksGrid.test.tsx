/**
 * AnimatedWeeksGrid — regression coverage for the joinRight wiring that
 * makes the chain-link correctness rule visible end-to-end. This is the
 * integration boundary where a bug in the *call site* (e.g. accidentally
 * passing a flattened/global index instead of the per-row `week` array and
 * row-local `dayIndex`) would actually leak a join bar across the week
 * wrap, even though `shouldJoinRight` itself is already unit-tested in
 * chainLinkHelpers.test.ts.
 *
 * connectorStyle='small' is used (not 'full') because the row-level
 * ChainConnectors ribbon only renders once `rowWidth` is measured via a
 * real onLayout event, which the RN test renderer never fires — so it's
 * unobservable at this render() boundary. The small connector (rendered
 * per-day via CalendarDayBodyConnector, testID='chain-small-connector')
 * is driven by the exact same `joinRight` value from the same
 * `shouldJoinRight(week, dayIndex)` call site, so it's an equally valid
 * (and directly observable) window into the same wiring.
 */
import React from 'react';
import { render, within } from '@testing-library/react-native';
import { AnimatedWeeksGrid } from '../AnimatedWeeksGrid';
import type { DayData } from '../types';

function makeDay(dayNumber: number, overrides: Partial<DayData> = {}): DayData {
  const dateString = `2026-07-${String(dayNumber).padStart(2, '0')}`;
  return {
    date: new Date(dateString),
    dateString,
    dayNumber,
    isCurrentMonth: true,
    isToday: false,
    isFuture: false,
    isBeforeCreation: false,
    isCompleted: true,
    isMissed: false,
    ...overrides,
  };
}

const textColors = {
  inverse: '#FFFFFF',
  muted: '#9CA3AF',
  primary: '#111827',
  tertiary: '#6B7280',
};

const defaultProps = {
  completedBg: '#D1FAE5',
  surfaceBg: '#FFFFFF',
  direction: 'left' as const,
  habitColor: '#10B981',
  monthKey: '2026-07',
  onPress: () => {},
  shape: 'square' as const,
  textColors,
};

describe('AnimatedWeeksGrid — joinRight wiring', () => {
  it('never shows join evidence on the last column (index 6) of a fully-completed week, even when the next row also starts completed', () => {
    // Week 1: a full 7-day week, every day completed/current-month/not-future
    // — the worst case for leaking a join across the week wrap, since every
    // adjacent pair "looks" joinable. Week 2's first day is ALSO completed,
    // which is deliberate: it's the exact scenario that would expose a
    // regression where the call site passes a flattened/global index (or a
    // flattened `weeks.flat()` array) instead of the per-row `week` +
    // row-local `dayIndex` — week 1's last column would incorrectly "see"
    // week 2's first day as its right neighbor and join across the wrap.
    const week1 = Array.from({ length: 7 }, (_, i) => makeDay(i + 1));
    const week2 = Array.from({ length: 7 }, (_, i) => makeDay(i + 8));

    const { getByLabelText, queryAllByTestId } = render(
      <AnimatedWeeksGrid
        {...defaultProps}
        connectorStyle='small'
        weeks={[week1, week2]}
      />
    );

    const lastColumnOfWeek1 = getByLabelText('Day 7, completed');
    expect(
      within(lastColumnOfWeek1).queryByTestId('chain-small-connector')
    ).toBeNull();

    // Exactly 6 connectors should render in week 1 (indices 0-5) and 6 in
    // week 2 (indices 0-5) — 12 total. If the boundary guard or the call
    // site's row-local indexing ever regressed (e.g. a flattened/global
    // index), this would become 13, with the extra one at week 1's last
    // column.
    expect(queryAllByTestId('chain-small-connector')).toHaveLength(12);
  });

  it('shows join evidence on a middle column when it and its right neighbor are completed', () => {
    const week = Array.from({ length: 7 }, (_, i) => makeDay(i + 1));

    const { getByLabelText } = render(
      <AnimatedWeeksGrid
        {...defaultProps}
        connectorStyle='small'
        weeks={[week]}
      />
    );

    // index 5 (day 6) — second-to-last column, whose right neighbor (day 7,
    // index 6) is also completed, so it must show the join evidence.
    const secondToLastColumn = getByLabelText('Day 6, completed');
    expect(
      within(secondToLastColumn).getByTestId('chain-small-connector')
    ).toBeTruthy();
  });

  it('does not show join evidence when a day is not completed', () => {
    const week = Array.from({ length: 7 }, (_, i) => makeDay(i + 1));
    week[6] = makeDay(7, { isCompleted: false });

    const { getByLabelText } = render(
      <AnimatedWeeksGrid
        {...defaultProps}
        connectorStyle='small'
        weeks={[week]}
      />
    );

    // index 5's right neighbor (index 6) is no longer completed, so index 5
    // must no longer show the join evidence either.
    const secondToLastColumn = getByLabelText('Day 6, completed');
    expect(
      within(secondToLastColumn).queryByTestId('chain-small-connector')
    ).toBeNull();
  });
});
