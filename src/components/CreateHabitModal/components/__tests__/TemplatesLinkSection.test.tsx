/**
 * TemplatesLinkSection Component Tests - V8 Templates Link Design
 * Task 5: Templates Link Section for inspiration
 *
 * Tests:
 * - Card displays with layout-grid icon
 * - Pressing opens templates browse view
 * - Maintains consistent spacing with other sections
 * - Proper accessibility labels and roles
 * - Haptic feedback on press
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import { TemplatesLinkSection } from '../TemplatesLinkSection';

// Mock useHapticFeedback
const mockTriggerSelection = jest.fn();
jest.mock('../../../../hooks/useHapticFeedback', () => ({
  __esModule: true,
  default: () => ({
    triggerSelection: mockTriggerSelection,
    triggerImpact: jest.fn(),
    triggerNotification: jest.fn(),
  }),
}));

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => ({
  LayoutGrid: () => 'LayoutGridIcon',
  ChevronRight: () => 'ChevronRightIcon',
}));

// Mock AccessibilityInfo.announceForAccessibility
jest
  .spyOn(AccessibilityInfo, 'announceForAccessibility')
  .mockImplementation(jest.fn());

describe('TemplatesLinkSection - V8 Design', () => {
  const mockOnPress = jest.fn();

  const defaultProps = {
    onPress: mockOnPress,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the section with testID', () => {
      const { getByTestId } = render(
        <TemplatesLinkSection {...defaultProps} />
      );
      expect(getByTestId('templates-link-section')).toBeDefined();
    });

    it('should render the button with testID', () => {
      const { getByTestId } = render(
        <TemplatesLinkSection {...defaultProps} />
      );
      expect(getByTestId('templates-link-button')).toBeDefined();
    });

    it('should render the icon container with testID', () => {
      const { getByTestId } = render(
        <TemplatesLinkSection {...defaultProps} />
      );
      expect(getByTestId('templates-link-icon')).toBeDefined();
    });

    it('should display "Need inspiration?" heading', () => {
      const { getByText } = render(<TemplatesLinkSection {...defaultProps} />);
      expect(getByText('Need inspiration?')).toBeDefined();
    });

    it('should display "Browse science-backed templates" subtext', () => {
      const { getByText } = render(<TemplatesLinkSection {...defaultProps} />);
      expect(getByText('Browse science-backed templates')).toBeDefined();
    });
  });

  describe('User Interaction', () => {
    it('should call onPress when button is pressed', () => {
      const { getByTestId } = render(
        <TemplatesLinkSection {...defaultProps} />
      );

      const button = getByTestId('templates-link-button');
      fireEvent.press(button);

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should trigger haptic feedback when pressed', () => {
      const { getByTestId } = render(
        <TemplatesLinkSection {...defaultProps} />
      );

      const button = getByTestId('templates-link-button');
      fireEvent.press(button);

      expect(mockTriggerSelection).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have button accessibility role', () => {
      const { getByRole } = render(<TemplatesLinkSection {...defaultProps} />);
      expect(getByRole('button')).toBeDefined();
    });

    it('should have full accessibility label', () => {
      const { getByLabelText } = render(
        <TemplatesLinkSection {...defaultProps} />
      );
      expect(
        getByLabelText('Need inspiration? Browse science-backed templates')
      ).toBeDefined();
    });

    it('should have accessibility hint', () => {
      const { getByTestId } = render(
        <TemplatesLinkSection {...defaultProps} />
      );

      const button = getByTestId('templates-link-button');
      expect(button.props.accessibilityHint).toBe(
        'Opens the templates browser to browse pre-made habit templates'
      );
    });

    it('should announce for screen readers when pressed', () => {
      const { getByTestId } = render(
        <TemplatesLinkSection {...defaultProps} />
      );

      const button = getByTestId('templates-link-button');
      fireEvent.press(button);

      expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
        'Opening templates browser to browse science-backed habit templates'
      );
    });
  });

  describe('Press Animation', () => {
    it('should handle pressIn event without error', () => {
      const { getByTestId } = render(
        <TemplatesLinkSection {...defaultProps} />
      );

      const button = getByTestId('templates-link-button');

      // Should not throw when pressing in
      expect(() => fireEvent(button, 'pressIn')).not.toThrow();
    });

    it('should handle pressOut event without error', () => {
      const { getByTestId } = render(
        <TemplatesLinkSection {...defaultProps} />
      );

      const button = getByTestId('templates-link-button');

      // Should not throw when pressing out
      expect(() => fireEvent(button, 'pressOut')).not.toThrow();
    });
  });
});
