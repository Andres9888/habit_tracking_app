/**
 * The single post-add surface in the drill-down.
 *
 * It replaces the old two-surface state (an "Added" pill stacked above a
 * "Find another habit" link, plus an overlay toast saying the same thing a
 * third time). Confirmation and the two ways forward now live in one
 * persistent panel, so nothing competes and nothing is announced twice.
 *
 * Both actions name where they go. The primary uses the existing
 * exit-to-home contract (the header X) rather than opening Habit Detail —
 * see #1423 — so there is no modal-over-modal transition to sequence.
 *
 * `onKeepExploring` is optional on purpose: it must be the library-back
 * handler and nothing else. A caller that renders the preview with no library
 * behind it has no library to keep exploring, and aliasing it onto the generic
 * dismiss would silently give both buttons the same destination while the
 * secondary label kept promising a different one.
 */

import React from 'react';
import { Pressable, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { footerStyles } from '../styles';
import { useDetailPalette } from '../detailPalette';
import type { PressHandlers } from '../FullsizeTemplatePreview.types';
import { PostAddCommitHeader } from './PostAddCommitHeader';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PostAddCommitPanelProps {
  checkmarkAnimatedStyle: object;
  createPressHandlers: (
    scale: SharedValue<number>,
    scaleValue?: number
  ) => PressHandlers;
  primaryButtonScale: SharedValue<number>;
  primaryButtonStyle: object;
  secondaryButtonScale: SharedValue<number>;
  secondaryButtonStyle: object;
  successPanelStyle: object;
  templateName: string;
  onGoToToday: () => void;
  onKeepExploring?: () => void;
}

export function PostAddCommitPanel({
  checkmarkAnimatedStyle,
  createPressHandlers,
  primaryButtonScale,
  primaryButtonStyle,
  secondaryButtonScale,
  secondaryButtonStyle,
  successPanelStyle,
  templateName,
  onGoToToday,
  onKeepExploring,
}: PostAddCommitPanelProps) {
  const palette = useDetailPalette();
  const primaryLabel = `Go to Today and complete ${templateName}`;

  return (
    <Animated.View
      accessibilityLiveRegion='polite'
      testID='templates-preview-added'
      style={[
        footerStyles.successPanel,
        { backgroundColor: palette.card, borderColor: palette.border },
        successPanelStyle,
      ]}
    >
      <PostAddCommitHeader
        checkmarkAnimatedStyle={checkmarkAnimatedStyle}
        templateName={templateName}
      />
      <AnimatedPressable
        accessible
        accessibilityHint='Closes the habit library and returns to Today'
        accessibilityLabel={primaryLabel}
        accessibilityRole='button'
        testID='templates-preview-go-to-today'
        style={[
          footerStyles.successPrimaryButton,
          { backgroundColor: palette.addBg },
          primaryButtonStyle,
        ]}
        onPress={onGoToToday}
        {...createPressHandlers(primaryButtonScale)}
      >
        <Text
          maxFontSizeMultiplier={1.5}
          numberOfLines={2}
          style={[footerStyles.successPrimaryText, { color: palette.addFg }]}
        >
          {primaryLabel}
        </Text>
      </AnimatedPressable>
      {onKeepExploring ? (
        <AnimatedPressable
          accessible
          accessibilityHint='Returns to the habit library, which stays open'
          accessibilityLabel='Keep exploring habits'
          accessibilityRole='button'
          testID='templates-preview-keep-exploring'
          style={[footerStyles.customizeLink, secondaryButtonStyle]}
          onPress={onKeepExploring}
          {...createPressHandlers(secondaryButtonScale, 0.98)}
        >
          <Text
            style={[
              footerStyles.customizeLinkText,
              { color: palette.textSecondary },
            ]}
          >
            Keep exploring habits
          </Text>
        </AnimatedPressable>
      ) : null}
    </Animated.View>
  );
}
