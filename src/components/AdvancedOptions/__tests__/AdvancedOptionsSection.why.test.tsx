import { fireEvent, render } from '@testing-library/react-native';
import { AdvancedOptionsSection } from '../AdvancedOptionsSection';

jest.mock('convex/react', () => ({
  useMutation: () => jest.fn(),
  useQuery: () => undefined,
}));

const baseProps = {
  isNewHabit: true,
  progressEmojis: undefined,
  streakGoal: 0,
  strengthAlgorithm: 'balanced' as const,
  onProgressEmojisChange: jest.fn(),
  onStreakGoalChange: jest.fn(),
  onStrengthAlgorithmChange: jest.fn(),
};

describe('AdvancedOptionsSection why row', () => {
  it('omits the row when onWhyChange is absent', () => {
    const { queryByLabelText, queryByText } = render(
      <AdvancedOptionsSection {...baseProps} />
    );

    expect(queryByText('Your why', { includeHiddenElements: true })).toBeNull();
    expect(queryByLabelText(/^Your why/)).toBeNull();
    expect(queryByText('Add')).toBeNull();
  });

  it('renders the row with an Add chip while the why is blank', () => {
    const { getByRole, getByText, queryByText } = render(
      <AdvancedOptionsSection {...baseProps} why='' onWhyChange={jest.fn()} />
    );

    expect(getByRole('button', { name: /^Your why/ })).toBeTruthy();
    expect(getByText('Add')).toBeTruthy();
    expect(queryByText('Set', { exact: true })).toBeTruthy();
  });

  it('flips the chip to Set once a why is written', () => {
    const { getAllByText, queryByText } = render(
      <AdvancedOptionsSection
        {...baseProps}
        why='To wake up clear-headed'
        onWhyChange={jest.fn()}
      />
    );

    expect(queryByText('Add')).toBeNull();
    expect(getAllByText('Set').length).toBeGreaterThan(0);
  });

  it('opens one row at a time', () => {
    const { getByRole } = render(
      <AdvancedOptionsSection {...baseProps} why='' onWhyChange={jest.fn()} />
    );
    const whyRow = () => getByRole('button', { name: /^Your why/ });
    const streakRow = () => getByRole('button', { name: 'Streak goal' });

    fireEvent.press(whyRow());
    expect(whyRow().props.accessibilityState.expanded).toBe(true);

    fireEvent.press(streakRow());
    expect(whyRow().props.accessibilityState.expanded).toBe(false);
    expect(streakRow().props.accessibilityState.expanded).toBe(true);
  });
});
