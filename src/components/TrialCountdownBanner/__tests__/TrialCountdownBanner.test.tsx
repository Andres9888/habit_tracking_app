/**
 * TrialCountdownBanner Tests
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TrialCountdownBanner } from '../TrialCountdownBanner';

describe('TrialCountdownBanner', () => {
  const mockOnUpgrade = jest.fn();
  const mockOnDismiss = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with days remaining', () => {
    const { getByText } = render(
      <TrialCountdownBanner daysRemaining={5} onUpgrade={mockOnUpgrade} />
    );

    expect(getByText('5 days left in your free trial')).toBeTruthy();
    expect(getByText('Keep unlimited habits & analytics')).toBeTruthy();
    expect(getByText('Upgrade')).toBeTruthy();
  });

  it('shows singular "day" when 1 day remaining', () => {
    const { getByText } = render(
      <TrialCountdownBanner daysRemaining={1} onUpgrade={mockOnUpgrade} />
    );

    expect(getByText('1 day left in your free trial')).toBeTruthy();
  });

  it('calls onUpgrade when upgrade button is pressed', () => {
    const { getByText } = render(
      <TrialCountdownBanner daysRemaining={3} onUpgrade={mockOnUpgrade} />
    );

    fireEvent.press(getByText('Upgrade'));
    expect(mockOnUpgrade).toHaveBeenCalledTimes(1);
  });

  it('shows dismiss button when dismissible is true', () => {
    const { getByLabelText } = render(
      <TrialCountdownBanner
        daysRemaining={3}
        dismissible
        onDismiss={mockOnDismiss}
        onUpgrade={mockOnUpgrade}
      />
    );

    const dismissButton = getByLabelText('Dismiss trial banner');
    expect(dismissButton).toBeTruthy();

    fireEvent.press(dismissButton);
    expect(mockOnDismiss).toHaveBeenCalledTimes(1);
  });

  it('hides dismiss button when dismissible is false', () => {
    const { queryByLabelText } = render(
      <TrialCountdownBanner
        daysRemaining={3}
        dismissible={false}
        onUpgrade={mockOnUpgrade}
      />
    );

    expect(queryByLabelText('Dismiss trial banner')).toBeNull();
  });
});
