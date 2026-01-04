/**
 * InlineHint Component Tests
 *
 * Tests for the inline hint component with embedded navigation links:
 * - Component renders with correct inline text structure
 * - Both navigation links are properly rendered and accessible
 * - Callback functions fire correctly on link press
 * - Accessibility labels and hints are present
 * - Touch targets meet minimum size requirements
 * - Text styling follows design specifications
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

    it('should render all text segments in correct order', () => {
      const { getByText } = render(<InlineHint {...defaultProps} />);

      // Base text segments
      expect(getByText('or explore')).toBeDefined();
      expect(getByText(/and/)).toBeDefined();

      // Link text segments
      expect(getByText('templates')).toBeDefined();
      expect(getByText('custom options')).toBeDefined();
    });

    it('should render "templates" link with correct styling', () => {
      const { getByText } = render(<InlineHint {...defaultProps} />);

      const templatesLink = getByText('templates');
      expect(templatesLink).toBeDefined();
      expect(templatesLink.props.style).toMatchObject({
        color: COLORS.emerald700,
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 21,
      });
    });

    it('should render "custom options" link with correct styling', () => {
      const { getByText } = render(<InlineHint {...defaultProps} />);

      const customLink = getByText('custom options');
      expect(customLink).toBeDefined();
      expect(customLink.props.style).toMatchObject({
        color: COLORS.emerald700,
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 21,
      });
    });

    it('should render base text with correct styling', () => {
      const { getByText } = render(<InlineHint {...defaultProps} />);

      const baseText = getByText('or explore');
      expect(baseText.props.style).toMatchObject({
        color: COLORS.stone600,
        fontSize: 14,
        lineHeight: 21,
        textAlign: 'center',
      });
    });
  });

  describe('Link Press Behavior', () => {
    it('should call onBrowseTemplates when templates link is pressed', () => {
      const onBrowseTemplates = jest.fn();
      const { getByLabelText } = render(
        <InlineHint {...defaultProps} onBrowseTemplates={onBrowseTemplates} />
      );

      fireEvent.press(getByLabelText('Browse habit templates'));

      expect(onBrowseTemplates).toHaveBeenCalledTimes(1);
    });

    it('should call onCreateCustom when custom options link is pressed', () => {
      const onCreateCustom = jest.fn();
      const { getByLabelText } = render(
        <InlineHint {...defaultProps} onCreateCustom={onCreateCustom} />
      );

      fireEvent.press(getByLabelText('Create custom habit'));

      expect(onCreateCustom).toHaveBeenCalledTimes(1);
    });

    it('should not call callbacks for other links when one link is pressed', () => {
      const onBrowseTemplates = jest.fn();
      const onCreateCustom = jest.fn();
      const { getByLabelText } = render(
        <InlineHint
          onBrowseTemplates={onBrowseTemplates}
          onCreateCustom={onCreateCustom}
        />
      );

      // Press templates link
      fireEvent.press(getByLabelText('Browse habit templates'));

      expect(onBrowseTemplates).toHaveBeenCalledTimes(1);
      expect(onCreateCustom).not.toHaveBeenCalled();
    });

    it('should support multiple presses on the same link', () => {
      const onBrowseTemplates = jest.fn();
      const { getByLabelText } = render(
        <InlineHint {...defaultProps} onBrowseTemplates={onBrowseTemplates} />
      );

      const templatesLink = getByLabelText('Browse habit templates');

      fireEvent.press(templatesLink);
      fireEvent.press(templatesLink);
      fireEvent.press(templatesLink);

      expect(onBrowseTemplates).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility', () => {
    it('should have correct accessibility label for templates link', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);

      const templatesLink = getByLabelText('Browse habit templates');
      expect(templatesLink).toBeDefined();
    });

    it('should have correct accessibility label for custom options link', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);

      const customLink = getByLabelText('Create custom habit');
      expect(customLink).toBeDefined();
    });

    it('should have correct accessibility hint for templates link', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);

      const templatesLink = getByLabelText('Browse habit templates');
      expect(templatesLink.props.accessibilityHint).toBe(
        'Opens screen with pre-made habit templates'
      );
    });

    it('should have correct accessibility hint for custom options link', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);

      const customLink = getByLabelText('Create custom habit');
      expect(customLink.props.accessibilityHint).toBe(
        'Opens full habit creation screen'
      );
    });

    it('should have button role for templates link', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);

      const templatesLink = getByLabelText('Browse habit templates');
      expect(templatesLink.props.accessibilityRole).toBe('button');
    });

    it('should have button role for custom options link', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);

      const customLink = getByLabelText('Create custom habit');
      expect(customLink.props.accessibilityRole).toBe('button');
    });
  });

  describe('Touch Targets', () => {
    it('should have adequate touch target padding for templates link', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);

      const templatesLink = getByLabelText('Browse habit templates');

      // Check for padding (6px horizontal and vertical per spec)
      // The style function returns different values based on pressed state
      const styleWhenNotPressed = templatesLink.props.style({ pressed: false });
      expect(styleWhenNotPressed.paddingHorizontal).toBe(6);
      expect(styleWhenNotPressed.paddingVertical).toBe(6);
    });

    it('should have adequate touch target padding for custom options link', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);

      const customLink = getByLabelText('Create custom habit');

      // Check for padding (6px horizontal and vertical per spec)
      const styleWhenNotPressed = customLink.props.style({ pressed: false });
      expect(styleWhenNotPressed.paddingHorizontal).toBe(6);
      expect(styleWhenNotPressed.paddingVertical).toBe(6);
    });
  });

  describe('Press State Styling', () => {
    it('should apply pressed opacity to templates link when pressed', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);

      const templatesLink = getByLabelText('Browse habit templates');

      const styleWhenPressed = templatesLink.props.style({ pressed: true });
      expect(styleWhenPressed.opacity).toBe(0.7);
    });

    it('should apply normal opacity to templates link when not pressed', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);

      const templatesLink = getByLabelText('Browse habit templates');

      const styleWhenNotPressed = templatesLink.props.style({ pressed: false });
      expect(styleWhenNotPressed.opacity).toBe(1);
    });

    it('should apply pressed opacity to custom options link when pressed', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);

      const customLink = getByLabelText('Create custom habit');

      const styleWhenPressed = customLink.props.style({ pressed: true });
      expect(styleWhenPressed.opacity).toBe(0.7);
    });

    it('should apply normal opacity to custom options link when not pressed', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);

      const customLink = getByLabelText('Create custom habit');

      const styleWhenNotPressed = customLink.props.style({ pressed: false });
      expect(styleWhenNotPressed.opacity).toBe(1);
    });
  });

  describe('Layout', () => {
    it('should have correct container layout styles', () => {
      const { getByText } = render(<InlineHint {...defaultProps} />);

      // Get the container by finding a child and going up
      const baseText = getByText('or explore');
      const container = baseText.parent;

      expect(container?.props.style).toMatchObject({
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 16,
      });
    });

    it('should use flex layout for inline text flow', () => {
      const { getByText } = render(<InlineHint {...defaultProps} />);

      const baseText = getByText('or explore');
      const container = baseText.parent;

      // Verify flex properties that enable inline wrapping
      expect(container?.props.style.flexDirection).toBe('row');
      expect(container?.props.style.flexWrap).toBe('wrap');
    });
  });

  describe('Design System Compliance', () => {
    it('should use stone600 color from design system for base text', () => {
      const { getByText } = render(<InlineHint {...defaultProps} />);

      const baseText = getByText('or explore');
      expect(baseText.props.style.color).toBe(COLORS.stone600);
      expect(COLORS.stone600).toBe('#57534E');
    });

    it('should use emerald700 color from design system for link text', () => {
      const { getByText } = render(<InlineHint {...defaultProps} />);

      const templatesLink = getByText('templates');
      expect(templatesLink.props.style.color).toBe(COLORS.emerald700);
      expect(COLORS.emerald700).toBe('#047857');
    });

    it('should use 14px font size for all text', () => {
      const { getByText } = render(<InlineHint {...defaultProps} />);

      const baseText = getByText('or explore');
      const linkText = getByText('templates');

      expect(baseText.props.style.fontSize).toBe(14);
      expect(linkText.props.style.fontSize).toBe(14);
    });

    it('should use 21px line height for all text', () => {
      const { getByText } = render(<InlineHint {...defaultProps} />);

      const baseText = getByText('or explore');
      const linkText = getByText('templates');

      expect(baseText.props.style.lineHeight).toBe(21);
      expect(linkText.props.style.lineHeight).toBe(21);
    });
  });
});
