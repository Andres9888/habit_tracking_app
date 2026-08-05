/**
 * BottomActionBar — Floating liquid glass capsule.
 * Left: Settings icon · Center: Progress ring + FAB · Right: Inspire icon.
 * The capsule floats above the bottom safe area with rounded ends.
 */

import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { BookOpen, Settings } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { colors as palette } from '../../../../theme/colors';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { useBarAnimations } from './useBarAnimations';
import { useCelebrationState } from './useCelebrationState';
import {
  useCelebrationAnimations,
  useProgressAnimation,
} from './useCelebrationAnimations';
import { ProgressRingFAB } from './ProgressRingFAB';
import {
  BLUR_INTENSITY,
  BORDER_DARK,
  BORDER_LIGHT,
  CAPSULE_SHADOW,
  ENTERING,
  ICON_BUTTON_HIT_SLOP,
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
        style={[
          styles.capsuleBorder,
          { borderColor: isDark ? BORDER_DARK : BORDER_LIGHT },
        ]}
        pointerEvents='none'
      />

      <View style={styles.contentRow}>
        <View style={styles.leftZone}>
          <Animated.View style={anim.settingsStyle}>
            <Pressable
              accessibilityLabel='Open settings'
              accessibilityRole='button'
              hitSlop={ICON_BUTTON_HIT_SLOP}
              testID='settings-button'
              style={styles.iconTouchArea}
              onPress={props.onOpenSettings}
              onPressIn={anim.onSettingsPressIn}
              onPressOut={anim.onSettingsPressOut}
            >
              <View style={styles.iconButton}>
                <Settings
                  color={colors.text.secondary}
                  size={iconSizes.large}
                  strokeWidth={2}
                />
              </View>
            </Pressable>
          </Animated.View>
        </View>

        <View style={styles.centerZone}>
          <Animated.View style={anim.addStyle}>
            <ProgressRingFAB
              celebrationAnim={celebrationAnim}
              completedToday={props.completedToday}
              isAllDone={isAllDone}
              justCompleted={justCompleted}
              progress={progress}
              ringPulse={anim.ringPulse}
              totalHabits={props.totalHabits}
              onPress={() => {
                anim.resetAddPress();
                props.onAddHabit();
              }}
              onPressIn={anim.onAddPressIn}
              onPressOut={anim.onAddPressOut}
            />
          </Animated.View>
        </View>

        <View style={styles.rightZone}>
          <Animated.View style={anim.templatesStyle}>
            <Pressable
              accessibilityLabel='Get inspired with habit templates'
              accessibilityRole='button'
              hitSlop={ICON_BUTTON_HIT_SLOP}
              testID='home-templates-button'
              style={styles.iconTouchArea}
              onPress={props.onOpenTemplates}
              onPressIn={anim.onTemplatesPressIn}
              onPressOut={anim.onTemplatesPressOut}
            >
              <View style={styles.iconButton}>
                <BookOpen
                  color={goldColor}
                  size={iconSizes.large}
                  strokeWidth={2}
                />
                <View style={styles.notifDot} />
              </View>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  );
}

export const BottomActionBar = memo(BottomActionBarComponent);
