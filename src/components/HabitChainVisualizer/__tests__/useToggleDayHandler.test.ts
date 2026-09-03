import { act, renderHook } from '@testing-library/react-native';

import type { Id } from '../../../../convex/_generated/dataModel';
import { useToggleDayHandler } from '../useToggleDayHandler';

const HABIT_ID = 'habit_check_in' as Id<'habits'>;
const DATE = '2026-09-02';

function makeOptions(weekStatus: ('done' | 'missed' | 'planned')[]) {
  return {
    celebrationsEnabled: true,
    habitId: HABIT_ID,
    onToggle: jest.fn(),
    onWeekComplete: jest.fn(),
    setActiveBurst: jest.fn(),
    triggerLightImpact: jest.fn(),
    triggerSelection: jest.fn(),
    triggerSuccess: jest.fn(),
    weekStatus,
  };
}

describe('useToggleDayHandler', () => {
  it('keeps an ordinary check-in lightweight', () => {
    const options = makeOptions([
      'done',
      'planned',
      'planned',
      'planned',
      'planned',
      'planned',
      'planned',
    ]);
    const view = renderHook(() => useToggleDayHandler(options));

    act(() => view.result.current(DATE, false, false, 1));

    expect(options.triggerLightImpact).toHaveBeenCalledTimes(1);
    expect(options.triggerSelection).not.toHaveBeenCalled();
    expect(options.triggerSuccess).not.toHaveBeenCalled();
    expect(options.setActiveBurst).not.toHaveBeenCalled();
    expect(options.onToggle).toHaveBeenCalledWith({
      date: DATE,
      habitId: HABIT_ID,
    });
  });

  it('reserves the success haptic and particle burst for a perfect week', () => {
    const options = makeOptions([
      'done',
      'done',
      'done',
      'planned',
      'done',
      'done',
      'done',
    ]);
    const view = renderHook(() => useToggleDayHandler(options));

    act(() => view.result.current(DATE, false, false, 3));

    expect(options.triggerSuccess).toHaveBeenCalledTimes(1);
    expect(options.triggerLightImpact).not.toHaveBeenCalled();
    expect(options.triggerSelection).not.toHaveBeenCalled();
    expect(options.setActiveBurst).toHaveBeenCalledWith(DATE);
    expect(options.onWeekComplete).toHaveBeenCalledWith({
      completedDate: DATE,
    });
  });

  it('uses selection feedback when unchecking', () => {
    const options = makeOptions([
      'done',
      'done',
      'done',
      'done',
      'done',
      'done',
      'done',
    ]);
    const view = renderHook(() => useToggleDayHandler(options));

    act(() => view.result.current(DATE, true, false, 3));

    expect(options.triggerSelection).toHaveBeenCalledTimes(1);
    expect(options.triggerLightImpact).not.toHaveBeenCalled();
    expect(options.triggerSuccess).not.toHaveBeenCalled();
    expect(options.setActiveBurst).not.toHaveBeenCalled();
    expect(options.onWeekComplete).not.toHaveBeenCalled();
  });

  it('reports a perfect week without celebration effects when disabled', () => {
    const options = makeOptions([
      'done',
      'done',
      'done',
      'planned',
      'done',
      'done',
      'done',
    ]);
    options.celebrationsEnabled = false;
    const view = renderHook(() => useToggleDayHandler(options));

    act(() => view.result.current(DATE, false, false, 3));

    expect(options.triggerLightImpact).toHaveBeenCalledTimes(1);
    expect(options.triggerSuccess).not.toHaveBeenCalled();
    expect(options.setActiveBurst).not.toHaveBeenCalled();
    expect(options.onWeekComplete).toHaveBeenCalledWith({
      completedDate: DATE,
    });
  });

  it('does not toggle a disabled day', () => {
    const options = makeOptions([
      'done',
      'planned',
      'planned',
      'planned',
      'planned',
      'planned',
      'planned',
    ]);
    const view = renderHook(() => useToggleDayHandler(options));

    act(() => view.result.current(DATE, false, true, 1));

    expect(options.triggerSelection).toHaveBeenCalledTimes(1);
    expect(options.triggerLightImpact).not.toHaveBeenCalled();
    expect(options.onToggle).not.toHaveBeenCalled();
    expect(options.onWeekComplete).not.toHaveBeenCalled();
  });
});
