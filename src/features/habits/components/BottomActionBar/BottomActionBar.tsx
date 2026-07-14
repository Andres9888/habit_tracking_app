/**
 * BottomActionBar — Floating liquid glass capsule.
 * Left: Settings · Center: Progress FAB · Right: Habit Library.
 */

import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { colors as palette } from '../../../../theme/colors';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { useBarAnimations } from './useBarAnimations';
import { useCelebrationState } from './useCelebrationState';
import {
  useCelebrationAnimations,
  useProgressAnimation,
} from './useCelebrationAnimations';
import { BottomActionBarContent } from './BottomActionBarContent';
import {
  BLUR_INTENSITY,
  BORDER_DARK,
  BORDER_LIGHT,
  CAPSULE_SHADOW,
  ENTERING,
  styles,
} from './BottomActionBar.styles';
import type { BottomActionBarProps } from './types';

function BottomActionBarComponent(props: BottomActionBarProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeColors();
  const anim = useBarAnimations();
  const { isAllDone, justCompleted } = useCelebrationState(
    props.completedToday,
    props.totalHabits,
    props.reduceMotion
  );
  const celebrationAnim = useCelebrationAnimations(
    isAllDone,
    justCompleted,
    props.reduceMotion
  );
  const progress = useProgressAnimation(
    props.completedToday,
    props.totalHabits,
    props.reduceMotion
  );
  const goldColor = isDark ? palette.streak[300] : palette.streak[700];
  const borderColor = isDark ? BORDER_DARK : BORDER_LIGHT;

  return (
    <Animated.View
      entering={ENTERING}
      style={[
        styles.wrapper,
        CAPSULE_SHADOW,
        { marginBottom: Math.max(insets.bottom, 16) },
      ]}
    >
      <View style={styles.glassBg} pointerEvents='none'>
        <BlurView
          intensity={BLUR_INTENSITY}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <View
        style={[styles.capsuleBorder, { borderColor }]}
        pointerEvents='none'
      />
      <BottomActionBarContent
        {...props}
        anim={anim}
        celebrationAnim={celebrationAnim}
        goldColor={goldColor}
        isAllDone={isAllDone}
        justCompleted={justCompleted}
        progress={progress}
        secondaryIconColor={colors.text.secondary}
      />
    </Animated.View>
  );
}

export const BottomActionBar = memo(BottomActionBarComponent);
