import React from 'react';
import { render } from '@testing-library/react-native';
import { CardDetailsPill } from '../CardDetailsPill';

describe('CardDetailsPill', () => {
  it('renders a quiet disclosure chevron without a label', () => {
    const { queryByText, toJSON } = render(
      <CardDetailsPill
        accentColor='#059669'
        highContrastMode={false}
        reduceMotionPreference
      />
    );

    expect(queryByText('Details')).toBeNull();
    expect(toJSON()).toBeTruthy();
  });

  it('renders without a label in compact mode', () => {
    const { queryByText, toJSON } = render(
      <CardDetailsPill
        accentColor='#059669'
        highContrastMode={false}
        isCompactMode
        reduceMotionPreference
      />
    );

    expect(queryByText('Details')).toBeNull();
    expect(toJSON()).toBeTruthy();
  });
});
