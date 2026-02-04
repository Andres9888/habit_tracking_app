/**
 * HabitsHeader - Minimal redesign per home-screen-redesign-spec.md
 */

import { View, Text } from 'react-native';
import { memo } from 'react';
import { useTemplateBadge } from '../../hooks/useTemplateBadge';
import type { HabitsHeaderProps } from './types';
import { AddHabitButton } from './AddHabitButton';
import { IconButtonGroup } from './IconButtonGroup';
import { ProBadge } from './ProBadge';
import { useHeaderAnimations } from './useHeaderAnimations';
import { useHeaderHandlers } from './useHeaderHandlers';

function formatTodayDate(): string {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  return `Today · ${dateStr}`;
}

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
  const animations = useHeaderAnimations();
  const handlers = useHeaderHandlers({
    addButtonScale: animations.addButtonScale,
    dismissBadge,
    openCreateHabitScreen,
    openSettings,
    openSortSheet,
    openTemplatesScreen,
    settingsButtonScale: animations.settingsButtonScale,
    sortButtonScale: animations.sortButtonScale,
    templatesButtonScale: animations.templatesButtonScale,
  });

  if (totalHabits === 0 && !forceShow) return null;

  const percentage =
    totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  return (
    <View className='gap-2 px-4'>
      <View className='flex-row items-center justify-between'>
        <View className='flex-1 gap-1'>
          <Text 
            className='text-3xl font-bold'
            style={{ 
              fontFamily: 'PlusJakartaSans-Bold',
              color: '#2D2A26',
              letterSpacing: -0.76,
            }}
          >
            {formatTodayDate()}
          </Text>
          {showCompletionSummary && (
            <Text
              className='text-base'
              style={{
                fontFamily: 'SourceSans3-Regular',
                color: '#C4BFB7',
              }}
              accessibilityLabel={`${completedToday} of ${totalHabits}, ${percentage}%`}
            >
              {completedToday} of {totalHabits} complete
            </Text>
          )}
        </View>

        <View className='flex-row items-center gap-2'>
          <AddHabitButton
            animatedStyle={animations.addButtonAnimatedStyle}
            onPress={handlers.handleAddHabitPress}
            onPressIn={handlers.handleAddHabitPressIn}
            onPressOut={handlers.handleAddHabitPressOut}
          />
          {!isPremiumUser && onUpgradePress && (
            <ProBadge onPress={onUpgradePress} />
          )}
          <IconButtonGroup
            settingsAnimatedStyle={animations.settingsButtonAnimatedStyle}
            showBadge={showBadge}
            sortAnimatedStyle={animations.sortButtonAnimatedStyle}
            templatesAnimatedStyle={animations.templatesButtonAnimatedStyle}
            onSettingsPress={handlers.handleSettingsPress}
            onSettingsPressIn={handlers.handleSettingsPressIn}
            onSettingsPressOut={handlers.handleSettingsPressOut}
            onSortPress={handlers.handleSortPress}
            onSortPressIn={handlers.handleSortPressIn}
            onSortPressOut={handlers.handleSortPressOut}
            onTemplatesPress={handlers.handleTemplatesPress}
            onTemplatesPressIn={handlers.handleTemplatesPressIn}
            onTemplatesPressOut={handlers.handleTemplatesPressOut}
          />
        </View>
      </View>
    </View>
  );
}

export const HabitsHeader = memo(HabitsHeaderComponent);
export default HabitsHeader;
