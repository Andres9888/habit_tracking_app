import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { StyleSheet, Text } from 'react-native';
import { ScreenHeader } from '../ScreenHeader';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 34, left: 0, right: 0, top: 47 }),
}));

jest.mock('../../../theme/ThemeContext', () => ({
  useThemeColors: () => ({
    colors: {
      background: '#f5f1ed',
      gray: { 900: '#1a1816' },
      text: { primary: '#1a1a1a', secondary: '#666' },
    },
  }),
}));

describe('ScreenHeader', () => {
  it('renders with a title', () => {
    const { getByText } = render(<ScreenHeader title='Settings' />);
    expect(getByText('Settings')).toBeTruthy();
  });

  it('renders back icon by default', () => {
    const { getByLabelText } = render(<ScreenHeader title='Page' />);
    expect(getByLabelText('Go back')).toBeTruthy();
  });

  it('renders close icon when leftAction is close', () => {
    const { getByLabelText } = render(
      <ScreenHeader leftAction='close' title='Modal' />
    );
    expect(getByLabelText('Close')).toBeTruthy();
  });

  it('calls onBack when back button is pressed', () => {
    const onBack = jest.fn();
    const { getByLabelText } = render(
      <ScreenHeader onBack={onBack} title='Page' />
    );
    fireEvent.press(getByLabelText('Go back'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('uses a real 44pt touch slot around the 40pt visual control', () => {
    const { getByLabelText } = render(<ScreenHeader title='Page' />);
    const buttonStyle = StyleSheet.flatten(
      getByLabelText('Go back').props.style
    );

    expect(buttonStyle).toEqual(
      expect.objectContaining({ height: 44, width: 44 })
    );
  });

  it('supports a contextual spoken back label without visible text', () => {
    const { getByLabelText, queryByText } = render(
      <ScreenHeader
        leftActionAccessibilityLabel='Back to Drink water'
        title='History'
      />
    );

    expect(getByLabelText('Back to Drink water')).toBeTruthy();
    expect(queryByText('Back to Drink water')).toBeNull();
  });

  it('renders custom leftAction ReactNode', () => {
    const { getByText } = render(
      <ScreenHeader leftAction={<Text>Custom</Text>} title='Page' />
    );
    expect(getByText('Custom')).toBeTruthy();
  });

  it('renders rightAction', () => {
    const { getByText } = render(
      <ScreenHeader rightAction={<Text>Save</Text>} title='Page' />
    );
    expect(getByText('Save')).toBeTruthy();
  });

  it('has header accessibility role', () => {
    const { getByRole, getByLabelText } = render(<ScreenHeader title='Page' />);
    expect(getByRole('header')).toBeTruthy();
    expect(getByRole('header')).toHaveTextContent('Page');
    expect(getByLabelText('Go back')).toBeTruthy();
    expect(getByRole('header').props.accessible).not.toBe(true);
  });

  it('renders without title', () => {
    const { queryByText } = render(<ScreenHeader />);
    expect(queryByText('Settings')).toBeNull();
  });

  it('hides back button when leftAction is falsy', () => {
    const { queryByLabelText } = render(
      <ScreenHeader leftAction={undefined} title='Page' />
    );
    // leftAction defaults to 'back', but explicit undefined still renders back
    // Setting to null or false would hide it
    expect(queryByLabelText('Go back')).toBeTruthy();
  });

  it('renders subtitle text', () => {
    const { getByText } = render(
      <ScreenHeader
        leftAction={null}
        subtitle='Track your habit journey'
        title='Analytics'
      />
    );
    expect(getByText('Track your habit journey')).toBeTruthy();
  });

  it('renders left-aligned title without navigation actions', () => {
    const { getByText, queryByLabelText } = render(
      <ScreenHeader leftAction={null} title='Analytics' />
    );
    expect(getByText('Analytics')).toBeTruthy();
    expect(queryByLabelText('Go back')).toBeNull();
  });

  it('does not render subtitle when not provided', () => {
    const { queryByText } = render(<ScreenHeader title='Settings' />);
    expect(queryByText('Track your habit journey')).toBeNull();
  });

  it('renders close icon with transparent variant and rightAction', () => {
    const onBack = jest.fn();
    const { getByLabelText, getByText } = render(
      <ScreenHeader
        leftAction='close'
        rightAction={<Text>Edit Habit</Text>}
        variant='transparent'
        onBack={onBack}
      />
    );
    expect(getByLabelText('Close')).toBeTruthy();
    expect(getByText('Edit Habit')).toBeTruthy();
    fireEvent.press(getByLabelText('Close'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('renders with back action and title for navigation screens', () => {
    const onBack = jest.fn();
    const { getByText, getByLabelText } = render(
      <ScreenHeader onBack={onBack} title='Character' />
    );
    expect(getByText('Character')).toBeTruthy();
    expect(getByLabelText('Go back')).toBeTruthy();
  });
});
