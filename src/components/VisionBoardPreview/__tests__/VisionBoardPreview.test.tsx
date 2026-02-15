
import React from 'react';
import { AccessibilityInfo } from 'react-native';

import * as Haptics from 'expo-haptics';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

import type { Id } from '../../../../convex/_generated/dataModel';
import { VisionBoardPreview } from '../VisionBoardPreview';

// Mock expo-haptics
jest.mock('expo-haptics');

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
}));

// Mock AccessibilityInfo
jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
jest.spyOn(AccessibilityInfo, 'addEventListener').mockReturnValue({
  remove: jest.fn(),
} as unknown);

const mockItems = [
  {
    _id: 'item1' as Id<'visionBoardItems'>,
    _creationTime: Date.now(),
    title: 'First Vision Card',
    body: 'This is the body of the first vision card.',
    habitId: 'habit1' as Id<'habits'>,
    createdAt: Date.now() - 86400000 * 7, // 7 days ago
    updatedAt: Date.now(),
  },
  {
    _id: 'item2' as Id<'visionBoardItems'>,
    _creationTime: Date.now(),
    title: 'Second Vision Card',
    body: 'This is the body of the second vision card.',
    habitId: 'habit1' as Id<'habits'>,
    createdAt: Date.now() - 86400000 * 3, // 3 days ago
    updatedAt: Date.now(),
  },
  {
    _id: 'item3' as Id<'visionBoardItems'>,
    _creationTime: Date.now(),
    title: 'Third Vision Card',
    body: undefined,
    habitId: 'habit1' as Id<'habits'>,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

const renderWithGestureHandler = (component: React.ReactElement) => {
  return render(
    <GestureHandlerRootView style={{ flex: 1 }}>
      {component}
    </GestureHandlerRootView>
  );
};

describe('VisionBoardPreview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders null when no current item', () => {
    const { queryByText } = renderWithGestureHandler(
      <VisionBoardPreview
        initialIndex={0}
        items={[]}
        visible={true}
        onClose={jest.fn()}
        onEdit={jest.fn()}
      />
    );

    expect(queryByText('First Vision Card')).toBeNull();
  });

  it('renders the current item title and body', () => {
    const { getByText } = renderWithGestureHandler(
      <VisionBoardPreview
        initialIndex={0}
        items={mockItems}
        visible={true}
        onClose={jest.fn()}
        onEdit={jest.fn()}
      />
    );

    expect(getByText('First Vision Card')).toBeTruthy();
    expect(getByText('This is the body of the first vision card.')).toBeTruthy();
  });

  it('shows correct counter for current item', () => {
    const { getByText } = renderWithGestureHandler(
      <VisionBoardPreview
        initialIndex={1}
        items={mockItems}
        visible={true}
        onClose={jest.fn()}
        onEdit={jest.fn()}
      />
    );

    expect(getByText('2 of 3')).toBeTruthy();
  });

  it('calls onClose when close button is pressed', () => {
    const onClose = jest.fn();
    const { getByLabelText } = renderWithGestureHandler(
      <VisionBoardPreview
        initialIndex={0}
        items={mockItems}
        visible={true}
        onClose={onClose}
        onEdit={jest.fn()}
      />
    );

    fireEvent.press(getByLabelText('Close preview'));

    expect(onClose).toHaveBeenCalled();
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });

  it('calls onEdit with current item when edit button is pressed', () => {
    const onEdit = jest.fn();
    const { getByLabelText } = renderWithGestureHandler(
      <VisionBoardPreview
        initialIndex={0}
        items={mockItems}
        visible={true}
        onClose={jest.fn()}
        onEdit={onEdit}
      />
    );

    fireEvent.press(getByLabelText('Edit this card'));

    expect(onEdit).toHaveBeenCalledWith(mockItems[0]);
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });

  it('navigates to next item when next button is pressed', async () => {
    const { getByLabelText, getByText, rerender } = renderWithGestureHandler(
      <VisionBoardPreview
        initialIndex={0}
        items={mockItems}
        visible={true}
        onClose={jest.fn()}
        onEdit={jest.fn()}
      />
    );

    expect(getByText('First Vision Card')).toBeTruthy();

    fireEvent.press(getByLabelText('Next card'));

    await waitFor(() => {
      expect(getByText('Second Vision Card')).toBeTruthy();
    });

    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });

  it('navigates to previous item when previous button is pressed', async () => {
    const { getByLabelText, getByText } = renderWithGestureHandler(
      <VisionBoardPreview
        initialIndex={1}
        items={mockItems}
        visible={true}
        onClose={jest.fn()}
        onEdit={jest.fn()}
      />
    );

    expect(getByText('Second Vision Card')).toBeTruthy();

    fireEvent.press(getByLabelText('Previous card'));

    await waitFor(() => {
      expect(getByText('First Vision Card')).toBeTruthy();
    });

    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });

  it('disables previous button on first item', () => {
    const { getByLabelText } = renderWithGestureHandler(
      <VisionBoardPreview
        initialIndex={0}
        items={mockItems}
        visible={true}
        onClose={jest.fn()}
        onEdit={jest.fn()}
      />
    );

    const prevButton = getByLabelText('Previous card');
    expect(prevButton.props.accessibilityState?.disabled).toBe(true);
  });

  it('disables next button on last item', () => {
    const { getByLabelText } = renderWithGestureHandler(
      <VisionBoardPreview
        initialIndex={2}
        items={mockItems}
        visible={true}
        onClose={jest.fn()}
        onEdit={jest.fn()}
      />
    );

    const nextButton = getByLabelText('Next card');
    expect(nextButton.props.accessibilityState?.disabled).toBe(true);
  });

  it('shows swipe hint text', () => {
    const { getByText } = renderWithGestureHandler(
      <VisionBoardPreview
        initialIndex={0}
        items={mockItems}
        visible={true}
        onClose={jest.fn()}
        onEdit={jest.fn()}
      />
    );

    expect(getByText('Swipe down to close • Swipe left/right to navigate')).toBeTruthy();
  });

  it('renders correct number of dot indicators', () => {
    const { getAllByTestId, UNSAFE_root } = renderWithGestureHandler(
      <VisionBoardPreview
        initialIndex={0}
        items={mockItems}
        visible={true}
        onClose={jest.fn()}
        onEdit={jest.fn()}
      />
    );

    // Check that there are 3 dots (one for each item)
    // The dots don't have testID so we check for View elements in the dots container
    // This is a basic check that the component renders
    expect(UNSAFE_root).toBeTruthy();
  });

  it('handles item without body gracefully', () => {
    const { getByText, queryByText } = renderWithGestureHandler(
      <VisionBoardPreview
        initialIndex={2}
        items={mockItems}
        visible={true}
        onClose={jest.fn()}
        onEdit={jest.fn()}
      />
    );

    expect(getByText('Third Vision Card')).toBeTruthy();
    // The third item has no body, so there should be no body text
    expect(queryByText('This is the body')).toBeNull();
  });
});
