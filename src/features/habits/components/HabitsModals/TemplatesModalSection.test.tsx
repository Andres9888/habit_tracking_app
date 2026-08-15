import { act, renderHook } from '@testing-library/react-native';

import type { Id } from '../../../../../convex/_generated/dataModel';
import { requestHabitFocus } from '../../hooks/habitFocusStore';
import { useGoToHabitCard } from './TemplatesModalSection';

jest.mock('../../hooks/habitFocusStore', () => ({
  requestHabitFocus: jest.fn(),
}));

describe('TemplatesModalSection habit-card handoff', () => {
  it('requests the matching card and closes the library', () => {
    const habitId = 'habit-1' as Id<'habits'>;
    const closeTemplatesScreen = jest.fn();
    const { result } = renderHook(() => useGoToHabitCard(closeTemplatesScreen));

    act(() => result.current(habitId));
    expect(requestHabitFocus).toHaveBeenCalledWith(habitId);
    expect(closeTemplatesScreen).toHaveBeenCalledTimes(1);
  });
});
