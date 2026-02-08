/**
 * HabitSelector - Stable callback reference tests
 *
 * Verifies that:
 * - Inline arrow function in .map() is replaced with sub-component pattern
 * - HabitSelectorItem component handles press internally via useCallback
 * - Parent passes stable onSelect reference without wrapping in closure
 */

import * as fs from 'fs';
import * as path from 'path';

const COMPONENT_PATH = path.resolve(__dirname, '../HabitSelector.tsx');

let source: string;

beforeAll(() => {
  source = fs.readFileSync(COMPONENT_PATH, 'utf-8');
});

describe('HabitSelector - stable callback references', () => {
  it('should import useCallback from react', () => {
    expect(source).toMatch(/import.*useCallback.*from 'react'/);
  });

  it('should define HabitSelectorItem sub-component', () => {
    expect(source).toContain('function HabitSelectorItem(');
  });

  it('should use useCallback for handlePress inside HabitSelectorItem', () => {
    expect(source).toMatch(
      /const handlePress = useCallback\(\(\) => onSelect\(habit\._id\)/
    );
  });

  it('should NOT have inline onPress closure in .map()', () => {
    // The old pattern: onPress={() => onSelect(habit._id)} inside map
    // Should now be onPress={handlePress} inside HabitSelectorItem
    const mapBlock = source.slice(
      source.indexOf('habits.map'),
      source.indexOf('</ScrollView>')
    );
    expect(mapBlock).not.toMatch(/onPress=\{.*=>/);
  });

  it('should render HabitSelectorItem in map with onSelect prop', () => {
    expect(source).toContain('onSelect={onSelect}');
  });

  it('should pass habit as prop to HabitSelectorItem', () => {
    expect(source).toMatch(/habit=\{habit\}/);
  });
});
