/**
 * BottomActionBar — Three-zone layout with progress ring FAB.
 * Left: Ghost Settings pill · Center: Progress ring + FAB · Right: Gold Explore pill.
 */

import { memo } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Compass, Settings } from 'lucide-react-native';
import { colors as palette } from '../../../../theme/colors';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { useBarAnimations } from './useBarAnimations';
import { useCelebrationState } from './useCelebrationState';
import {
  useCelebrationAnimations,
  useProgressAnimation,
} from './useCelebrationAnimations';
import { PillButton } from './PillButton';
import { ProgressRingFAB } from './ProgressRingFAB';
import { styles } from './BottomActionBar.styles';
import type { BottomActionBarProps } from './types';

const ENTERING = FadeInUp.duration(320).springify().damping(18);
const BLUR_INTENSITY = 40;
const BORDER_LIGHT = 'rgba(221,216,210,0.45)';
const BORDER_DARK = 'rgba(55,65,81,0.3)';

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

  return (
    <Animated.View entering={ENTERING}>
      <BlurView intensity={BLUR_INTENSITY} tint={isDark ? 'dark' : 'light'}>
        <View
          style={[
            styles.container,
            {
              borderTopColor: isDark ? BORDER_DARK : BORDER_LIGHT,
              paddingBottom: Math.max(insets.bottom, 12),
            },
          ]}
        >
          <View style={styles.leftZone}>
            <Animated.View style={anim.settingsStyle}>
              <PillButton
                accessibilityLabel='Open settings'
                icon={
                  <Settings
                    color={colors.text.tertiary}
                    size={15}
                    strokeWidth={2.25}
                  />
                }
                label='Settings'
                labelColor={colors.text.tertiary}
                variant='ghost'
                onPress={props.onOpenSettings}
                onPressIn={anim.onSettingsPressIn}
                onPressOut={anim.onSettingsPressOut}
                pressOverlayStyle={anim.pillPressProgress}
              />
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
                totalHabits={props.totalHabits}
                onPress={props.onAddHabit}
                onPressIn={anim.onAddPressIn}
                onPressOut={anim.onAddPressOut}
              />
            </Animated.View>
          </View>

          <View style={styles.rightZone}>
            <Animated.View style={anim.templatesStyle}>
              <PillButton
                accessibilityLabel='Explore habit templates'
                icon={
                  <Compass
                    color={isDark ? palette.streak[300] : palette.streak[700]}
                    size={14}
                    strokeWidth={2.25}
                  />
                }
                label='Explore ›'
                labelColor={isDark ? palette.streak[300] : palette.streak[700]}
                variant='gold'
                onPress={props.onOpenTemplates}
                onPressIn={anim.onTemplatesPressIn}
                onPressOut={anim.onTemplatesPressOut}
                pressOverlayStyle={anim.pillPressProgress}
              />
            </Animated.View>
          </View>
        </View>
      </BlurView>
    </Animated.View>
  );
}

export const BottomActionBar = memo(BottomActionBarComponent);
