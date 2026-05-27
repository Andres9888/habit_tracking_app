import React from 'react';
import { render } from '@testing-library/react-native';
import { TransformationGuideCard } from '../TransformationGuideCard';

jest.mock('../../../../theme/ThemeContext', () => ({
  useThemeColors: () => ({
    colors: {
      primary: {
        100: '#ede7d5',
        300: '#d9cfae',
        600: '#8b741d',
        700: '#6f5f20',
      },
      text: {
        inverse: '#ffffff',
        primary: '#292422',
        secondary: '#665f57',
      },
    },
  }),
}));

describe('TransformationGuideCard', () => {
  it('renders transformation guide copy and steps', () => {
    const { getByTestId, getByText } = render(<TransformationGuideCard />);

    expect(getByTestId('templates-transformation-guide')).toBeTruthy();
    expect(getByText('FIND YOUR PATH')).toBeTruthy();
    expect(getByText('Start with the change you want.')).toBeTruthy();
    expect(getByText('Choose outcome')).toBeTruthy();
    expect(getByText('Preview path')).toBeTruthy();
    expect(getByText('Add one habit')).toBeTruthy();
  });
});
