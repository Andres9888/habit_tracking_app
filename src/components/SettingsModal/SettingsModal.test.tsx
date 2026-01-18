import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import SettingsModal from './SettingsModal';

describe('SettingsModal', () => {
  it('calls onChangeShowWeekCompletionBar when toggled', () => {
    const handleChangeShowWeekCompletionBar = jest.fn();

    const { getByLabelText, getByText } = render(
      <SettingsModal
        onChangeShowWeekCompletionBar={handleChangeShowWeekCompletionBar}
        onClose={() => {}}
        showWeekCompletionBar
        visible
      />
    );

    expect(getByText('Daily progress bar')).toBeTruthy();

    const toggle = getByLabelText('Daily progress bar');
    fireEvent(toggle, 'valueChange', false);

    expect(handleChangeShowWeekCompletionBar).toHaveBeenCalledTimes(1);
    expect(handleChangeShowWeekCompletionBar).toHaveBeenCalledWith(false);
  });
});
