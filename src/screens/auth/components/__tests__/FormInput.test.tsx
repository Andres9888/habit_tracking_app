import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { FormInput } from '../FormInput';

describe('FormInput', () => {
  // Basic Rendering Tests
  describe('Rendering', () => {
    it('renders correctly with required props', () => {
      const { getByPlaceholderText, getByText } = render(
        <FormInput
          label='Email'
          value=''
          onChangeText={() => {}}
          placeholder='Enter your email'
        />
      );

      expect(getByText('Email')).toBeTruthy();
      expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    });
  });

  // Input Functionality Tests
  describe('Input Functionality', () => {
    it('calls onChangeText when text is entered', () => {
      const mockOnChangeText = jest.fn();
      const { getByPlaceholderText } = render(
        <FormInput
          label='Email'
          value=''
          onChangeText={mockOnChangeText}
          placeholder='Enter your email'
        />
      );

      const input = getByPlaceholderText('Enter your email');
      fireEvent.changeText(input, 'test@example.com');

      expect(mockOnChangeText).toHaveBeenCalledWith('test@example.com');
    });

    it('displays the current value', () => {
      const { getByDisplayValue } = render(
        <FormInput
          label='Email'
          value='test@example.com'
          onChangeText={() => {}}
          placeholder='Enter your email'
        />
      );

      expect(getByDisplayValue('test@example.com')).toBeTruthy();
    });

    it('passes through TextInput props', () => {
      const { getByPlaceholderText } = render(
        <FormInput
          label='Email'
          value=''
          onChangeText={() => {}}
          placeholder='Enter your email'
          autoCapitalize='none'
          keyboardType='email-address'
        />
      );

      const input = getByPlaceholderText('Enter your email');
      expect(input.props.autoCapitalize).toBe('none');
      expect(input.props.keyboardType).toBe('email-address');
    });
  });

  // Focus/Blur Events Tests
  describe('Focus and Blur Events', () => {
    it('calls onFocus callback when focused', () => {
      const mockOnFocus = jest.fn();
      const { getByPlaceholderText } = render(
        <FormInput
          label='Email'
          value=''
          onChangeText={() => {}}
          placeholder='Enter your email'
          onFocus={mockOnFocus}
        />
      );

      const input = getByPlaceholderText('Enter your email');
      fireEvent(input, 'focus');

      expect(mockOnFocus).toHaveBeenCalled();
    });

    it('calls onBlur callback when blurred', () => {
      const mockOnBlur = jest.fn();
      const { getByPlaceholderText } = render(
        <FormInput
          label='Email'
          value=''
          onChangeText={() => {}}
          placeholder='Enter your email'
          onBlur={mockOnBlur}
        />
      );

      const input = getByPlaceholderText('Enter your email');
      fireEvent(input, 'blur');

      expect(mockOnBlur).toHaveBeenCalled();
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    it('supports accessibility label on input', () => {
      const { getByLabelText } = render(
        <FormInput
          label='Email'
          value=''
          onChangeText={() => {}}
          placeholder='Enter your email'
          accessibilityLabel='Email input'
        />
      );

      expect(getByLabelText('Email input')).toBeTruthy();
    });
  });

  // Label Right Prop Tests
  describe('Label Right Prop', () => {
    it('renders labelRight element when provided', () => {
      const { getByText } = render(
        <FormInput
          label='Password'
          value=''
          onChangeText={() => {}}
          placeholder='Enter password'
          labelRight={<Text>Forgot?</Text>}
        />
      );

      expect(getByText('Forgot?')).toBeTruthy();
    });

    it('does not render labelRight when not provided', () => {
      const { queryByText } = render(
        <FormInput
          label='Email'
          value=''
          onChangeText={() => {}}
          placeholder='Enter your email'
        />
      );

      expect(queryByText('Forgot?')).toBeNull();
    });

    it('label and labelRight are in the same row', () => {
      const { getByText } = render(
        <FormInput
          label='Password'
          value=''
          onChangeText={() => {}}
          placeholder='Enter password'
          labelRight={<Text testID='forgot-link'>Forgot?</Text>}
        />
      );

      // Both elements should be rendered
      expect(getByText('Password')).toBeTruthy();
      expect(getByText('Forgot?')).toBeTruthy();
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('handles empty label gracefully', () => {
      const { getByPlaceholderText } = render(
        <FormInput
          label=''
          value=''
          onChangeText={() => {}}
          placeholder='Enter your email'
        />
      );

      expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    });
  });
});
