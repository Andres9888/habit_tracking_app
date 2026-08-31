import React from 'react';
import { render } from '@testing-library/react-native';
import {
  buildProps,
  HabitsListContent,
  lastExtraData,
  resetCapturedListProps,
} from './HabitsListContent.testHarness';

describe('HabitsListContent extraData identity', () => {
  beforeEach(resetCapturedListProps);

  it('changes when focus readiness flips so mounted shells re-render', () => {
    const { rerender } = render(
      <HabitsListContent {...buildProps({ deferHeavyFocusContent: true })} />
    );
    const whileDeferred = lastExtraData();

    rerender(
      <HabitsListContent {...buildProps({ deferHeavyFocusContent: false })} />
    );

    expect(lastExtraData()).not.toBe(whileDeferred);
    expect(lastExtraData()).not.toEqual(whileDeferred);
  });

  it('stays referentially stable across unrelated re-renders', () => {
    const { rerender } = render(
      <HabitsListContent {...buildProps({ deferHeavyFocusContent: true })} />
    );
    const first = lastExtraData();

    rerender(
      <HabitsListContent {...buildProps({ deferHeavyFocusContent: true })} />
    );

    expect(lastExtraData()).toBe(first);
  });

  it('changes when the just-created highlight target changes', () => {
    const { rerender } = render(
      <HabitsListContent {...buildProps({ justCreatedHabitId: 'habit_a' })} />
    );
    const first = lastExtraData();

    rerender(
      <HabitsListContent {...buildProps({ justCreatedHabitId: 'habit_b' })} />
    );

    expect(lastExtraData()).not.toBe(first);
    expect(lastExtraData()).not.toEqual(first);
  });
});
