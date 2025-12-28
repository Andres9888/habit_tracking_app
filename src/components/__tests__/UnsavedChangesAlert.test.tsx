/**
 * UnsavedChangesAlert Tests
 * Edge Case Handling: Confirm before discarding unsaved changes
 *
 * Tests:
 * - Modal visibility
 * - Button interactions (discard, keep editing)
 * - Content preview
 * - Variant styling
 * - Accessibility
 * - Haptic feedback
 * - useUnsavedChangesAlert hook
 */

import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { renderHook } from '@testing-library/react-native';
import {
  UnsavedChangesAlert,
  useUnsavedChangesAlert,
} from '../UnsavedChangesAlert';

// Mock dependencies
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
  },
}));

// Mock Modal component
jest.mock('../Modal', () => ({
  Modal: ({
    children,
    visible,
    onClose,
  }: {
    children: React.ReactNode;
    visible: boolean;
    onClose: () => void;
  }) =>
    visible ? (
      <div data-testid='modal'>
        {children}
        <button onClick={onClose}>backdrop</button>
      </div>
    ) : null,
}));

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => ({
  AlertTriangle: () => 'AlertTriangleIcon',
  X: () => 'XIcon',
}));

describe('UnsavedChangesAlert', () => {
  const defaultProps = {
    visible: true,
    onDiscard: jest.fn(),
    onKeepEditing: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('visibility', () => {
    it('renders when visible is true', () => {
      const { getByText } = render(<UnsavedChangesAlert {...defaultProps} />);

      expect(getByText('Discard Changes?')).toBeTruthy();
    });

    it('does not render when visible is false', () => {
      const { queryByText } = render(
        <UnsavedChangesAlert {...defaultProps} visible={false} />
      );

      expect(queryByText('Discard Changes?')).toBeNull();
    });
  });

  describe('content', () => {
    it('displays default title and message', () => {
      const { getByText } = render(<UnsavedChangesAlert {...defaultProps} />);

      expect(getByText('Discard Changes?')).toBeTruthy();
      expect(
        getByText('You have unsaved changes that will be lost.')
      ).toBeTruthy();
    });

    it('displays custom title and message', () => {
      const { getByText } = render(
        <UnsavedChangesAlert
          {...defaultProps}
          title='Lose Your Work?'
          message='Your edits will be gone forever.'
        />
      );

      expect(getByText('Lose Your Work?')).toBeTruthy();
      expect(getByText('Your edits will be gone forever.')).toBeTruthy();
    });

    it('displays default button labels', () => {
      const { getByText } = render(<UnsavedChangesAlert {...defaultProps} />);

      expect(getByText('Discard')).toBeTruthy();
      expect(getByText('Keep Editing')).toBeTruthy();
    });

    it('displays custom button labels', () => {
      const { getByText } = render(
        <UnsavedChangesAlert
          {...defaultProps}
          discardButtonLabel='Throw Away'
          keepEditingButtonLabel='Continue Writing'
        />
      );

      expect(getByText('Throw Away')).toBeTruthy();
      expect(getByText('Continue Writing')).toBeTruthy();
    });
  });

  describe('content preview', () => {
    it('does not show preview when contentPreview is not provided', () => {
      const { queryByText } = render(<UnsavedChangesAlert {...defaultProps} />);

      expect(queryByText('Your unsaved changes:')).toBeNull();
    });

    it('shows content preview when provided', () => {
      const { getByText } = render(
        <UnsavedChangesAlert
          {...defaultProps}
          contentPreview='This is my important work that I might lose.'
        />
      );

      expect(getByText('Your unsaved changes:')).toBeTruthy();
      expect(
        getByText(/"This is my important work that I might lose."/)
      ).toBeTruthy();
    });

    it('truncates long content preview', () => {
      const longContent = 'A'.repeat(150);
      const { getByText } = render(
        <UnsavedChangesAlert
          {...defaultProps}
          contentPreview={longContent}
          previewMaxLength={100}
        />
      );

      // Should show truncated content with ellipsis
      const expectedTruncated = `"${'A'.repeat(100)}..."`;
      expect(getByText(expectedTruncated)).toBeTruthy();
    });

    it('does not truncate short content', () => {
      const shortContent = 'Short text';
      const { getByText } = render(
        <UnsavedChangesAlert
          {...defaultProps}
          contentPreview={shortContent}
          previewMaxLength={100}
        />
      );

      expect(getByText('"Short text"')).toBeTruthy();
    });
  });

  describe('interactions', () => {
    it('calls onDiscard when discard button is pressed', () => {
      const onDiscard = jest.fn();
      const { getByText } = render(
        <UnsavedChangesAlert {...defaultProps} onDiscard={onDiscard} />
      );

      fireEvent.press(getByText('Discard'));

      expect(onDiscard).toHaveBeenCalledTimes(1);
    });

    it('calls onKeepEditing when keep editing button is pressed', () => {
      const onKeepEditing = jest.fn();
      const { getByText } = render(
        <UnsavedChangesAlert {...defaultProps} onKeepEditing={onKeepEditing} />
      );

      fireEvent.press(getByText('Keep Editing'));

      expect(onKeepEditing).toHaveBeenCalledTimes(1);
    });
  });

  describe('accessibility', () => {
    it('has accessible discard button', () => {
      const { getByRole, getAllByRole } = render(
        <UnsavedChangesAlert {...defaultProps} />
      );

      // Find buttons by role
      const buttons = getAllByRole('button');
      const discardButton = buttons.find(
        (b) => b.props.accessibilityLabel === 'Discard'
      );

      expect(discardButton).toBeTruthy();
      expect(discardButton?.props.accessibilityHint).toBe(
        'Discards your unsaved changes'
      );
    });

    it('has accessible keep editing button', () => {
      const { getAllByRole } = render(
        <UnsavedChangesAlert {...defaultProps} />
      );

      const buttons = getAllByRole('button');
      const keepButton = buttons.find(
        (b) => b.props.accessibilityLabel === 'Keep Editing'
      );

      expect(keepButton).toBeTruthy();
      expect(keepButton?.props.accessibilityHint).toBe(
        'Returns to editing without discarding changes'
      );
    });
  });

  describe('variants', () => {
    it('renders with rose variant by default', () => {
      const { getByText } = render(<UnsavedChangesAlert {...defaultProps} />);

      // Component renders (styling is visual verification)
      expect(getByText('Discard Changes?')).toBeTruthy();
    });

    it('renders with amber variant', () => {
      const { getByText } = render(
        <UnsavedChangesAlert {...defaultProps} variant='amber' />
      );

      expect(getByText('Discard Changes?')).toBeTruthy();
    });
  });
});

describe('useUnsavedChangesAlert hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with isVisible as false', () => {
    const { result } = renderHook(() => useUnsavedChangesAlert());

    expect(result.current.isVisible).toBe(false);
  });

  it('show() sets isVisible to true', () => {
    const { result } = renderHook(() => useUnsavedChangesAlert());

    act(() => {
      result.current.show(() => {});
    });

    expect(result.current.isVisible).toBe(true);
  });

  it('hide() sets isVisible to false', () => {
    const { result } = renderHook(() => useUnsavedChangesAlert());

    act(() => {
      result.current.show(() => {});
    });

    expect(result.current.isVisible).toBe(true);

    act(() => {
      result.current.hide();
    });

    expect(result.current.isVisible).toBe(false);
  });

  it('handleDiscard calls pending callback and hides', () => {
    const { result } = renderHook(() => useUnsavedChangesAlert());
    const callback = jest.fn();

    act(() => {
      result.current.show(callback);
    });

    act(() => {
      result.current.handleDiscard();
    });

    expect(callback).toHaveBeenCalled();
    expect(result.current.isVisible).toBe(false);
  });

  it('handleKeepEditing hides without calling callback', () => {
    const { result } = renderHook(() => useUnsavedChangesAlert());
    const callback = jest.fn();

    act(() => {
      result.current.show(callback);
    });

    act(() => {
      result.current.handleKeepEditing();
    });

    expect(callback).not.toHaveBeenCalled();
    expect(result.current.isVisible).toBe(false);
  });

  it('multiple show calls update the pending callback', () => {
    const { result } = renderHook(() => useUnsavedChangesAlert());
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    act(() => {
      result.current.show(callback1);
      result.current.show(callback2);
    });

    act(() => {
      result.current.handleDiscard();
    });

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalled();
  });
});
