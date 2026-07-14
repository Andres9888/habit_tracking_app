import { View } from 'react-native';
import Animated, { type SharedValue } from 'react-native-reanimated';
import { BookOpen, Settings } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { markSettingsOpenTap } from '../../../../lib/performance/settingsOpenTiming';
import { markTemplatesModalOpenIntent } from '../../templatesModalOpenPerformance';
import { ProgressRingFAB } from './ProgressRingFAB';
import { BarSideIcon } from './BarSideIcon';
import { styles } from './BottomActionBar.styles';
import type { BottomActionBarProps } from './types';
import type { useBarAnimations } from './useBarAnimations';
import type { useCelebrationAnimations } from './useCelebrationAnimations';

interface ContentProps extends BottomActionBarProps {
  anim: ReturnType<typeof useBarAnimations>;
  celebrationAnim: ReturnType<typeof useCelebrationAnimations>;
  goldColor: string;
  isAllDone: boolean;
  justCompleted: boolean;
  progress: SharedValue<number>;
  secondaryIconColor: string;
}

export function BottomActionBarContent({
  anim,
  celebrationAnim,
  completedToday,
  goldColor,
  isAllDone,
  justCompleted,
  progress,
  secondaryIconColor,
  totalHabits,
  onAddHabit,
  onOpenSettings,
  onOpenTemplates,
}: ContentProps) {
  return (
    <View style={styles.contentRow}>
      <View style={styles.leftZone}>
        <BarSideIcon
          accessibilityLabel='Open settings'
          animatedStyle={anim.settingsStyle}
          testID='settings-button'
          onPress={() => {
            markSettingsOpenTap();
            onOpenSettings();
          }}
          onPressIn={anim.onSettingsPressIn}
          onPressOut={anim.onSettingsPressOut}
        >
          <Settings
            color={secondaryIconColor}
            size={iconSizes.large}
            strokeWidth={2}
          />
        </BarSideIcon>
      </View>
      <View style={styles.centerZone}>
        <Animated.View style={anim.addStyle}>
          <ProgressRingFAB
            celebrationAnim={celebrationAnim}
            completedToday={completedToday}
            isAllDone={isAllDone}
            justCompleted={justCompleted}
            progress={progress}
            ringPulse={anim.ringPulse}
            totalHabits={totalHabits}
            onPress={() => {
              anim.resetAddPress();
              onAddHabit();
            }}
            onPressIn={anim.onAddPressIn}
            onPressOut={anim.onAddPressOut}
          />
        </Animated.View>
      </View>
      <View style={styles.rightZone}>
        <BarSideIcon
          accessibilityLabel='Get inspired with habit templates'
          animatedStyle={anim.templatesStyle}
          testID='home-templates-button'
          onPress={() => {
            markTemplatesModalOpenIntent('bottomActionBar');
            onOpenTemplates();
          }}
          onPressIn={anim.onTemplatesPressIn}
          onPressOut={anim.onTemplatesPressOut}
        >
          <BookOpen color={goldColor} size={iconSizes.large} strokeWidth={2} />
          <View style={styles.notifDot} />
        </BarSideIcon>
      </View>
    </View>
  );
}
