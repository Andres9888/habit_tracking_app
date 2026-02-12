/**
 * InlineHint Component Tests
 *
 * Tests for the template discovery section:
 * - Featured category chips render with violet theme
 * - Browse templates and Create your own CTAs
 * - Compact mode renders simplified layout
 * - Callbacks fire correctly
 * - Accessibility labels and hints are present
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

  describe('Full Mode Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<InlineHint {...defaultProps} />);
      expect(getByText('or type a habit above to get started')).toBeDefined();
    });

    it('should render featured category chips', () => {
      const { getByText } = render(<InlineHint {...defaultProps} />);
      expect(getByText(/Morning/)).toBeDefined();
      expect(getByText(/Health/)).toBeDefined();
      expect(getByText(/Mindful/)).toBeDefined();
    });

    it('should render Browse templates CTA', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);
      expect(getByLabelText('Browse templates')).toBeDefined();
    });

    it('should render Create your own CTA', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);
      expect(getByLabelText('Create your own')).toBeDefined();
    });

    it('should use violet color for Browse templates button', () => {
      const { UNSAFE_getByProps } = render(<InlineHint {...defaultProps} />);

      const browseButton = UNSAFE_getByProps({
        accessibilityLabel: 'Browse templates',
      });
      const style = browseButton.props.style({ pressed: false });
      expect(style.backgroundColor).toBe('#7c3aed');
    });

    it('should use violet border for Create your own button', () => {
      const { UNSAFE_getByProps } = render(<InlineHint {...defaultProps} />);

      const createButton = UNSAFE_getByProps({
        accessibilityLabel: 'Create your own',
      });
      const style = createButton.props.style({ pressed: false });
      expect(style.borderColor).toBe('#7c3aed');
    });

    it('should use violet color for category chip text', () => {
      const { getByText } = render(<InlineHint {...defaultProps} />);
      const chip = getByText(/Morning/);
      expect(chip.props.style).toMatchObject({ color: '#7c3aed' });
    });
  });

  describe('Compact Mode', () => {
    it('should render compact Browse templates button', () => {
      const { getByLabelText } = render(
        <InlineHint {...defaultProps} compact />
      );
      expect(getByLabelText('Browse templates')).toBeDefined();
    });

    it('should not render category chips in compact mode', () => {
      const { queryByText } = render(<InlineHint {...defaultProps} compact />);
      expect(queryByText(/Morning/)).toBeNull();
    });
  });

  describe('Button Press Behavior', () => {
    it('should call onBrowseTemplates when Browse templates is pressed', () => {
      const onBrowseTemplates = jest.fn();
      const { getByLabelText } = render(
        <InlineHint {...defaultProps} onBrowseTemplates={onBrowseTemplates} />
      );

      fireEvent.press(getByLabelText('Browse templates'));
      expect(onBrowseTemplates).toHaveBeenCalledTimes(1);
    });

    it('should call onCreateCustom when Create your own is pressed', () => {
      const onCreateCustom = jest.fn();
      const { getByLabelText } = render(
        <InlineHint {...defaultProps} onCreateCustom={onCreateCustom} />
      );

      fireEvent.press(getByLabelText('Create your own'));
      expect(onCreateCustom).toHaveBeenCalledTimes(1);
    });

    it('should call onBrowseTemplates when a category chip is pressed', () => {
      const onBrowseTemplates = jest.fn();
      const { getByLabelText } = render(
        <InlineHint {...defaultProps} onBrowseTemplates={onBrowseTemplates} />
      );

      fireEvent.press(getByLabelText('Morning templates'));
      expect(onBrowseTemplates).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have correct accessibility hint for Browse templates', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);

      const button = getByLabelText('Browse templates');
      expect(button.props.accessibilityHint).toBe(
        'Opens screen with pre-made habit templates'
      );
    });

    it('should have correct accessibility hint for Create your own', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);

      const button = getByLabelText('Create your own');
      expect(button.props.accessibilityHint).toBe(
        'Opens full habit creation screen'
      );
    });

    it('should have button role for all interactive elements', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);

      expect(getByLabelText('Browse templates').props.accessibilityRole).toBe(
        'button'
      );
      expect(getByLabelText('Create your own').props.accessibilityRole).toBe(
        'button'
      );
      expect(getByLabelText('Morning templates').props.accessibilityRole).toBe(
        'button'
      );
    });
  });

  describe('Design System Compliance', () => {
    it('should use stone500 color for divider text', () => {
      const { getByText } = render(<InlineHint {...defaultProps} />);

      const dividerText = getByText('or type a habit above to get started');
      expect(dividerText.props.style).toMatchObject({
        color: COLORS.stone500,
      });
    });

    it('should use violet theme consistently for all template UI', () => {
      const { UNSAFE_getByProps } = render(<InlineHint {...defaultProps} />);

      // Browse templates button
      const browseStyle = UNSAFE_getByProps({
        accessibilityLabel: 'Browse templates',
      }).props.style({ pressed: false });
      expect(browseStyle.backgroundColor).toBe('#7c3aed');

      // Create your own button border
      const createStyle = UNSAFE_getByProps({
        accessibilityLabel: 'Create your own',
      }).props.style({ pressed: false });
      expect(createStyle.borderColor).toBe('#7c3aed');
    });
  });
});
