import React from 'react';
import { render } from '@testing-library/react-native';
import {
  buildProps,
  HabitsListContent,
  lastListProps,
  resetCapturedListProps,
} from './HabitsListContent.testHarness';

describe('HabitsListContent virtualization', () => {
  beforeEach(resetCapturedListProps);

  it('preserves the established settings during normal scrolling', () => {
    render(<HabitsListContent {...buildProps()} />);

    expect(lastListProps()).toMatchObject({
      initialNumToRender: 6,
      maxToRenderPerBatch: 6,
      removeClippedSubviews: true,
      updateCellsBatchingPeriod: 32,
      windowSize: 5,
    });
  });

  it('uses the small focus window without retuning normal behavior', () => {
    render(
      <HabitsListContent
        {...buildProps({ pendingFocusHabitId: 'habit_far' })}
      />
    );

    expect(lastListProps()).toMatchObject({
      initialNumToRender: 4,
      initialScrollIndex: 0,
      maxToRenderPerBatch: 16,
      removeClippedSubviews: true,
      updateCellsBatchingPeriod: 8,
      windowSize: 3,
    });
    expect(lastListProps().getItemLayout).toEqual(expect.any(Function));
    expect(lastListProps()).not.toHaveProperty(
      'maintainVisibleContentPosition'
    );
  });

  it('restores normal batching while retaining far-row geometry', () => {
    const { rerender } = render(
      <HabitsListContent
        {...buildProps({ pendingFocusHabitId: 'habit_far' })}
      />
    );

    rerender(<HabitsListContent {...buildProps()} />);

    expect(lastListProps()).toMatchObject({
      initialNumToRender: 6,
      maxToRenderPerBatch: 6,
      updateCellsBatchingPeriod: 32,
      windowSize: 5,
    });
    expect(lastListProps().getItemLayout).toEqual(expect.any(Function));
  });
});
