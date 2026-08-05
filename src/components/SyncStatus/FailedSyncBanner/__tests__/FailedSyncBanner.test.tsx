import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';

import { FailedSyncBanner } from '../FailedSyncBanner';

jest.mock('../useFailedSyncBanner', () => ({
  useFailedSyncBanner: () => ({
    visible: false,
    failedCount: 0,
    isRetrying: false,
    handleRetry: jest.fn(),
    handleDiscard: jest.fn(),
  }),
}));

describe('FailedSyncBanner', () => {
  it('renders nothing when not visible', () => {
    render(<FailedSyncBanner />);
    expect(screen.queryByTestId('failed-sync-banner')).toBeNull();
  });

  it('renders the pluralized count message', () => {
    render(<FailedSyncBanner visible failedCount={3} />);
    expect(screen.getByTestId('failed-sync-banner-message')).toHaveTextContent(
      '3 changes couldn’t sync'
    );
  });

  it('uses singular copy for a single failure', () => {
    render(<FailedSyncBanner visible failedCount={1} />);
    expect(screen.getByTestId('failed-sync-banner-message')).toHaveTextContent(
      '1 change couldn’t sync'
    );
  });

  it('invokes retry and discard handlers on press', () => {
    const onRetry = jest.fn();
    const onDiscard = jest.fn();
    render(
      <FailedSyncBanner
        visible
        failedCount={2}
        onRetry={onRetry}
        onDiscard={onDiscard}
      />
    );

    fireEvent.press(screen.getByTestId('failed-sync-banner-retry'));
    fireEvent.press(screen.getByTestId('failed-sync-banner-discard'));

    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onDiscard).toHaveBeenCalledTimes(1);
  });

  it('disables buttons and shows retrying copy while retrying', () => {
    render(<FailedSyncBanner visible failedCount={2} isRetrying />);
    const retry = screen.getByTestId('failed-sync-banner-retry');
    expect(retry).toBeDisabled();
    expect(retry).toHaveTextContent('Retrying…');
  });
});
