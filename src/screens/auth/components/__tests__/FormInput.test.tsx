import React from 'react';
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

    it('renders with icon when provided', () => {
      const { getByLabelText } = render(
        <FormInput
          label='Email'
          icon='📧'
          value=''
          onChangeText={() => {}}
          placeholder='Enter your email'
        />
      );

      expect(getByLabelText('Email icon')).toBeTruthy();
    });

    it('renders without icon when not provided', () => {
      const { queryByLabelText } = render(
        <FormInput
          label='Email'
          value=''
          onChangeText={() => {}}
          placeholder='Enter your email'
        />
      );

      expect(queryByLabelText('Email icon')).toBeNull();
    });

    it('displays error message when error prop is provided', () => {
      const errorMessage = 'Invalid email address';
      const { getByText } = render(
        <FormInput
          label='Email'
          value=''
          onChangeText={() => {}}
          placeholder='Enter your email'
          error={errorMessage}
        />
      );

      expect(getByText(errorMessage)).toBeTruthy();
    });

    it('does not display error message when error prop is not provided', () => {
      const { queryByText } = render(
        <FormInput
          label='Email'
          value=''
          onChangeText={() => {}}
          placeholder='Enter your email'
        />
      );

      // Should not find any error text
      expect(queryByText(/error/i)).toBeNull();
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
    it('has proper accessibility labels', () => {
      const { getByLabelText } = render(
        <FormInput
          label='Email'
          icon='📧'
          value=''
          onChangeText={() => {}}
          placeholder='Enter your email'
          accessibilityLabel='Email input'
        />
      );

      expect(getByLabelText('Email input')).toBeTruthy();
      expect(getByLabelText('Email icon')).toBeTruthy();
    });

    it('error message has accessibility live region', () => {
      const { getByText } = render(
        <FormInput
          label='Email'
          value=''
          onChangeText={() => {}}
          placeholder='Enter your email'
          error='Invalid email'
        />
      );

      const errorText = getByText('Invalid email');
      expect(errorText.props.accessibilityLiveRegion).toBe('polite');
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

    it('handles long error messages', () => {
      const longError =
        'This is a very long error message that should still be displayed correctly without breaking the layout or causing any issues';
      const { getByText } = render(
        <FormInput
          label='Email'
          value=''
          onChangeText={() => {}}
          placeholder='Enter your email'
          error={longError}
        />
      );

      expect(getByText(longError)).toBeTruthy();
    });

    it('handles emoji icons correctly', () => {
      const { getByLabelText } = render(
        <FormInput
          label='TEST'
          icon='🔍'
          value=''
          onChangeText={() => {}}
          placeholder='Search'
        />
      );

      const icon = getByLabelText('TEST icon');
      expect(icon.props.children).toBe('🔍');
    });
  });
});
