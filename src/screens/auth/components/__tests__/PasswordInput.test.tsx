import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PasswordInput } from '../PasswordInput';

describe('PasswordInput', () => {
  it('renders correctly with default props', () => {
    const { getByPlaceholderText } = render(
      <PasswordInput value="" onChangeText={() => {}} />
    );

    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
  });

  it('renders with custom placeholder', () => {
    const { getByPlaceholderText } = render(
      <PasswordInput
        value=""
        onChangeText={() => {}}
        placeholder="Custom password placeholder"
      />
    );

    expect(getByPlaceholderText('Custom password placeholder')).toBeTruthy();
  });

  it('displays the lock icon', () => {
    const { getByText } = render(
      <PasswordInput value="" onChangeText={() => {}} />
    );

    expect(getByText('🔒')).toBeTruthy();
  });

  it('toggles secure text entry when eye icon is pressed', () => {
    const { getByText, getByPlaceholderText } = render(
      <PasswordInput value="" onChangeText={() => {}} />
    );

    const input = getByPlaceholderText('Enter your password');
    const toggleButton = getByText('👁');

    // Initially should be secure
    expect(input.props.secureTextEntry).toBe(true);

    // Press toggle button
    fireEvent.press(toggleButton);

    // Icon should change to 🙈
    expect(getByText('🙈')).toBeTruthy();
  });

  it('calls onChangeText when text is entered', () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <PasswordInput value="" onChangeText={mockOnChangeText} />
    );

    const input = getByPlaceholderText('Enter your password');
    fireEvent.changeText(input, 'password123');

    expect(mockOnChangeText).toHaveBeenCalledWith('password123');
  });

  it('displays error message when error prop is provided', () => {
    const errorMessage = 'Password is required';
    const { getByText } = render(
      <PasswordInput value="" onChangeText={() => {}} error={errorMessage} />
    );

    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('has proper accessibility labels', () => {
    const { getByLabelText } = render(
      <PasswordInput value="" onChangeText={() => {}} />
    );

    // Check input accessibility
    const input = getByLabelText('Password input field');
    expect(input).toBeTruthy();

    // Check toggle button accessibility
    const toggleButton = getByLabelText('Show password');
    expect(toggleButton).toBeTruthy();
  });

  it('updates toggle button accessibility label when toggled', () => {
    const { getByText, getByLabelText } = render(
      <PasswordInput value="" onChangeText={() => {}} />
    );

    // Initially should say "Show password"
    expect(getByLabelText('Show password')).toBeTruthy();

    // Toggle
    const toggleButton = getByText('👁');
    fireEvent.press(toggleButton);

    // Should now say "Hide password"
    expect(getByLabelText('Hide password')).toBeTruthy();
  });

  it('renders the PASSWORD label', () => {
    const { getByText } = render(
      <PasswordInput value="" onChangeText={() => {}} />
    );

    expect(getByText('PASSWORD')).toBeTruthy();
  });
});
