import { fireEvent, render } from '@testing-library/react-native';
import { StreakGoalRow } from '../StreakGoalRow';
import { CUSTOM_STREAK_DEFAULT } from '../streakGoal.constants';

const baseProps = {
  divided: false,
  open: true,
  onToggle: jest.fn(),
};

describe('StreakGoalRow', () => {
  it('shows the unset chip until a goal is picked', () => {
    const { getByText } = render(
      <StreakGoalRow
        {...baseProps}
        streakGoal={0}
        onStreakGoalChange={jest.fn()}
      />
    );

    expect(getByText('Set')).toBeTruthy();
  });

  it('commits a preset on press', () => {
    const onStreakGoalChange = jest.fn();
    const { getByLabelText } = render(
      <StreakGoalRow
        {...baseProps}
        streakGoal={0}
        onStreakGoalChange={onStreakGoalChange}
      />
    );

    fireEvent.press(getByLabelText('7 day streak goal'));
    expect(onStreakGoalChange).toHaveBeenCalledWith(7);
  });

  it('seeds the custom default and commits every stepper step live', () => {
    const onStreakGoalChange = jest.fn();
    const { getByLabelText, rerender } = render(
      <StreakGoalRow
        {...baseProps}
        streakGoal={0}
        onStreakGoalChange={onStreakGoalChange}
      />
    );

    fireEvent.press(getByLabelText('Custom streak goal'));
    expect(onStreakGoalChange).toHaveBeenCalledWith(CUSTOM_STREAK_DEFAULT);

    rerender(
      <StreakGoalRow
        {...baseProps}
        streakGoal={CUSTOM_STREAK_DEFAULT}
        onStreakGoalChange={onStreakGoalChange}
      />
    );

    fireEvent.press(getByLabelText('Increase days'));
    expect(onStreakGoalChange).toHaveBeenLastCalledWith(
      CUSTOM_STREAK_DEFAULT + 1
    );

    fireEvent.press(getByLabelText('Decrease days'));
    expect(onStreakGoalChange).toHaveBeenLastCalledWith(
      CUSTOM_STREAK_DEFAULT - 1
    );
  });

  it('shows the day count in the head once a goal exists', () => {
    const { getByText } = render(
      <StreakGoalRow
        {...baseProps}
        streakGoal={30}
        onStreakGoalChange={jest.fn()}
      />
    );

    expect(getByText('30 days')).toBeTruthy();
  });
});
