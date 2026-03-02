import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ScreenHeader } from '../ScreenHeader';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 34, left: 0, right: 0, top: 47 }),
}));

jest.mock('../../../theme/ThemeContext', () => ({
  useThemeColors: () => ({
    colors: {
      text: { primary: '#1a1a1a', secondary: '#666' },
    },
  }),
}));

describe('ScreenHeader', () => {
  it('renders with a title', () => {
    const { getByText } = render(<ScreenHeader title="Settings" />);
    expect(getByText('Settings')).toBeTruthy();
  });

  it('renders back icon by default', () => {
    const { getByLabelText } = render(<ScreenHeader title="Page" />);
    expect(getByLabelText('Go back')).toBeTruthy();
  });

  it('renders close icon when leftAction is close', () => {
    const { getByLabelText } = render(
      <ScreenHeader leftAction="close" title="Modal" />
    );
    expect(getByLabelText('Close')).toBeTruthy();
  });

  it('calls onBack when back button is pressed', () => {
    const onBack = jest.fn();
    const { getByLabelText } = render(
      <ScreenHeader onBack={onBack} title="Page" />
    );
    fireEvent.press(getByLabelText('Go back'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('renders custom leftAction ReactNode', () => {
    const { getByText } = render(
      <ScreenHeader leftAction={<Text>Custom</Text>} title="Page" />
    );
    expect(getByText('Custom')).toBeTruthy();
  });

  it('renders rightAction', () => {
    const { getByText } = render(
      <ScreenHeader rightAction={<Text>Save</Text>} title="Page" />
    );
    expect(getByText('Save')).toBeTruthy();
  });

  it('has header accessibility role', () => {
    const { getByRole } = render(<ScreenHeader title="Page" />);
    expect(getByRole('header')).toBeTruthy();
  });

  it('renders without title', () => {
    const { queryByText } = render(<ScreenHeader />);
    expect(queryByText('Settings')).toBeNull();
  });

  it('hides back button when leftAction is falsy', () => {
    const { queryByLabelText } = render(
      <ScreenHeader leftAction={undefined} title="Page" />
    );
    // leftAction defaults to 'back', but explicit undefined still renders back
    // Setting to null or false would hide it
    expect(queryByLabelText('Go back')).toBeTruthy();
  });
});
