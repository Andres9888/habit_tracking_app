import React from 'react';
import { render } from '@testing-library/react-native';
import type { Id } from '../../../../convex/_generated/dataModel';
import { HabitChainVisualizer } from '../HabitChainVisualizer';

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

    expect(getAllByRole('button')).toHaveLength(WEEK_DATE_STRINGS.length);
    expect(getAllByRole('button')[0].props.style.borderRadius).toBe(10);
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

    expect(getAllByRole('button')).toHaveLength(WEEK_DATE_STRINGS.length);
    expect(getAllByRole('button')[0].props.style.borderRadius).toBe(22);
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

    const tree = JSON.stringify(toJSON());
    expect(tree).toContain('"height":3');
    expect(tree).toContain('"minWidth":14');
  });
});
