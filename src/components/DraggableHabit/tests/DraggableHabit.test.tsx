import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Swipeable } from 'react-native-gesture-handler';
import DraggableHabit from '../DraggableHabit';
import type { Id } from '../../../../convex/_generated/dataModel';

const buildHabit = (overrides: Partial<Record<string, unknown>> = {}) =>
  ({
    _creationTime: Date.now(),
    _id: 'habit_1' as Id<'habits'>,
    createdAt: Date.now(),
    name: '✅ Daily Reflection',
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

describe('DraggableHabit color accent border', () => {
  it('renders with flex-row layout for color accent border', () => {
    const { toJSON } = render(
      <DraggableHabit
        celebrationsEnabled={false}
        habit={buildHabit()}
        isCompactMode={false}
        reduceMotionPreference={true}
        streak={0}
        toggleHabit={jest.fn()}
        weekDateStrings={weekDateStrings}
        weekStatus={weekStatus}
      />
    );

    const tree = toJSON();
    expect(tree).toBeTruthy();

    // Verify the card has flex-row layout for color accent border
    const treeString = JSON.stringify(tree);
    expect(treeString).toContain('flex-row');
    expect(treeString).toContain('overflow-hidden');
    expect(treeString).toContain('rounded-3xl');
  });

  it('renders 4px color accent left border', () => {
    const { toJSON } = render(
      <DraggableHabit
        celebrationsEnabled={false}
        habit={buildHabit({ iconColor: '#059669' })}
        reduceMotionPreference={true}
        streak={0}
        toggleHabit={jest.fn()}
        weekDateStrings={weekDateStrings}
        weekStatus={weekStatus}
      />
    );

    const tree = toJSON();
    expect(tree).toBeTruthy();

    // Verify the color accent border exists with 4px width
    const treeString = JSON.stringify(tree);
    expect(treeString).toContain('"width":4');
    expect(treeString).toContain('#059669'); // emerald color
  });

  it('computes accent color from habit name when no iconColor is set', () => {
    const { toJSON } = render(
      <DraggableHabit
        celebrationsEnabled={false}
        habit={buildHabit()}
        reduceMotionPreference={true}
        streak={0}
        toggleHabit={jest.fn()}
        weekDateStrings={weekDateStrings}
        weekStatus={weekStatus}
      />
    );

    const tree = toJSON();
    expect(tree).toBeTruthy();

    // Accent color is computed from habit name "✅ Daily Reflection" → #db2777 (pink)
    const treeString = JSON.stringify(tree);
    expect(treeString).toContain('#db2777');
  });
});

describe('DraggableHabit swipe to archive', () => {
  it('renders without Swipeable when onArchive is not provided', () => {
    const { toJSON } = render(
      <DraggableHabit
        celebrationsEnabled={false}
        habit={buildHabit()}
        reduceMotionPreference={true}
        streak={0}
        toggleHabit={jest.fn()}
        weekDateStrings={weekDateStrings}
        weekStatus={weekStatus}
      />
    );

    // Component should render successfully without Swipeable wrapper
    const tree = toJSON();
    expect(tree).toBeTruthy();

    // Check that the tree structure doesn't contain Swipeable
    const treeString = JSON.stringify(tree);
    expect(treeString).not.toContain('Swipeable');
  });

  it('renders with Swipeable when onArchive is provided', () => {
    const mockOnArchive = jest.fn();
    const { UNSAFE_getByType } = render(
      <DraggableHabit
        celebrationsEnabled={false}
        habit={buildHabit()}
        reduceMotionPreference={true}
        streak={0}
        toggleHabit={jest.fn()}
        weekDateStrings={weekDateStrings}
        weekStatus={weekStatus}
        onArchive={mockOnArchive}
      />
    );

    // Should find Swipeable component when onArchive is provided
    const swipeable = UNSAFE_getByType(Swipeable);
    expect(swipeable).toBeTruthy();
  });

  it('calls onArchive from the explicit archive action', () => {
    const mockOnArchive = jest.fn();
    const habit = buildHabit();

    const { UNSAFE_getByType } = render(
      <DraggableHabit
        celebrationsEnabled={false}
        habit={habit}
        reduceMotionPreference={true}
        streak={0}
        toggleHabit={jest.fn()}
        weekDateStrings={weekDateStrings}
        weekStatus={weekStatus}
        onArchive={mockOnArchive}
      />
    );

    const swipeable = UNSAFE_getByType(Swipeable);

    const mockDragX = { interpolate: jest.fn(() => 0) };
    const rightActions = swipeable.props.renderRightActions(
      { interpolate: jest.fn() },
      mockDragX
    );
    const { getByTestId } = render(rightActions);
    fireEvent.press(getByTestId('archive-habit-action'));

    // Verify onArchive was called with the habit ID
    expect(mockOnArchive).toHaveBeenCalledWith(habit._id);
    expect(mockOnArchive).toHaveBeenCalledTimes(1);
  });

  it('configures Swipeable with correct props', () => {
    const mockOnArchive = jest.fn();

    const { UNSAFE_getByType } = render(
      <DraggableHabit
        celebrationsEnabled={false}
        habit={buildHabit()}
        reduceMotionPreference={true}
        streak={0}
        toggleHabit={jest.fn()}
        weekDateStrings={weekDateStrings}
        weekStatus={weekStatus}
        onArchive={mockOnArchive}
      />
    );

    const swipeable = UNSAFE_getByType(Swipeable);

    // Verify Swipeable configuration
    expect(swipeable.props.overshootRight).toBe(false);
    expect(swipeable.props.friction).toBe(2);
    expect(swipeable.props.renderRightActions).toBeDefined();
  });

  it('provides renderRightActions function that returns valid element', () => {
    const mockOnArchive = jest.fn();

    const { UNSAFE_getByType } = render(
      <DraggableHabit
        celebrationsEnabled={false}
        habit={buildHabit()}
        reduceMotionPreference={true}
        streak={0}
        toggleHabit={jest.fn()}
        weekDateStrings={weekDateStrings}
        weekStatus={weekStatus}
        onArchive={mockOnArchive}
      />
    );

    const swipeable = UNSAFE_getByType(Swipeable);

    // Verify renderRightActions returns a valid React element
    const mockProgress = { interpolate: jest.fn() };
    const mockDragX = { interpolate: jest.fn(() => 0) };
    const rightActions = swipeable.props.renderRightActions(
      mockProgress,
      mockDragX
    );

    // Verify it returns a valid element with expected structure
    expect(rightActions).toBeTruthy();
    expect(rightActions.type).toBeDefined();
    render(rightActions);
    expect(mockDragX.interpolate).toHaveBeenCalled();
  });

  it('does not call onArchive when component renders without swipe', () => {
    const mockOnArchive = jest.fn();

    render(
      <DraggableHabit
        celebrationsEnabled={false}
        habit={buildHabit()}
        reduceMotionPreference={true}
        streak={0}
        toggleHabit={jest.fn()}
        weekDateStrings={weekDateStrings}
        weekStatus={weekStatus}
        onArchive={mockOnArchive}
      />
    );

    // onArchive should not be called on render
    expect(mockOnArchive).not.toHaveBeenCalled();
  });

  it('works correctly with habit strength indicator', () => {
    const mockOnArchive = jest.fn();
    const habitWithStrength = buildHabit({
      strength: 0.75,
      strengthLevel: 'strong',
    });

    const { toJSON } = render(
      <DraggableHabit
        celebrationsEnabled={false}
        habit={habitWithStrength}
        reduceMotionPreference={true}
        streak={5}
        toggleHabit={jest.fn()}
        weekDateStrings={weekDateStrings}
        weekStatus={weekStatus}
        onArchive={mockOnArchive}
      />
    );

    // Should render without errors even with strength indicator
    expect(toJSON()).toBeTruthy();
  });
});
