
import React from 'react';

import { render } from '@testing-library/react-native';

import SettingsModal from './SettingsModal';

describe('SettingsModal', () => {
  it('renders visual preferences section when visible', () => {
    const { getByText } = render(<SettingsModal onClose={() => {}} visible />);

    expect(getByText('Visual Preferences')).toBeTruthy();
  });
});
