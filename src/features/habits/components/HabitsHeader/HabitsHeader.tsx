/** HabitsHeader - Minimal redesign per home-screen-redesign-spec.md */

import { View, Text } from 'react-native';
import { memo } from 'react';
import { useTemplateBadge } from '../../hooks/useTemplateBadge';
import type { HabitsHeaderProps } from './types';
import { AddHabitButton } from './AddHabitButton';
import { IconButtonGroup } from './IconButtonGroup';
import { ProBadge } from './ProBadge';
import { useHeaderAnimations } from './useHeaderAnimations';
import { useHeaderHandlers } from './useHeaderHandlers';
import { formatTodayDate } from './headerUtils';

const DATE_STYLE = {
  color: '#2D2A26',
  fontFamily: 'System',
  letterSpacing: -0.76,
};
const STREAK_STYLE = { color: '#C4BFB7', fontFamily: 'System' };

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
  const pct =
    totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  return (
    <View className='gap-2 px-4'>
      <View className='flex-row items-center justify-between'>
        <View className='flex-1 gap-1'>
          <Text className='text-3xl font-bold' style={DATE_STYLE}>
            {formatTodayDate()}
          </Text>
          {showCompletionSummary && (
            <Text
              accessibilityLabel={`${completedToday} completed, ${pct}%`}
              className='text-base'
              style={STREAK_STYLE}
            >
              🔥 {completedToday} total
            </Text>
          )}
        </View>
        <View className='flex-row items-center gap-2'>
          <AddHabitButton
            animatedStyle={anim.addButtonAnimatedStyle}
            onPress={h.handleAddHabitPress}
            onPressIn={h.handleAddHabitPressIn}
            onPressOut={h.handleAddHabitPressOut}
          />
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
    </View>
  );
}

export const HabitsHeader = memo(HabitsHeaderComponent);
export default HabitsHeader;
