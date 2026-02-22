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
      expect(getByText('Build my own')).toBeDefined();
      expect(getByLabelText('Browse habit templates')).toBeDefined();
      expect(getByLabelText('Create custom habit')).toBeDefined();
    });

    it('renders 200+ badge with frosted-glass background', () => {
      const { getByText, getByTestId } = render(
        <InlineHint {...defaultProps} />
      );

      const badge = getByTestId('inline-hint-badge');
      const badgeText = getByText('200+');

      expect(badge.props.style).toMatchObject({
        backgroundColor: 'rgba(255,255,255,0.22)',
        borderRadius: 8,
        paddingHorizontal: 9,
        paddingVertical: 3,
      });
      expect(badgeText.props.style).toMatchObject({
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '800',
      });
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

  describe('Dark Mode', () => {
    it('uses rgba gradient colors for depth against dark backgrounds', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mod = require('../useEmptyStateColors');
      const spy = jest.spyOn(mod, 'useEmptyStateColors').mockReturnValue({
        gradientColors: [
          'rgba(4,120,87,0.85)',
          'rgba(5,150,105,0.85)',
          'rgba(16,185,129,0.85)',
        ],
        inputBorder: '#374151',
        isDark: true,
        textSecondary: '#D1D5DB',
        textTertiary: '#9CA3AF',
      });

      const { UNSAFE_getByType } = render(<InlineHint {...defaultProps} />);
      const gradient = UNSAFE_getByType('LinearGradient');

      // Dark mode gradient must use rgba for subtle transparency
      // DO NOT replace with opaque hex — rgba creates depth on dark bg
      expect(gradient.props.colors).toEqual([
        'rgba(4,120,87,0.85)',
        'rgba(5,150,105,0.85)',
        'rgba(16,185,129,0.85)',
      ]);

      spy.mockRestore();
    });

    it('uses emerald-400 accent stripe for visibility on dark backgrounds', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mod = require('../useEmptyStateColors');
      const spy = jest.spyOn(mod, 'useEmptyStateColors').mockReturnValue({
        accentStripeColor: '#34D399',
        gradientColors: [
          'rgba(4,120,87,0.85)',
          'rgba(5,150,105,0.85)',
          'rgba(16,185,129,0.85)',
        ],
        inputBorder: '#374151',
        isDark: true,
        textSecondary: '#D1D5DB',
        textTertiary: '#9CA3AF',
      });

      const { getByTestId } = render(<InlineHint {...defaultProps} />);
      const stripe = getByTestId('inline-hint-accent-stripe');

      // Dark mode uses emerald-400 (#34D399) instead of emerald-300 (#6EE7B7)
      // Deeper saturation maintains visibility on dark card backgrounds
      expect(stripe.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ backgroundColor: '#34D399' }),
        ])
      );

      spy.mockRestore();
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

    it('"Build my own" card has hardcoded white background, not theme token', () => {
      const { UNSAFE_getByProps } = render(<InlineHint {...defaultProps} />);
      const card = UNSAFE_getByProps({
        accessibilityLabel: 'Create custom habit',
      });

      const normalStyle = card.props.style({ pressed: false });
      const pressedStyle = card.props.style({ pressed: true });

      // Hardcoded white ensures card is visible against screen gradient
      // DO NOT replace with colors.inputBackground — it blends with bg
      expect(normalStyle.backgroundColor).toBe('#FFFFFF');
      expect(pressedStyle.backgroundColor).toBe('#F5F5F4');
      expect(normalStyle.borderRadius).toBe(12);
      expect(normalStyle.height).toBe(44);
      expect(normalStyle.width).toBe('100%');
    });

    it('"Build my own" label is 13px weight 600, not typography.caption (500)', () => {
      const { getByText } = render(<InlineHint {...defaultProps} />);
      const label = getByText('Build my own');

      // Guard against linter replacing with typography.caption (fontWeight 500)
      // This spec requires fontWeight '600' — caption's 500 is too light
      expect(label.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            fontSize: 13,
            fontWeight: '600',
            letterSpacing: -0.1,
          }),
        ])
      );
    });

    it('"Build my own" card has left accent stripe 3.5px wide emerald-300', () => {
      const { getByTestId } = render(<InlineHint {...defaultProps} />);
      const stripe = getByTestId('inline-hint-accent-stripe');

      // Accent stripe uses absolute positioning to avoid RN border-order issues
      // DO NOT replace with borderLeftWidth — it gets overridden by borderWidth: 1
      expect(stripe.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            borderRadius: 2,
            bottom: 0,
            left: 0,
            position: 'absolute',
            top: 0,
            width: 3.5,
          }),
          expect.objectContaining({
            backgroundColor: '#6EE7B7',
          }),
        ])
      );
    });

    it('"Build my own" card has subtle shadow, not shadows.subtle (0.04)', () => {
      const { UNSAFE_getByProps } = render(<InlineHint {...defaultProps} />);
      const card = UNSAFE_getByProps({
        accessibilityLabel: 'Create custom habit',
      });

      const normalStyle = card.props.style({ pressed: false });

      // Guard against linter replacing with shadows.subtle (opacity 0.04)
      // Opacity bumped to 0.06 for visibility on gradient background
      expect(normalStyle.shadowColor).toBe('#000000');
      expect(normalStyle.shadowOffset).toEqual({ height: 1, width: 0 });
      expect(normalStyle.shadowOpacity).toBe(0.06);
      expect(normalStyle.shadowRadius).toBe(3);
      expect(normalStyle.elevation).toBe(1);
    });

    it('has emerald-tinted drop shadow, not warm brown', () => {
      const { UNSAFE_getByProps } = render(<InlineHint {...defaultProps} />);
      const templatesButton = UNSAFE_getByProps({
        accessibilityLabel: 'Browse habit templates',
      });

      const normalStyle = templatesButton.props.style({ pressed: false });
      const pressedStyle = templatesButton.props.style({ pressed: true });

      // Guard against linter replacing with shadows.alert (#2D2A26)
      expect(normalStyle.shadowColor).toBe('#047857');
      expect(normalStyle.shadowOffset).toEqual({ height: 4, width: 0 });
      expect(normalStyle.shadowOpacity).toBe(0.3);
      expect(normalStyle.shadowRadius).toBe(16);
      expect(normalStyle.elevation).toBe(4);
      // Pressed state reduces shadow intensity
      expect(pressedStyle.shadowOpacity).toBe(0.15);
    });
  });
});
