import { render } from '@testing-library/react-native';
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
  it('omits the row and keeps three options when onWhyChange is absent', () => {
    const { getByLabelText, queryByLabelText, queryByText } = render(
      <AdvancedOptionsSection {...baseProps} />
    );

    // The panel body stays mounted while collapsed, so look inside it.
    expect(queryByText('Your why', { includeHiddenElements: true })).toBeNull();
    expect(
      queryByLabelText('Your why', { includeHiddenElements: true })
    ).toBeNull();
    expect(queryByText('Add a why')).toBeNull();
    expect(queryByText('Why set')).toBeNull();
    expect(getByLabelText('More to customize, 3 options')).toBeTruthy();
  });

  it('renders the row and an Add a why chip when the why is blank', () => {
    const { getByLabelText, getByText, queryByText } = render(
      <AdvancedOptionsSection
        {...baseProps}
        why=''
        onWhyChange={jest.fn()}
      />
    );

    expect(getByText('Your why', { includeHiddenElements: true })).toBeTruthy();
    expect(getByText('Add a why')).toBeTruthy();
    expect(queryByText('Why set')).toBeNull();
    expect(getByLabelText('More to customize, 4 options')).toBeTruthy();
  });

  it('flips the chip to Why set once a why is written', () => {
    const { getByText, queryByText } = render(
      <AdvancedOptionsSection
        {...baseProps}
        why='x'
        onWhyChange={jest.fn()}
      />
    );

    expect(getByText('Why set')).toBeTruthy();
    expect(queryByText('Add a why')).toBeNull();
  });
});
