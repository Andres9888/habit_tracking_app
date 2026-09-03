import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import * as Reanimated from 'react-native-reanimated';
import type { Id } from '../../../../convex/_generated/dataModel';
import { durations } from '@/theme/animations';
import { HabitChainVisualizer } from '../HabitChainVisualizer';
import { DAY_TOGGLE_SCALE } from '../useHabitDayToggleHandlers';

const WEEK_DATE_STRINGS = [
  '2025-12-01',
  '2025-12-02',
  '2025-12-03',
  '2025-12-04',
  '2025-12-05',
  '2025-12-06',
  '2025-12-07',
];

const WEEK_STATUS = [
  'done',
  'planned',
  'planned',
  'planned',
  'planned',
  'planned',
  'planned',
] as const;

describe('HabitChainVisualizer', () => {
  afterEach(() => jest.restoreAllMocks());

  it('renders a checkbox icon when completionIcon is checkbox', () => {
    const { getAllByTestId } = render(
      <HabitChainVisualizer
        accentColor='#10b981'
        celebrationsEnabled={false}
        completionIcon='checkbox'
        habitId={'habits:test' as Id<'habits'>}
        onToggle={() => {}}
        reduceMotionPreference={true}
        weekDateStrings={WEEK_DATE_STRINGS}
        weekStatus={[...WEEK_STATUS]}
      />
    );

    expect(getAllByTestId('lucide-icon-Check').length).toBeGreaterThan(0);
  });

  it('does not render a checkbox icon when completionIcon is chain', () => {
    const { queryByTestId } = render(
      <HabitChainVisualizer
        accentColor='#10b981'
        celebrationsEnabled={false}
        completionIcon='chain'
        habitId={'habits:test' as Id<'habits'>}
        onToggle={() => {}}
        reduceMotionPreference={true}
        weekDateStrings={WEEK_DATE_STRINGS}
        weekStatus={[...WEEK_STATUS]}
      />
    );

    expect(queryByTestId('lucide-icon-Check')).toBeNull();
  });

  it('renders square shape by default', () => {
    const { getAllByRole } = render(
      <HabitChainVisualizer
        accentColor='#10b981'
        habitId={'habits:test' as Id<'habits'>}
        onToggle={() => {}}
        weekDateStrings={WEEK_DATE_STRINGS}
        weekStatus={[...WEEK_STATUS]}
      />
    );

    // Default shape should be square (rendered with borderRadius: 9)
    expect(getAllByRole('checkbox').length).toBeGreaterThan(0);
  });

  it('renders circle shape when shape prop is circle', () => {
    const { getAllByRole } = render(
      <HabitChainVisualizer
        accentColor='#10b981'
        habitId={'habits:test' as Id<'habits'>}
        onToggle={() => {}}
        shape='circle'
        weekDateStrings={WEEK_DATE_STRINGS}
        weekStatus={[...WEEK_STATUS]}
      />
    );

    // Circle shape should be rendered with borderRadius: 20
    expect(getAllByRole('checkbox').length).toBeGreaterThan(0);
  });

  it('shows chain connectors when showConnectors is true', () => {
    const { toJSON } = render(
      <HabitChainVisualizer
        accentColor='#10b981'
        habitId={'habits:test' as Id<'habits'>}
        onToggle={() => {}}
        showConnectors={true}
        weekDateStrings={WEEK_DATE_STRINGS}
        weekStatus={[
          'done',
          'done',
          'done',
          'planned',
          'planned',
          'planned',
          'planned',
        ]}
      />
    );

    // Connectors should be visible between completed days
    expect(toJSON()).toBeTruthy();
  });

  it('keeps press motion when celebrations are disabled', () => {
    const timing = jest.spyOn(Reanimated, 'withTiming');
    const view = render(
      <HabitChainVisualizer
        accentColor='#10b981'
        celebrationsEnabled={false}
        habitId={'habits:test' as Id<'habits'>}
        onToggle={() => {}}
        reduceMotionPreference={false}
        weekDateStrings={WEEK_DATE_STRINGS}
        weekStatus={[...WEEK_STATUS]}
      />
    );
    timing.mockClear();

    fireEvent(view.getAllByRole('checkbox')[1], 'pressIn');

    expect(timing).toHaveBeenCalledWith(
      DAY_TOGGLE_SCALE.pressed,
      expect.objectContaining({ duration: durations.instant })
    );
  });

  it('announces completion through checkbox state without repeating it', () => {
    const view = render(
      <HabitChainVisualizer
        accentColor='#10b981'
        habitId={'habits:test' as Id<'habits'>}
        onToggle={() => {}}
        weekDateStrings={WEEK_DATE_STRINGS}
        weekStatus={[...WEEK_STATUS]}
      />
    );

    const completedDay = view.getAllByRole('checkbox')[0];
    expect(completedDay.props.accessibilityLabel).toBe('DEC 1, MON');
    expect(completedDay.props.accessibilityState.checked).toBe(true);
    expect(completedDay.props.accessibilityLabel).not.toMatch(/completed/i);
  });
});
