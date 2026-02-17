/* eslint-disable max-lines */
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
import { t, i18nMonthNameShort } from '@/i18n';

const ENTERING = FadeInDown.duration(280).springify().damping(18);

// FIXED: #78716c has 4.5:1+ contrast (was #C4BFB7 at 2.8:1)
const STREAK_STYLE = { color: '#78716c', fontFamily: 'System' };
const DATE_STYLE = {
  fontFamily: 'System',
  letterSpacing: -0.76,
};

/** Format today's date as "Today · Mon D" per spec */
const formatTodayDate = (): string => {
  const now = new Date();
  const month = i18nMonthNameShort(now.getMonth());
  const day = now.getDate();
  return `${t('dateTime.today')} · ${month} ${day}`;
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

  // Empty state: hide header entirely (templates accessible from empty state)
  if (totalHabits === 0 && !forceShow) {
    return null;
  }

  return (
    // OPTIMIZED: FadeInDown entry animation
    <Animated.View className='gap-2 px-4' entering={ENTERING}>
      <View className='flex-row items-center justify-between'>
        <View className='flex-1 flex-row items-center gap-3'>
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
                style={[{ color: themeColors.text.secondary }, STREAK_STYLE]}
              >
                {`${completedToday} ${t('common.of')} ${totalHabits} ${t('common.doneLabel')}`}
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
