/**
 * InlineHint Component Tests
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import {
  CARD_PRESS_SCALE,
  CARD_REST_SCALE,
} from '../../../../../utils/animations/cardPressAnimation';
import { INLINE_HINT_STAGGER_MS, KEYBOARD_LAYOUT } from '../animations';
import { InlineHint } from '../InlineHint';

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

const mockHapticTrigger = jest.fn();
jest.mock('../../../../../utils/haptics', () => ({
  useHaptics: () => ({
    isActive: true,
    trigger: mockHapticTrigger,
    triggerAsync: jest.fn(),
  }),
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
      // Badge text color comes from theme hook (ctaText), not hardcoded
      // Style is an array: [badgeTextStyle, { color: ctaText }]
      expect(badgeText.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ fontSize: 11, fontWeight: '800' }),
          expect.objectContaining({ color: '#ffffff' }),
        ])
      );
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

    it('has onPressIn/onPressOut handlers for press scale animation on both CTAs', () => {
      const { UNSAFE_getByProps } = render(<InlineHint {...defaultProps} />);

      const templates = UNSAFE_getByProps({
        accessibilityLabel: 'Browse habit templates',
      });
      const card = UNSAFE_getByProps({
        accessibilityLabel: 'Create custom habit',
      });

      // Both CTAs must have press handlers for 0.97x scale animation
      // DO NOT remove — these drive the spring-animated press feedback
      expect(typeof templates.props.onPressIn).toBe('function');
      expect(typeof templates.props.onPressOut).toBe('function');
      expect(typeof card.props.onPressIn).toBe('function');
      expect(typeof card.props.onPressOut).toBe('function');
    });

    it('triggers light haptic on Browse templates pressIn', () => {
      const { UNSAFE_getByProps } = render(<InlineHint {...defaultProps} />);
      const templates = UNSAFE_getByProps({
        accessibilityLabel: 'Browse habit templates',
      });

      // Light haptic ('tap') fires on pressIn for tactile CTA feedback
      // DO NOT change to 'selection' — 'tap' is the correct light impact
      fireEvent(templates, 'pressIn');
      expect(mockHapticTrigger).toHaveBeenCalledWith('tap');
    });

    it('triggers selection haptic on Build my own pressIn', () => {
      mockHapticTrigger.mockClear();
      const { UNSAFE_getByProps } = render(<InlineHint {...defaultProps} />);
      const card = UNSAFE_getByProps({
        accessibilityLabel: 'Create custom habit',
      });

      // Selection haptic ('selection') fires on pressIn for subtle click feedback
      // DO NOT change to 'tap' — 'selection' is the correct ultra-light type
      fireEvent(card, 'pressIn');
      expect(mockHapticTrigger).toHaveBeenCalledWith('selection');
    });

    it('uses design system CARD_PRESS_SCALE (0.97) for press feedback', () => {
      // Guard: press scale must be 0.97 — the design system standard
      // DO NOT change — matches HabitCard press feel for consistency
      expect(CARD_PRESS_SCALE).toBe(0.97);
      expect(CARD_REST_SCALE).toBe(1);
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
        buildMyOwnCardBg: '#1F2937',
        buildMyOwnCardBgPressed: '#283548',
        ctaText: '#FFFFFF',
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
        buildMyOwnCardBg: '#1F2937',
        buildMyOwnCardBgPressed: '#283548',
        ctaText: '#FFFFFF',
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

    it('uses elevated surface card background distinguishable from screen', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mod = require('../useEmptyStateColors');
      const spy = jest.spyOn(mod, 'useEmptyStateColors').mockReturnValue({
        accentStripeColor: '#34D399',
        buildMyOwnCardBg: '#1F2937',
        buildMyOwnCardBgPressed: '#283548',
        ctaText: '#FFFFFF',
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

      const { UNSAFE_getByProps } = render(<InlineHint {...defaultProps} />);
      const card = UNSAFE_getByProps({
        accessibilityLabel: 'Create custom habit',
      });

      const normalStyle = card.props.style({ pressed: false });
      const pressedStyle = card.props.style({ pressed: true });

      // Dark mode uses gray-800 (#1F2937) elevated above screen bg (#111827)
      // DO NOT use #FFFFFF — white card on dark bg is visually jarring
      expect(normalStyle.backgroundColor).toBe('#1F2937');
      expect(pressedStyle.backgroundColor).toBe('#283548');

      spy.mockRestore();
    });

    it('adapts all text colors via theme hook in dark mode', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mod = require('../useEmptyStateColors');
      const spy = jest.spyOn(mod, 'useEmptyStateColors').mockReturnValue({
        accentStripeColor: '#34D399',
        buildMyOwnCardBg: '#1F2937',
        buildMyOwnCardBgPressed: '#283548',
        ctaText: '#FFFFFF',
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

      const { getByText } = render(<InlineHint {...defaultProps} />);

      // "or explore" divider uses textSecondary from hook
      const dividerText = getByText('or explore');
      expect(dividerText.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ color: '#D1D5DB' })])
      );

      // "browse templates" label uses ctaText from hook
      const browseLabel = getByText('browse templates');
      expect(browseLabel.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ color: '#FFFFFF' })])
      );

      // "200+" badge uses ctaText from hook
      const badgeLabel = getByText('200+');
      expect(badgeLabel.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ color: '#FFFFFF' })])
      );

      // "Build my own" label uses textSecondary from hook
      const buildLabel = getByText('Build my own');
      expect(buildLabel.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ color: '#D1D5DB' })])
      );

      // Arrow uses textTertiary from hook
      const arrow = getByText('→');
      expect(arrow.props.style.color).toBe('#9CA3AF');

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
      expect(dividerText.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ textAlign: 'center' }),
        ])
      );
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

    it('has 8px gap between gradient button and Build my own card', () => {
      const { getByTestId } = render(<InlineHint {...defaultProps} />);
      const actionsColumn = getByTestId('inline-hint-actions');

      // Gap of 8px matches design spec spacing between the two CTAs
      // DO NOT change — this is the spec-defined inter-CTA spacing
      expect(actionsColumn.props.style).toMatchObject({ gap: 8 });
    });

    it('both buttons are full-width within the actions column', () => {
      const { getByTestId, UNSAFE_getByProps } = render(
        <InlineHint {...defaultProps} />
      );

      const actionsColumn = getByTestId('inline-hint-actions');
      expect(actionsColumn.props.style).toMatchObject({ width: '100%' });

      const templates = UNSAFE_getByProps({
        accessibilityLabel: 'Browse habit templates',
      });
      expect(templates.props.style({ pressed: false }).width).toBe('100%');

      const card = UNSAFE_getByProps({
        accessibilityLabel: 'Create custom habit',
      });
      expect(card.props.style({ pressed: false }).width).toBe('100%');
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

    it('keyboard animation maxHeight accommodates full CTA section', () => {
      // InlineHint needs ~148px (divider 28 + button 52 + gap 8 + card 44 + margin 16)
      // maxHeight must be >= 200 to prevent clipping when keyboard is hidden
      // DO NOT reduce below 200 — the CTA section will be cropped
      expect(KEYBOARD_LAYOUT.secondaryLinksMaxHeight).toBeGreaterThanOrEqual(
        200
      );
    });

    it('fits on small screens (iPhone SE) without overflow', () => {
      // iPhone SE: 375pt - 48pt paddingHorizontal = 327pt available
      // Verify no element uses a fixed width that could overflow
      const { getByTestId, UNSAFE_getByProps } = render(
        <InlineHint {...defaultProps} />
      );

      const actionsColumn = getByTestId('inline-hint-actions');
      expect(actionsColumn.props.style.width).toBe('100%');

      const templates = UNSAFE_getByProps({
        accessibilityLabel: 'Browse habit templates',
      });
      expect(templates.props.style({ pressed: false }).width).toBe('100%');

      const card = UNSAFE_getByProps({
        accessibilityLabel: 'Create custom habit',
      });
      expect(card.props.style({ pressed: false }).width).toBe('100%');

      // Fixed heights must sum below maxHeight budget (200px)
      // divider ~28 + button 52 + gap 8 + card 44 + marginTop 16 = 148
      const buttonHeight = templates.props.style({ pressed: false }).height;
      const cardHeight = card.props.style({ pressed: false }).height;
      const gap = actionsColumn.props.style.gap;
      const totalFixed = buttonHeight + cardHeight + gap + 16 + 28;
      expect(totalFixed).toBeLessThan(KEYBOARD_LAYOUT.secondaryLinksMaxHeight);
    });

    it('uses ~100ms stagger gap between CTA entrance animations', () => {
      // Guard: stagger gap must be ~100ms for subtle cascade effect
      // "Browse templates" enters first, "Build my own" follows after this delay
      // DO NOT remove — the stagger creates a polished sequential reveal
      expect(INLINE_HINT_STAGGER_MS).toBe(100);
    });
  });
});
