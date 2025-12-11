import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { RewardCelebrationToast } from '../RewardCelebrationToast';

describe('RewardCelebrationToast', () => {
  it('invokes actions when buttons are pressed', () => {
    const onDismiss = jest.fn();
    const onSecondaryAction = jest.fn();

    const { getByText } = render(
      <RewardCelebrationToast
        message='Test reward message'
        onDismiss={onDismiss}
        onSecondaryAction={onSecondaryAction}
        streak={5}
        visible
      />
    );

    expect(getByText('🔥 5 day streak unlocked')).toBeTruthy();
    expect(getByText('Test reward message')).toBeTruthy();

    fireEvent.press(getByText('Share'));
    fireEvent.press(getByText('Not now'));

    expect(onSecondaryAction).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});

