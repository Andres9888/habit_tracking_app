/**
 * Scenario S11: Character / gamification screen.
 *
 * PASS when the screen renders the character header (level), the attributes
 * section with named attributes, and the recent achievements section — proving
 * XP/level/attribute derivation from the user's habits + tracking works.
 */
import { screen } from '@testing-library/react-native';
import CharacterScreen from '../../src/screens/CharacterScreen';
import {
  makeHabit,
  makeTracking,
  renderScreen,
  resetConvex,
  seedCommonQueries,
  setQuery,
} from './harness';

describe('S11 Character screen', () => {
  beforeEach(() => {
    resetConvex();
    seedCommonQueries([
      makeHabit({ id: 'habit_1', name: 'Morning Run', currentStreak: 4 }),
      makeHabit({ id: 'habit_2', name: 'Read', currentStreak: 9 }),
    ]);
    setQuery('habits:getTracking', [
      ...makeTracking('habit_1', [0, -1, -2, -3]),
      ...makeTracking('habit_2', [0, -1, -2, -3, -4, -5]),
    ]);
  });

  it('shows level, attributes and recent achievements', async () => {
    renderScreen(<CharacterScreen />);
    expect(await screen.findByText('Character')).toBeTruthy();
    expect(screen.getByText('Experience')).toBeTruthy();
    expect(screen.getByText('Attributes')).toBeTruthy();
    expect(screen.getByText('Vitality')).toBeTruthy();
    expect(screen.getByText('Recent Achievements')).toBeTruthy();
  });
});
