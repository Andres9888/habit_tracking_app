/** HabitsHeader - OPTIMIZED: entry animation, contrast fix, clearer UX */

import { View, Text } from 'react-native';
import { memo } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTemplateBadge } from '../../hooks/useTemplateBadge';
import { DailyProgressRing } from '../../../../components/DailyProgressRing';
import type { HabitsHeaderProps } from './types';
import { IconButtonGroup } from './IconButtonGroup';
import { ProBadge } from './ProBadge';
import { useHeaderAnimations } from './useHeaderAnimations';
import { useHeaderHandlers } from './useHeaderHandlers';
import { useThemeColors } from '../../../../theme/ThemeContext';

const ENTERING = FadeInDown.duration(280).springify().damping(18);

const DATE_STYLE = {
  fontFamily: 'System',
  letterSpacing: -0.76,
};

/** Format today's date as "Today · Mon D" per spec */
const formatTodayDate = (): string => {
  const now = new Date();
  return `Today · ${now.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`;
};

// eslint-disable-next-line max-lines-per-function
function HabitsHeaderComponent(props: HabitsHeaderProps) {
  const {
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
  } = props;
  const { colors: themeColors } = useThemeColors();
  const { showBadge, dismissBadge } = useTemplateBadge({ totalHabits });
  const anim = useHeaderAnimations();
  const handlers = useHeaderHandlers({
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

  const iconGroup = (
    <IconButtonGroup
      settingsAnimatedStyle={anim.settingsButtonAnimatedStyle}
      showBadge={showBadge}
      sortAnimatedStyle={anim.sortButtonAnimatedStyle}
      templatesAnimatedStyle={anim.templatesButtonAnimatedStyle}
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
  );

  const rightSection = (
    <View className='flex-row items-center gap-2'>
      {!isPremiumUser && onUpgradePress && (
        <ProBadge onPress={onUpgradePress} />
      )}
      {iconGroup}
    </View>
  );

  // Empty state: show minimal header with icon group (templates accessible)
  if (totalHabits === 0 && !forceShow) {
    return (
      <Animated.View className='gap-2 px-4' entering={ENTERING}>
        <View className='flex-row items-center justify-end'>
          {rightSection}
        </View>
      </Animated.View>
    );
  }

  return (
    // OPTIMIZED: FadeInDown entry animation
    <Animated.View
      className='gap-2 px-4'
      entering={ENTERING}
    >
      <View className='flex-row items-center justify-between'>
        <View className='flex-row items-center gap-3 flex-1'>
          <DailyProgressRing completed={completedToday} total={totalHabits} />
          <View className='flex-1 gap-1'>
            <Text
              className='text-[22px] font-bold'
              style={[{ color: themeColors.text.primary }, DATE_STYLE]}
            >
              {formatTodayDate()}
            </Text>
            {showCompletionSummary && (
              <Text
                accessibilityLabel={`${completedToday} of ${totalHabits} completed`}
                className='text-[13px]'
                style={{ color: themeColors.text.secondary, fontFamily: 'System' }}
              >
                {completedToday} of {totalHabits} done
              </Text>
            )}
          </View>
        </View>
        {rightSection}
      </View>
    </Animated.View>
  );
}

export const HabitsHeader = memo(HabitsHeaderComponent);
export default HabitsHeader;
