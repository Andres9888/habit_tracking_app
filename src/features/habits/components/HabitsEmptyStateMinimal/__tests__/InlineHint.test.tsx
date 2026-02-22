/**
 * InlineHint Component Tests
 *
 * Tests for the templates bridge card and custom habit link:
 * - Prominent templates card renders correctly
 * - Secondary custom habit link renders
 * - Callback functions fire correctly on press
 * - Accessibility labels and hints are present
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import { COLORS, COPY } from '../constants';
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
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);
      expect(getByLabelText('Browse habit templates')).toBeDefined();
    });

    it('should render templates card with correct text', () => {
      const { getByText } = render(<InlineHint {...defaultProps} />);
      expect(getByText(COPY.browseTemplatesCard)).toBeDefined();
    });

    it('should render custom habit link', () => {
      const { getByText } = render(<InlineHint {...defaultProps} />);
      expect(getByText('✨ create a custom habit')).toBeDefined();
    });

    it('should render templates card with emerald700 text color', () => {
      const { getByText } = render(<InlineHint {...defaultProps} />);
      const cardText = getByText(COPY.browseTemplatesCard);
      expect(cardText.props.style).toMatchObject({
        color: COLORS.emerald700,
        fontSize: 14,
        fontWeight: '600',
      });
    });
  });

  describe('Button Press Behavior', () => {
    it('should call onBrowseTemplates when templates card is pressed', () => {
      const onBrowseTemplates = jest.fn();
      const { getByLabelText } = render(
        <InlineHint {...defaultProps} onBrowseTemplates={onBrowseTemplates} />
      );

      fireEvent.press(getByLabelText('Browse habit templates'));
      expect(onBrowseTemplates).toHaveBeenCalledTimes(1);
    });

    it('should call onCreateCustom when custom link is pressed', () => {
      const onCreateCustom = jest.fn();
      const { getByLabelText } = render(
        <InlineHint {...defaultProps} onCreateCustom={onCreateCustom} />
      );

      fireEvent.press(getByLabelText('Create custom habit'));
      expect(onCreateCustom).toHaveBeenCalledTimes(1);
    });

    it('should not call other callbacks when one button is pressed', () => {
      const onBrowseTemplates = jest.fn();
      const onCreateCustom = jest.fn();
      const { getByLabelText } = render(
        <InlineHint
          onBrowseTemplates={onBrowseTemplates}
          onCreateCustom={onCreateCustom}
        />
      );

      fireEvent.press(getByLabelText('Browse habit templates'));
      expect(onBrowseTemplates).toHaveBeenCalledTimes(1);
      expect(onCreateCustom).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have correct accessibility labels', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);
      expect(getByLabelText('Browse habit templates')).toBeDefined();
      expect(getByLabelText('Create custom habit')).toBeDefined();
    });

    it('should have correct accessibility hint for templates card', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);
      const card = getByLabelText('Browse habit templates');
      expect(card.props.accessibilityHint).toBe(
        'Opens screen with pre-made habit templates'
      );
    });

    it('should have correct accessibility hint for custom link', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);
      const link = getByLabelText('Create custom habit');
      expect(link.props.accessibilityHint).toBe(
        'Opens full habit creation screen'
      );
    });

    it('should have button role for both elements', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);
      expect(
        getByLabelText('Browse habit templates').props.accessibilityRole
      ).toBe('button');
      expect(
        getByLabelText('Create custom habit').props.accessibilityRole
      ).toBe('button');
    });
  });

  describe('Press State Styling', () => {
    it('should apply pressed styles to templates card', () => {
      const { UNSAFE_getByProps } = render(<InlineHint {...defaultProps} />);
      const card = UNSAFE_getByProps({
        accessibilityLabel: 'Browse habit templates',
      });

      const pressedStyle = card.props.style({ pressed: true });
      expect(pressedStyle.opacity).toBe(0.9);
      expect(pressedStyle.backgroundColor).toBe(COLORS.emerald100);
    });

    it('should apply normal styles to templates card when not pressed', () => {
      const { UNSAFE_getByProps } = render(<InlineHint {...defaultProps} />);
      const card = UNSAFE_getByProps({
        accessibilityLabel: 'Browse habit templates',
      });

      const normalStyle = card.props.style({ pressed: false });
      expect(normalStyle.opacity).toBe(1);
      expect(normalStyle.backgroundColor).toBe(COLORS.green50);
    });

    it('should apply pressed opacity to custom link', () => {
      const { UNSAFE_getByProps } = render(<InlineHint {...defaultProps} />);
      const link = UNSAFE_getByProps({
        accessibilityLabel: 'Create custom habit',
      });

      const pressedStyle = link.props.style({ pressed: true });
      expect(pressedStyle.opacity).toBe(0.7);
    });
  });

  describe('Layout', () => {
    it('should render "or explore" centered between two hairline rules', () => {
      const { getByTestId, getByText } = render(
        <InlineHint {...defaultProps} />
      );
      const divider = getByTestId('inline-hint-divider');
      const leftHairline = getByTestId('inline-hint-divider-line-left');
      const rightHairline = getByTestId('inline-hint-divider-line-right');
      const dividerText = getByText('or explore');

      expect(divider.props.style).toMatchObject({
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
      });
      expect(dividerText.props.style.textAlign).toBe('center');
      expect(leftHairline.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ flex: 1, height: 0.5 }),
        ])
      );
      expect(rightHairline.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ flex: 1, height: 0.5 }),
        ])
      );
    });

    it('should render templates card with card-style border radius', () => {
      const { UNSAFE_getByProps } = render(<InlineHint {...defaultProps} />);
      const card = UNSAFE_getByProps({
        accessibilityLabel: 'Browse habit templates',
      });

      const style = card.props.style({ pressed: false });
      expect(style.borderRadius).toBe(16);
      expect(style.borderWidth).toBe(1);
    });
  });

  describe('Design System Compliance', () => {
    it('should use emerald700 for templates card text', () => {
      const { getByText } = render(<InlineHint {...defaultProps} />);
      const cardText = getByText(COPY.browseTemplatesCard);
      expect(cardText.props.style.color).toBe(COLORS.emerald700);
    });

    it('should use stone500 for "or" text', () => {
      const { getByText } = render(<InlineHint {...defaultProps} />);
      // The "or" text is part of the parent Text node
      const orText = getByText(/^or /);
      expect(orText.props.style).toMatchObject({
        color: COLORS.stone500,
        fontSize: 13,
      });
    });
  });
});
