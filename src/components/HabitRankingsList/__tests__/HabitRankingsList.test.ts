/**
 * HabitRankingsList + HabitRankingItem - Stable callback reference tests
 *
 * Verifies that:
 * - Inline arrow function in renderItem is removed
 * - HabitRankingItem accepts onPress(habitId: string) instead of onPress() => void
 * - HabitRankingItem uses useCallback for internal handlePress
 * - HabitRankingsList passes handleHabitPress directly (no inline wrapper)
 */

import * as fs from 'fs';
import * as path from 'path';

const LIST_PATH = path.resolve(__dirname, '../HabitRankingsList.tsx');
const ITEM_PATH = path.resolve(__dirname, '../HabitRankingItem.tsx');

let listSource: string;
let itemSource: string;

beforeAll(() => {
  listSource = fs.readFileSync(LIST_PATH, 'utf-8');
  itemSource = fs.readFileSync(ITEM_PATH, 'utf-8');
});

describe('HabitRankingsList - stable callback in renderItem', () => {
  it('should NOT use inline arrow for onPress in renderItem', () => {
    expect(listSource).not.toMatch(/onPress=\{.*=>/);
  });

  it('should pass handleHabitPress directly as onPress', () => {
    expect(listSource).toContain('onPress={handleHabitPress}');
  });
});

describe('HabitRankingItem - parameterized onPress', () => {
  it('should import useCallback from react', () => {
    expect(itemSource).toMatch(/import.*useCallback.*from 'react'/);
  });

  it('should type onPress to accept habitId string parameter', () => {
    expect(itemSource).toMatch(/onPress:\s*\(habitId:\s*string\)\s*=>\s*void/);
  });

  it('should define handlePress with useCallback', () => {
    expect(itemSource).toMatch(
      /const handlePress = useCallback\(\(\) => onPress\(item\.id\)/
    );
  });

  it('should use handlePress in TouchableOpacity onPress', () => {
    expect(itemSource).toContain('onPress={handlePress}');
  });
});
