import React from 'react';
import { render } from '@testing-library/react-native';
import DraggableHabit from '../DraggableHabit/DraggableHabit';
import type { Id } from '../../../convex/_generated/dataModel';

const buildHabit = (overrides: Partial<Record<string, unknown>> = {}) =>
  ({
    _id: 'habit_1' as Id<'habits'>,
    name: '✅ Daily Reflection',
    createdAt: Date.now(),
    _creationTime: Date.now(),
    ...overrides,
  }) as const;

const weekDateStrings = [
  '2025-01-01',
  '2025-01-02',
  '2025-01-03',
  '2025-01-04',
  '2025-01-05',
];
const weekStatus: Array<'done' | 'missed' | 'planned'> = [
  'done',
  'planned',
  'missed',
  'done',
  'planned',
];

describe('DraggableHabit card structure', () => {
  it('renders with flex-row layout for color accent border', () => {
    const { toJSON } = render(
      <DraggableHabit
        celebrationsEnabled={false}
        habit={buildHabit()}
        reduceMotionPreference={true}
        weekDateStrings={weekDateStrings}
        weekStatus={weekStatus}
        streak={0}
        toggleHabit={jest.fn()}
      />
    );

    const tree = toJSON();
    expect(tree).toBeTruthy();

    // Serialize tree to check for flex-row layout and rounded corners
    const treeString = JSON.stringify(tree);
    expect(treeString).toContain('flex-row');
    expect(treeString).toContain('rounded-3xl');
  });

  it('renders color accent border with 4px width', () => {
    const { toJSON } = render(
      <DraggableHabit
        celebrationsEnabled={false}
        habit={buildHabit({ iconColor: '#7c3aed' })}
        reduceMotionPreference={true}
        weekDateStrings={weekDateStrings}
        weekStatus={weekStatus}
        streak={0}
        toggleHabit={jest.fn()}
      />
    );

    const tree = toJSON();
    expect(tree).toBeTruthy();

    // Check that tree contains a View with width: 4 (the color accent border)
    const treeString = JSON.stringify(tree);
    expect(treeString).toContain('"width":4');
  });

  it('computes accent color from habit name when no iconColor is set', () => {
    const { toJSON } = render(
      <DraggableHabit
        celebrationsEnabled={false}
        habit={buildHabit()}
        reduceMotionPreference={true}
        weekDateStrings={weekDateStrings}
        weekStatus={weekStatus}
        streak={0}
        toggleHabit={jest.fn()}
      />
    );

    const tree = toJSON();
    expect(tree).toBeTruthy();

    // Accent color is computed from habit name "✅ Daily Reflection" → #db2777 (pink)
    const treeString = JSON.stringify(tree);
    expect(treeString).toContain('#db2777');
  });
});
