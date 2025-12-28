/**
 * DraftRecoveryBanner Tests
 * Edge Case Handling: Data Loss Prevention - UI indicator for recovered drafts
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DraftRecoveryBanner } from '../DraftRecoveryBanner';

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
  },
}));

describe('DraftRecoveryBanner', () => {
  const defaultProps = {
    visible: true,
    onDiscard: jest.fn(),
    onDismiss: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when not visible', () => {
    const { queryByText } = render(
      <DraftRecoveryBanner {...defaultProps} visible={false} />
    );

    expect(queryByText('Unsaved draft recovered')).toBeNull();
  });

  it('renders default message when visible', () => {
    const { getByText } = render(<DraftRecoveryBanner {...defaultProps} />);

    expect(getByText('Unsaved draft recovered')).toBeTruthy();
    expect(getByText('Your previous edits were saved locally')).toBeTruthy();
  });

  it('renders custom message', () => {
    const { getByText } = render(
      <DraftRecoveryBanner
        {...defaultProps}
        message='Custom recovery message'
      />
    );

    expect(getByText('Custom recovery message')).toBeTruthy();
  });

  it('calls onDiscard when discard button is pressed', () => {
    const onDiscard = jest.fn();
    const { getByText } = render(
      <DraftRecoveryBanner {...defaultProps} onDiscard={onDiscard} />
    );

    fireEvent.press(getByText('Discard'));

    expect(onDiscard).toHaveBeenCalledTimes(1);
  });

  it('calls onDismiss when close button is pressed', () => {
    const onDismiss = jest.fn();
    const { getByLabelText } = render(
      <DraftRecoveryBanner {...defaultProps} onDismiss={onDismiss} />
    );

    fireEvent.press(getByLabelText('Keep recovered draft'));

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  describe('variant styles', () => {
    it('renders with rose variant by default', () => {
      const { getByText } = render(<DraftRecoveryBanner {...defaultProps} />);

      // Just verify the component renders (styling verification is visual)
      expect(getByText('Unsaved draft recovered')).toBeTruthy();
    });

    it('renders with violet variant', () => {
      const { getByText } = render(
        <DraftRecoveryBanner {...defaultProps} variant='violet' />
      );

      expect(getByText('Unsaved draft recovered')).toBeTruthy();
    });

    it('renders with emerald variant', () => {
      const { getByText } = render(
        <DraftRecoveryBanner {...defaultProps} variant='emerald' />
      );

      expect(getByText('Unsaved draft recovered')).toBeTruthy();
    });
  });
});
