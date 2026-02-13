/** HabitsHeader - OPTIMIZED: entry animation, contrast fix, clearer UX */

import { View, Text } from 'react-native';
import { memo } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTemplateBadge } from '../../hooks/useTemplateBadge';
import { DailyProgressRing } from '../../../../components/DailyProgressRing';
import type { HabitsHeaderProps } from './types';
import { AddHabitButton } from './AddHabitButton';
import { IconButtonGroup } from './IconButtonGroup';
import { ProBadge } from './ProBadge';
import { useHeaderAnimations } from './useHeaderAnimations';
import { useHeaderHandlers } from './useHeaderHandlers';

const DATE_STYLE = {
  color: '#1c1917',
  fontFamily: 'System',
  letterSpacing: -0.76,
};
// FIXED: #78716c has 4.5:1+ contrast (was #C4BFB7 at 2.8:1)
const STREAK_STYLE = { color: '#78716c', fontFamily: 'System' };

/** Format today's date as "Today · Mon D" per spec */
const formatTodayDate = (): string => {
  const d = new Date();
  return `Today · ${d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`;
};

function HabitsHeaderComponent({
  completedToday = 0,
  forceShow = false,
  isPremiumUser = false,
  openCreateHabitScreen,
  openSettings,
  openSortSheet,
  openTemplatesScreen,
  onUpgradePress,
  showCompletionSummary = true,
  totalHabits = 0,
}: HabitsHeaderProps) {
  const { showBadge, dismissBadge } = useTemplateBadge({ totalHabits });
  const anim = useHeaderAnimations();
  const h = useHeaderHandlers({
    addButtonScale: anim.addButtonScale,
    dismissBadge,
    openCreateHabitScreen,
    openSettings,
    openSortSheet,
    openTemplatesScreen,
    settingsButtonScale: anim.settingsButtonScale,
    sortButtonScale: anim.sortButtonScale,
    templatesButtonScale: anim.templatesButtonScale,
  });

  if (totalHabits === 0 && !forceShow) return null;

  return (
    // OPTIMIZED: FadeInDown entry animation
    <Animated.View
      className='gap-2 px-4'
      entering={FadeInDown.duration(280).springify().damping(18)}
    >
      <View className='flex-row items-center justify-between'>
        <View className='flex-row items-center gap-3 flex-1'>
          <DailyProgressRing completed={completedToday} total={totalHabits} />
          <View className='flex-1 gap-1'>
            <Text className='text-[22px] font-bold' style={DATE_STYLE}>
              {formatTodayDate()}
            </Text>
            {showCompletionSummary && (
              <Text
                accessibilityLabel={`${completedToday} of ${totalHabits} completed`}
                className='text-[13px]'
                style={STREAK_STYLE}
              >
                {completedToday} of {totalHabits} done
              </Text>
            )}
          </View>
        </View>
        <View className='flex-row items-center gap-2'>
          {!isPremiumUser && onUpgradePress && (
            <ProBadge onPress={onUpgradePress} />
          )}
          <IconButtonGroup
            settingsAnimatedStyle={anim.settingsButtonAnimatedStyle}
            showBadge={showBadge}
            sortAnimatedStyle={anim.sortButtonAnimatedStyle}
            templatesAnimatedStyle={anim.templatesButtonAnimatedStyle}
            onSettingsPress={h.handleSettingsPress}
            onSettingsPressIn={h.handleSettingsPressIn}
            onSettingsPressOut={h.handleSettingsPressOut}
            onSortPress={h.handleSortPress}
            onSortPressIn={h.handleSortPressIn}
            onSortPressOut={h.handleSortPressOut}
            onTemplatesPress={h.handleTemplatesPress}
            onTemplatesPressIn={h.handleTemplatesPressIn}
            onTemplatesPressOut={h.handleTemplatesPressOut}
          />
        </View>
      </View>
    </Animated.View>
  );
}

export const HabitsHeader = memo(HabitsHeaderComponent);
export default HabitsHeader;
