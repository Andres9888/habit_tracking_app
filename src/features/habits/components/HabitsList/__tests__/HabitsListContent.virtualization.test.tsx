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
      maxToRenderPerBatch: 8,
      updateCellsBatchingPeriod: 16,
      windowSize: 11,
    });
    // DraggableFlatList forces removeClippedSubviews={false} after spreading
    // props, so passing it here would be a lie.
    expect(lastListProps()).not.toHaveProperty('removeClippedSubviews');
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
      maxToRenderPerBatch: 8,
      updateCellsBatchingPeriod: 16,
      windowSize: 11,
    });
    expect(lastListProps().getItemLayout).toEqual(expect.any(Function));
  });
});
