/**
 * The ladder always renders. Sending people to a picker first meant almost
 * nobody had a goal, so the whole motivational device never appeared — but a
 * suggested target that silently wrote itself to the database would be worse,
 * so the "nothing is persisted until Change" half is asserted here too.
 */
import { render } from '@testing-library/react-native';
import type { Habit } from '../../../../../features/habits/types';
import { DetailGoalCard } from '../DetailGoalCard';

const mockMutate = jest.fn();

jest.mock('convex/react', () => ({
  ConvexProvider: ({ children }: { children: React.ReactNode }) => children,
  useMutation: () => mockMutate,
  useQuery: () => [],
}));

function renderCard(overrides: Partial<Habit>) {
  return render(
    <DetailGoalCard
      currentStreak={0}
      habit={
        {
          _id: 'habit_1',
          bestStreak: 2,
          name: 'Wake-Up Movement',
          ...overrides,
        } as unknown as Habit
      }
      loggedToday={false}
    />
  );
}

beforeEach(() => {
  mockMutate.mockClear();
});

describe('DetailGoalCard', () => {
  it('runs the ladder on a suggested target when no goal is stored', () => {
    // suggestedGoal(2) is the shortest preset that would beat the record.
    const { getByText } = renderCard({ goalDuration: undefined });

    expect(getByText('Streak goal · suggested')).toBeTruthy();
    expect(getByText('7 days — day 1 starts today.')).toBeTruthy();
  });

  it('writes nothing to the habit while the goal is only suggested', () => {
    renderCard({ goalDuration: undefined });

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('drops the "suggested" qualifier once a real goal is stored', () => {
    const { getByText, queryByText } = renderCard({ goalDuration: 21 });

    expect(getByText('Streak goal')).toBeTruthy();
    expect(queryByText('Streak goal · suggested')).toBeNull();
    expect(getByText('21 days — day 1 starts today.')).toBeTruthy();
  });
});
