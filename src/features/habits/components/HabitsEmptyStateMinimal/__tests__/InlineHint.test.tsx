/**
 * InlineHint Component Tests
 *
 * Tests for the template discovery section with category chips:
 * - Component renders with featured category chips
 * - Browse templates (primary) and Create your own (secondary) buttons render
 * - Callback functions fire correctly on button press
 * - Accessibility labels and hints are present
 * - Violet theme styling is applied correctly
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import { COLORS } from '../constants';
import { InlineHint } from '../InlineHint';

describe('InlineHint', () => {
  const defaultProps = {
    onBrowseTemplates: jest.fn(),
    onCreateCustom: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<InlineHint {...defaultProps} />);
      expect(getByText('Browse templates')).toBeDefined();
    });

    it('should render both primary and secondary buttons', () => {
      const { getByText } = render(<InlineHint {...defaultProps} />);

      // Button labels
      expect(getByText('Browse templates')).toBeDefined();
      expect(getByText('Create your own')).toBeDefined();
    });

    it('should render category chips', () => {
      const { getByText } = render(<InlineHint {...defaultProps} />);

      // Category labels
      expect(getByText(/Morning/)).toBeDefined();
      expect(getByText(/Health/)).toBeDefined();
      expect(getByText(/Mindful/)).toBeDefined();
    });

    it('should render divider text', () => {
      const { getByText } = render(<InlineHint {...defaultProps} />);
      expect(getByText('or type a habit above to get started')).toBeDefined();
    });
  });

  describe('Button Press Behavior', () => {
    it('should call onBrowseTemplates when templates button is pressed', () => {
      const onBrowseTemplates = jest.fn();
      const { getByLabelText } = render(
        <InlineHint {...defaultProps} onBrowseTemplates={onBrowseTemplates} />
      );

      fireEvent.press(getByLabelText('Browse templates'));

      expect(onBrowseTemplates).toHaveBeenCalledTimes(1);
    });

    it('should call onCreateCustom when custom button is pressed', () => {
      const onCreateCustom = jest.fn();
      const { getByLabelText } = render(
        <InlineHint {...defaultProps} onCreateCustom={onCreateCustom} />
      );

      fireEvent.press(getByLabelText('Create your own'));

      expect(onCreateCustom).toHaveBeenCalledTimes(1);
    });

    it('should call onBrowseTemplates when category chips are pressed', () => {
      const onBrowseTemplates = jest.fn();
      const { getByLabelText } = render(
        <InlineHint {...defaultProps} onBrowseTemplates={onBrowseTemplates} />
      );

      fireEvent.press(getByLabelText('Morning templates'));

      expect(onBrowseTemplates).toHaveBeenCalledTimes(1);
    });

    it('should not call callbacks for other buttons when one button is pressed', () => {
      const onBrowseTemplates = jest.fn();
      const onCreateCustom = jest.fn();
      const { getByLabelText } = render(
        <InlineHint
          onBrowseTemplates={onBrowseTemplates}
          onCreateCustom={onCreateCustom}
        />
      );

      // Press browse button
      fireEvent.press(getByLabelText('Browse templates'));

      expect(onBrowseTemplates).toHaveBeenCalledTimes(1);
      expect(onCreateCustom).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have correct accessibility label for browse button', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);

      const browseButton = getByLabelText('Browse templates');
      expect(browseButton).toBeDefined();
    });

    it('should have correct accessibility label for create button', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);

      const createButton = getByLabelText('Create your own');
      expect(createButton).toBeDefined();
    });

    it('should have correct accessibility hint for browse button', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);

      const browseButton = getByLabelText('Browse templates');
      expect(browseButton.props.accessibilityHint).toBe(
        'Opens screen with pre-made habit templates'
      );
    });

    it('should have correct accessibility hint for create button', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);

      const createButton = getByLabelText('Create your own');
      expect(createButton.props.accessibilityHint).toBe(
        'Opens full habit creation screen'
      );
    });

    it('should have button role for all buttons', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);

      const browseButton = getByLabelText('Browse templates');
      expect(browseButton.props.accessibilityRole).toBe('button');

      const createButton = getByLabelText('Create your own');
      expect(createButton.props.accessibilityRole).toBe('button');
    });
  });

  describe('Design System Compliance', () => {

    it('should use violet theme colors for buttons', () => {
      const { UNSAFE_getByProps } = render(<InlineHint {...defaultProps} />);

      const browseStyle = UNSAFE_getByProps({
        accessibilityLabel: 'Browse templates',
      }).props.style({ pressed: false });
      expect(browseStyle.backgroundColor).toBe('#7c3aed');

      const createStyle = UNSAFE_getByProps({
        accessibilityLabel: 'Create your own',
      }).props.style({ pressed: false });
      expect(createStyle.borderColor).toBe('#7c3aed');
    });
  });
});
