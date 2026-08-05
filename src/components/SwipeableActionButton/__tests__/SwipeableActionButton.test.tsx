import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SwipeableActionButton } from '../SwipeableActionButton';
import { Trash2, Archive } from 'lucide-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Mock clsx to handle NativeWind className transformations
jest.mock('clsx', () => ({
  clsx: (...args: unknown[]) => args.filter(Boolean).flat().join(' '),
  __esModule: true,
  default: (...args: unknown[]) => args.filter(Boolean).flat().join(' '),
}));

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium' },
  NotificationFeedbackType: { Warning: 'warning', Success: 'success' },
}));

// Wrapper to provide gesture handler context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    {children}
  </GestureHandlerRootView>
);

describe('SwipeableActionButton', () => {
  const defaultProps = {
    icon: Trash2,
    label: 'Delete Item',
    subtitle: 'Remove permanently',
    onPress: jest.fn(),
    onSwipeAction: jest.fn(),
    swipeEnabled: true,
    swipeIcon: Trash2,
    swipeLabel: 'Delete',
    swipeVariant: 'destructive' as const,
    variant: 'destructive' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all props', () => {
    const { getByText } = render(
      <TestWrapper>
        <SwipeableActionButton {...defaultProps} />
      </TestWrapper>
    );

    expect(getByText('Delete Item')).toBeTruthy();
    expect(getByText('Remove permanently')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(
      <TestWrapper>
        <SwipeableActionButton {...defaultProps} onPress={onPress} />
      </TestWrapper>
    );

    const button = getByLabelText(/Delete Item/);
    fireEvent.press(button);

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders without swipe when swipeEnabled is false', () => {
    const { getByText } = render(
      <TestWrapper>
        <SwipeableActionButton {...defaultProps} swipeEnabled={false} />
      </TestWrapper>
    );

    expect(getByText('Delete Item')).toBeTruthy();
  });

  it('renders without swipe when onSwipeAction is undefined', () => {
    const { getByText } = render(
      <TestWrapper>
        <SwipeableActionButton {...defaultProps} onSwipeAction={undefined} />
      </TestWrapper>
    );

    expect(getByText('Delete Item')).toBeTruthy();
  });

  it('renders with default variant styling', () => {
    const { getByText } = render(
      <TestWrapper>
        <SwipeableActionButton
          {...defaultProps}
          variant="default"
        />
      </TestWrapper>
    );

    expect(getByText('Delete Item')).toBeTruthy();
  });

  it('renders with boost variant styling', () => {
    const { getByText } = render(
      <TestWrapper>
        <SwipeableActionButton
          {...defaultProps}
          variant="boost"
        />
      </TestWrapper>
    );

    expect(getByText('Delete Item')).toBeTruthy();
  });

  it('renders with chevron when showChevron is true', () => {
    const { getByText } = render(
      <TestWrapper>
        <SwipeableActionButton {...defaultProps} showChevron />
      </TestWrapper>
    );

    expect(getByText('Delete Item')).toBeTruthy();
  });

  it('renders archive variant with warning swipe color', () => {
    const { getByText } = render(
      <TestWrapper>
        <SwipeableActionButton
          icon={Archive}
          label="Archive"
          subtitle="Hide from active habits"
          onPress={jest.fn()}
          onSwipeAction={jest.fn()}
          swipeEnabled
          swipeIcon={Archive}
          swipeLabel="Archive"
          swipeVariant="warning"
          variant="default"
        />
      </TestWrapper>
    );

    expect(getByText('Archive')).toBeTruthy();
    expect(getByText('Hide from active habits')).toBeTruthy();
  });

  it('has correct accessibility label with context', () => {
    const { getByLabelText } = render(
      <TestWrapper>
        <SwipeableActionButton {...defaultProps} />
      </TestWrapper>
    );

    // Should include label, subtitle, destructive warning, and swipe hint
    expect(
      getByLabelText(/Delete Item.*Remove permanently.*destructive.*Swipe left/)
    ).toBeTruthy();
  });

  it('accessibility label excludes swipe hint when disabled', () => {
    const { getByLabelText } = render(
      <TestWrapper>
        <SwipeableActionButton {...defaultProps} swipeEnabled={false} />
      </TestWrapper>
    );

    // Should not include swipe hint
    const button = getByLabelText(/Delete Item/);
    expect(button.props.accessibilityLabel).not.toContain('Swipe left');
  });
});
