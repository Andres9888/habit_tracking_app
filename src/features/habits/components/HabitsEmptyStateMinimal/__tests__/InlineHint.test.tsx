/**
 * InlineHint Component Tests
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { InlineHint } from '../InlineHint';

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

describe('InlineHint', () => {
  const defaultProps = {
    onBrowseTemplates: jest.fn(),
    onCreateCustom: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders both actions and divider text', () => {
      const { getByText, getByLabelText } = render(
        <InlineHint {...defaultProps} />
      );

      expect(getByText('or explore')).toBeDefined();
      expect(getByText('browse templates')).toBeDefined();
      expect(getByText('✨ create custom')).toBeDefined();
      expect(getByLabelText('Browse habit templates')).toBeDefined();
      expect(getByLabelText('Create custom habit')).toBeDefined();
    });

    it('renders a gradient templates button with expected config', () => {
      const { UNSAFE_getByType } = render(<InlineHint {...defaultProps} />);
      const gradient = UNSAFE_getByType('LinearGradient');

      expect(gradient.props.colors).toEqual(['#047857', '#059669', '#10B981']);
      expect(gradient.props.start).toEqual({ x: 0, y: 0 });
      expect(gradient.props.end).toEqual({ x: 1, y: 0.3 });
    });
  });

  describe('Button Press Behavior', () => {
    it('calls onBrowseTemplates when templates action is pressed', () => {
      const onBrowseTemplates = jest.fn();
      const { getByLabelText } = render(
        <InlineHint {...defaultProps} onBrowseTemplates={onBrowseTemplates} />
      );

      fireEvent.press(getByLabelText('Browse habit templates'));
      expect(onBrowseTemplates).toHaveBeenCalledTimes(1);
    });

    it('calls onCreateCustom when custom action is pressed', () => {
      const onCreateCustom = jest.fn();
      const { getByLabelText } = render(
        <InlineHint {...defaultProps} onCreateCustom={onCreateCustom} />
      );

      fireEvent.press(getByLabelText('Create custom habit'));
      expect(onCreateCustom).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('uses button role and hints for both actions', () => {
      const { getByLabelText } = render(<InlineHint {...defaultProps} />);

      const browseButton = getByLabelText('Browse habit templates');
      const customButton = getByLabelText('Create custom habit');

      expect(browseButton.props.accessibilityRole).toBe('button');
      expect(customButton.props.accessibilityRole).toBe('button');
      expect(browseButton.props.accessibilityHint).toBe(
        'Opens screen with pre-made habit templates'
      );
      expect(customButton.props.accessibilityHint).toBe(
        'Opens full habit creation screen'
      );
    });
  });

  describe('Layout', () => {
    it('renders "or explore" centered between two hairline rules', () => {
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

    it('uses a full-width, 52px, 14px radius style for templates button', () => {
      const { UNSAFE_getByProps } = render(<InlineHint {...defaultProps} />);
      const templatesButton = UNSAFE_getByProps({
        accessibilityLabel: 'Browse habit templates',
      });

      const normalStyle = templatesButton.props.style({ pressed: false });
      const pressedStyle = templatesButton.props.style({ pressed: true });

      expect(normalStyle.width).toBe('100%');
      expect(normalStyle.height).toBe(52);
      expect(normalStyle.borderRadius).toBe(14);
      expect(normalStyle.opacity).toBe(1);
      expect(pressedStyle.opacity).toBe(0.85);
    });
  });
});
