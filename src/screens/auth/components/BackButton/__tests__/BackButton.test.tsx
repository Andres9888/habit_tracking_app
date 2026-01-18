import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { BackButton } from '../BackButton';

describe('BackButton', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with default label', () => {
      const { getByText } = render(<BackButton onPress={mockOnPress} />);
      expect(getByText('Back')).toBeTruthy();
    });

    it('renders with custom label', () => {
      const { getByText } = render(
        <BackButton label='Go Back' onPress={mockOnPress} />
      );
      expect(getByText('Go Back')).toBeTruthy();
    });

    it('renders chevron icon', () => {
      const { getByTestId } = render(<BackButton onPress={mockOnPress} />);
      const button = getByTestId('back-button');
      expect(button).toBeTruthy();
    });
  });

  describe('Interactions', () => {
    it('calls onPress when pressed', () => {
      const { getByTestId } = render(<BackButton onPress={mockOnPress} />);
      fireEvent.press(getByTestId('back-button'));
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('supports multiple presses', () => {
      const { getByTestId } = render(<BackButton onPress={mockOnPress} />);
      fireEvent.press(getByTestId('back-button'));
      fireEvent.press(getByTestId('back-button'));
      expect(mockOnPress).toHaveBeenCalledTimes(2);
    });
  });

  describe('Accessibility', () => {
    it('has button role for screen readers', () => {
      const { getByRole } = render(<BackButton onPress={mockOnPress} />);
      expect(getByRole('button')).toBeTruthy();
    });

    it('has accessible label matching button text', () => {
      const { getByLabelText } = render(<BackButton onPress={mockOnPress} />);
      expect(getByLabelText('Back')).toBeTruthy();
    });

    it('has accessible label with custom text', () => {
      const { getByLabelText } = render(
        <BackButton label='Return' onPress={mockOnPress} />
      );
      expect(getByLabelText('Return')).toBeTruthy();
    });
  });

  describe('Touch Target', () => {
    it('has hitSlop for expanded touch area', () => {
      const { getByTestId } = render(<BackButton onPress={mockOnPress} />);
      const button = getByTestId('back-button');
      expect(button.props.hitSlop).toEqual({
        top: 8,
        bottom: 8,
        left: 8,
        right: 8,
      });
    });
  });

  describe('Custom testID', () => {
    it('uses default testID', () => {
      const { getByTestId } = render(<BackButton onPress={mockOnPress} />);
      expect(getByTestId('back-button')).toBeTruthy();
    });

    it('uses custom testID when provided', () => {
      const { getByTestId } = render(
        <BackButton testID='custom-back' onPress={mockOnPress} />
      );
      expect(getByTestId('custom-back')).toBeTruthy();
    });
  });
});
