import { View } from 'react-native';
import { DailyMomentumMeter } from '../../../../components/DailyMomentumMeter';
import { useTemplateTooltip } from '../../hooks/useTemplateTooltip';
import { useTemplateBadge } from '../../hooks/useTemplateBadge';
import type { HabitsHeaderProps } from './types';
import { useHeaderAnimations } from './useHeaderAnimations';
import { useHeaderHandlers } from './useHeaderHandlers';
import { AddHabitButton } from './AddHabitButton';
import { IconButtonGroup } from './IconButtonGroup';
import { ProBadge } from './ProBadge';

export function HabitsHeader({
  completedToday = 0,
  forceShow = false,
  isPremiumUser = false,
  openCreateHabitScreen,
  openSettings,
  openSortSheet,
  openTemplatesScreen,
  onUpgradePress,
  reduceMotion = false,
  showCompletionSummary = true,
  totalHabits = 0,
}: HabitsHeaderProps) {
  const { dismissTooltip, showTooltip } = useTemplateTooltip();
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

  // Calculate completion percentage for accessibility
  const percentage =
    totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  // Smart Empty State - hide header completely when user has no habits
  if (totalHabits === 0 && !forceShow) {
    return null;
  }

  return (
    <View className='gap-2'>
      <View className='flex-row items-center justify-between'>
        <View className='flex-row items-center gap-3'>
          <AddHabitButton
            animatedStyle={animations.addButtonAnimatedStyle}
            onPress={handlers.handleAddHabitPress}
            onPressIn={handlers.handleAddHabitPressIn}
            onPressOut={handlers.handleAddHabitPressOut}
          />
          {!isPremiumUser && onUpgradePress && (
            <ProBadge onPress={onUpgradePress} />
          )}
        </View>
        <IconButtonGroup
          settingsAnimatedStyle={animations.settingsButtonAnimatedStyle}
          showBadge={showBadge}
          showTooltip={showTooltip}
          sortAnimatedStyle={animations.sortButtonAnimatedStyle}
          templatesAnimatedStyle={animations.templatesButtonAnimatedStyle}
          onDismissTooltip={dismissTooltip}
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

      {showCompletionSummary && (
        <View
          accessibilityLabel={`Today ${completedToday} of ${totalHabits} complete, ${percentage} percent`}
          accessibilityRole='text'
        >
          <DailyMomentumMeter
            completedToday={completedToday}
            reduceMotion={reduceMotion}
            size='standard'
            totalHabits={totalHabits}
          />
        </View>
      )}
    </View>
  );
}
