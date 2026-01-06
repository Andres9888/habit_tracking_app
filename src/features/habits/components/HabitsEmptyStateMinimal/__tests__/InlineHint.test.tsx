/**
 * InlineHint Component Tests
 *
 * Tests for the vertical stack hint component with navigation buttons:
 * - Component renders with correct vertical layout structure
 * - Both navigation buttons are properly rendered and accessible
 * - Callback functions fire correctly on button press
 * - Accessibility labels and hints are present
 * - Touch targets meet minimum size requirements
 * - Button styling follows design specifications
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
      expect(getByText('or explore')).toBeDefined();
    });

    it('should render "or explore" text and both buttons', () => {
      const { getByText } = render(<InlineHint {...defaultProps} />);

      // Text label
      expect(getByText('or explore')).toBeDefined();

      // Button labels
      expect(getByText('📋 templates')).toBeDefined();
      expect(getByText('✨ custom')).toBeDefined();
    });

    it('should render "templates" button with correct styling', () => {
      const { getByText } = render(<InlineHint {...defaultProps} />);

      const templatesButton = getByText('📋 templates');
      expect(templatesButton).toBeDefined();
      expect(templatesButton.props.style).toMatchObject({
        color: COLORS.emerald700,
        fontSize: 13,
        fontWeight: '600',
        lineHeight: 18,
      });
    });

    it('should render "custom" button with correct styling', () => {
      const { getByText } = render(<InlineHint {...defaultProps} />);

      const customButton = getByText('✨ custom');
      expect(customButton).toBeDefined();
      expect(customButton.props.style).toMatchObject({
        color: COLORS.emerald700,
        fontSize: 13,
        fontWeight: '600',
        lineHeight: 18,
      });
    });

    it('should render "or explore" text with correct styling', () => {
      const { getByText } = render(<InlineHint {...defaultProps} />);

      const exploreText = getByText('or explore');
      expect(exploreText.props.style).toMatchObject({
        color: COLORS.stone600,
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 10,
        textAlign: 'center',
      });
    });
  });

  describe('Button Press Behavior', () => {
    it('should call onBrowseTemplates when templates button is pressed', () => {
      const onBrowseTemplates = jest.fn();
      const { getByLabelText } = render(
        <InlineHint {...defaultProps} onBrowseTemplates={onBrowseTemplates} />
      );

      fireEvent.press(getByLabelText('Browse habit templates'));

      expect(onBrowseTemplates).toHaveBeenCalledTimes(1);
    });

    it('should call onCreateCustom when custom button is pressed', () => {
      const onCreateCustom = jest.fn();
      const { getByLabelText } = render(
        <InlineHint {...defaultProps} onCreateCustom={onCreateCustom} />
      );

      fireEvent.press(getByLabelText('Create custom habit'));

      expect(onCreateCustom).toHaveBeenCalledTimes(1);
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

      // Press templates button
      fireEvent.press(getByLabelText('Browse habit templates'));

      expect(onBrowseTemplates).toHaveBeenCalledTimes(1);
      expect(onCreateCustom).not.toHaveBeenCalled();
    });

    it('should support multiple presses on the same button', () => {
      const onBrowseTemplates = jest.fn();
      const { getByLabelText } = render(
        <InlineHint {...defaultProps} onBrowseTemplates={onBrowseTemplates} />
      );

      const templatesButton = getByLabelText('Browse habit templates');

      fireEvent.press(templatesButton);
      fireEvent.press(templatesButton);
      fireEvent.press(templatesButton);

      expect(onBrowseTemplates).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility', () => {
    it('should have correct accessibility label for templates button', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);

      const templatesButton = getByLabelText('Browse habit templates');
      expect(templatesButton).toBeDefined();
    });

    it('should have correct accessibility label for custom button', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);

      const customButton = getByLabelText('Create custom habit');
      expect(customButton).toBeDefined();
    });

    it('should have correct accessibility hint for templates button', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);

      const templatesButton = getByLabelText('Browse habit templates');
      expect(templatesButton.props.accessibilityHint).toBe(
        'Opens screen with pre-made habit templates'
      );
    });

    it('should have correct accessibility hint for custom button', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);

      const customButton = getByLabelText('Create custom habit');
      expect(customButton.props.accessibilityHint).toBe(
        'Opens full habit creation screen'
      );
    });

    it('should have button role for templates button', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);

      const templatesButton = getByLabelText('Browse habit templates');
      expect(templatesButton.props.accessibilityRole).toBe('button');
    });

    it('should have button role for custom button', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);

      const customButton = getByLabelText('Create custom habit');
      expect(customButton.props.accessibilityRole).toBe('button');
    });
  });

  describe('Touch Targets', () => {
    it('should have adequate touch target padding for templates button', () => {
      const { UNSAFE_getByProps } = render(<InlineHint {...defaultProps} />);

      // Find Pressable by accessibility label
      const templatesButton = UNSAFE_getByProps({
        accessibilityLabel: 'Browse habit templates',
      });

      // Check for pill button padding (12px horizontal, 6px vertical)
      const styleWhenNotPressed = templatesButton.props.style({
        pressed: false,
      });
      expect(styleWhenNotPressed.paddingHorizontal).toBe(12);
      expect(styleWhenNotPressed.paddingVertical).toBe(6);
    });

    it('should have adequate touch target padding for custom button', () => {
      const { UNSAFE_getByProps } = render(<InlineHint {...defaultProps} />);

      const customButton = UNSAFE_getByProps({
        accessibilityLabel: 'Create custom habit',
      });

      // Check for pill button padding (12px horizontal, 6px vertical)
      const styleWhenNotPressed = customButton.props.style({ pressed: false });
      expect(styleWhenNotPressed.paddingHorizontal).toBe(12);
      expect(styleWhenNotPressed.paddingVertical).toBe(6);
    });
  });

  describe('Press State Styling', () => {
    it('should apply pressed opacity to templates button when pressed', () => {
      const { UNSAFE_getByProps } = render(<InlineHint {...defaultProps} />);

      const templatesButton = UNSAFE_getByProps({
        accessibilityLabel: 'Browse habit templates',
      });

      const styleWhenPressed = templatesButton.props.style({ pressed: true });
      expect(styleWhenPressed.opacity).toBe(0.9);
    });

    it('should apply normal opacity to templates button when not pressed', () => {
      const { UNSAFE_getByProps } = render(<InlineHint {...defaultProps} />);

      const templatesButton = UNSAFE_getByProps({
        accessibilityLabel: 'Browse habit templates',
      });

      const styleWhenNotPressed = templatesButton.props.style({
        pressed: false,
      });
      expect(styleWhenNotPressed.opacity).toBe(1);
    });

    it('should apply pressed opacity to custom button when pressed', () => {
      const { UNSAFE_getByProps } = render(<InlineHint {...defaultProps} />);

      const customButton = UNSAFE_getByProps({
        accessibilityLabel: 'Create custom habit',
      });

      const styleWhenPressed = customButton.props.style({ pressed: true });
      expect(styleWhenPressed.opacity).toBe(0.9);
    });

    it('should apply normal opacity to custom button when not pressed', () => {
      const { UNSAFE_getByProps } = render(<InlineHint {...defaultProps} />);

      const customButton = UNSAFE_getByProps({
        accessibilityLabel: 'Create custom habit',
      });

      const styleWhenNotPressed = customButton.props.style({ pressed: false });
      expect(styleWhenNotPressed.opacity).toBe(1);
    });

    it('should apply pill background styling when pressed', () => {
      const { UNSAFE_getByProps } = render(<InlineHint {...defaultProps} />);

      const templatesButton = UNSAFE_getByProps({
        accessibilityLabel: 'Browse habit templates',
      });

      const styleWhenPressed = templatesButton.props.style({ pressed: true });
      expect(styleWhenPressed.backgroundColor).toBe(COLORS.emerald100);
    });

    it('should apply subtle pill background when not pressed', () => {
      const { UNSAFE_getByProps } = render(<InlineHint {...defaultProps} />);

      const templatesButton = UNSAFE_getByProps({
        accessibilityLabel: 'Browse habit templates',
      });

      const styleWhenNotPressed = templatesButton.props.style({
        pressed: false,
      });
      expect(styleWhenNotPressed.backgroundColor).toBe(
        'rgba(209, 250, 229, 0.5)'
      );
    });
  });

  describe('Layout', () => {
    it('should render all elements', () => {
      const { getByText, getByLabelText } = render(
        <InlineHint {...defaultProps} />
      );

      // Verify all elements are rendered
      expect(getByText('or explore')).toBeDefined();
      expect(getByLabelText('Browse habit templates')).toBeDefined();
      expect(getByLabelText('Create custom habit')).toBeDefined();
    });

    it('should render pill buttons with border radius', () => {
      const { UNSAFE_getByProps } = render(<InlineHint {...defaultProps} />);

      const templatesButton = UNSAFE_getByProps({
        accessibilityLabel: 'Browse habit templates',
      });
      const styleWhenNotPressed = templatesButton.props.style({
        pressed: false,
      });

      // Pill buttons should have full border radius
      expect(styleWhenNotPressed.borderRadius).toBe(9999);
      expect(styleWhenNotPressed.borderWidth).toBe(1);
    });
  });

  describe('Design System Compliance', () => {
    it('should use stone600 color from design system for text', () => {
      const { getByText } = render(<InlineHint {...defaultProps} />);

      const exploreText = getByText('or explore');
      expect(exploreText.props.style.color).toBe(COLORS.stone600);
      expect(COLORS.stone600).toBe('#57534E');
    });

    it('should use emerald700 color from design system for button text', () => {
      const { getByText } = render(<InlineHint {...defaultProps} />);

      const templatesButton = getByText('📋 templates');
      expect(templatesButton.props.style.color).toBe(COLORS.emerald700);
      expect(COLORS.emerald700).toBe('#047857');
    });

    it('should use 13px font size for all text', () => {
      const { getByText } = render(<InlineHint {...defaultProps} />);

      const exploreText = getByText('or explore');
      const buttonText = getByText('📋 templates');

      expect(exploreText.props.style.fontSize).toBe(13);
      expect(buttonText.props.style.fontSize).toBe(13);
    });

    it('should use 18px line height for all text', () => {
      const { getByText } = render(<InlineHint {...defaultProps} />);

      const exploreText = getByText('or explore');
      const buttonText = getByText('📋 templates');

      expect(exploreText.props.style.lineHeight).toBe(18);
      expect(buttonText.props.style.lineHeight).toBe(18);
    });
  });
});
