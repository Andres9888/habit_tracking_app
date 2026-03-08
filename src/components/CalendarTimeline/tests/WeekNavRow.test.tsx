import React from 'react';
import { render } from '@testing-library/react-native';

import { WeekNavRow } from '../components/WeekNavRow';

describe('WeekNavRow', () => {
  it('renders the month label without a streak badge on the right', () => {
    const { getByText, queryByText } = render(
      <WeekNavRow dateSuffix='14' isViewingPast={false} monthName='October' />
    );

    expect(getByText('October')).toBeTruthy();
    expect(getByText('14')).toBeTruthy();
    expect(queryByText('On fire!')).toBeNull();
    expect(queryByText('Keep it going!')).toBeNull();
  });
});
