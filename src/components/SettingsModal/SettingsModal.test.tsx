import React from 'react';
import { render } from '@testing-library/react-native';

import SettingsModal from './SettingsModal';

describe('SettingsModal', () => {
  it('renders redesigned settings sections when visible', () => {
    const { getByText, getByLabelText } = render(<SettingsModal onClose={() => {}} visible />);

    expect(getByText('Appearance')).toBeTruthy();
    expect(getByText('Behavior')).toBeTruthy();
    expect(getByLabelText('Account settings')).toBeTruthy();
  });
});
