/**
 * TodaysFocusCard Component
 *
 * Provides immediate, contextual motivation at the top of Progress tab.
 * Displays different states based on user's current progress and streak.
 *
 * @see docs/specs/habit-details-screen/progress-tab-improvements-spec.md
 */

import React from 'react';
import { View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import type { TodaysFocusCardProps } from '../TodaysFocusCardTypes';

import { styles } from './TodaysFocusCard.styles';
import { ConfettiBurst } from './components/ConfettiBurst';
import { FocusIcon } from './components/FocusIcon';
import { FocusTextContent } from './components/FocusTextContent';
import { ShareButton } from './components/ShareButton';
import { DismissButton } from './components/DismissButton';
import {
  useFocusState,
  useFocusAnimations,
  useCelebrationEffects,
} from './hooks';

export const TodaysFocusCard = React.memo(function TodaysFocusCard(
  props: TodaysFocusCardProps
) {
  const { currentStreak, onMilestoneCelebrated, onShare } = props;
  const reduceMotion = useReducedMotion();

  const focusStateResult = useFocusState(props);
  const animations = useFocusAnimations(reduceMotion);
  const celebration = useCelebrationEffects(
    focusStateResult.focusState,
    reduceMotion,
    animations.badgeScale,
    animations.shareButtonOpacity,
    currentStreak,
    onMilestoneCelebrated,
    onShare
  );

  const { focusState, config, celebrationConfig } = focusStateResult;

  return (
    <Animated.View
      accessibilityLabel={focusStateResult.accessibilityLabel}
      accessibilityRole='text'
      style={[styles.container, animations.containerAnimatedStyle]}
    >
      <ConfettiBurst isActive={celebration.showConfetti} />
      <LinearGradient
        colors={config.gradientColors}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={styles.gradient}
      >
        {reduceMotion ? null : <Animated.View
            style={[styles.shimmerOverlay, animations.shimmerAnimatedStyle]}
          >
            <LinearGradient
              colors={['transparent', 'rgba(255,255,255,0.4)', 'transparent']}
              end={{ x: 1, y: 0.5 }}
              start={{ x: 0, y: 0.5 }}
              style={styles.shimmerGradient}
            />
          </Animated.View>}

        <View style={styles.content}>
          <FocusIcon
            badgeAnimatedStyle={animations.badgeAnimatedStyle}
            celebrationConfig={celebrationConfig}
            config={config}
            focusState={focusState}
          />
          <FocusTextContent {...focusStateResult} reduceMotion={reduceMotion} />
          <ShareButton
            focusState={focusState}
            iconColor={config.iconColor}
            shareButtonAnimatedStyle={animations.shareButtonAnimatedStyle}
            onPress={celebration.handleSharePress}
            onShare={onShare}
          />
        </View>

        <DismissButton
          focusState={focusState}
          subTextColor={config.subTextColor}
          onMilestoneCelebrated={onMilestoneCelebrated}
          onPress={celebration.handleCelebrationAcknowledge}
        />
      </LinearGradient>
    </Animated.View>
  );
});

export default TodaysFocusCard;
