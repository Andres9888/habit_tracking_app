import React from 'react';
import { render, screen } from '@testing-library/react-native';

import { WebFallback } from '../WebFallback';

jest.mock('../../../theme/ThemeContext', () => ({
  useThemeColors: () => ({
    colors: {
      surface: '#ffffff',
      text: {
        primary: '#111111',
        secondary: '#666666',
      },
    },
  }),
}));

describe('WebFallback', () => {
  it('shows mobile-app fallback copy without purchase or restore actions', () => {
    render(<WebFallback visible onClose={jest.fn()} />);

    expect(screen.getByText('Premium Subscription')).toBeTruthy();
    expect(
      screen.getByText(
        'Premium purchases and restores are available in the iOS or Android app. Web checkout is not enabled for this build.'
      )
    ).toBeTruthy();
    expect(screen.queryByRole('button', { name: /restore/i })).toBeNull();
  });

  it('hides the close action when the paywall is not dismissible', () => {
    render(<WebFallback visible dismissible={false} onClose={jest.fn()} />);

    expect(screen.queryByLabelText('Close')).toBeNull();
  });
});
