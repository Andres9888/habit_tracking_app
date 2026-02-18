/**
 * HabitsHeader — minimal top header showing only the date.
 *
 * Action buttons (Templates, Settings, Add) and the progress ring
 * have moved to the BottomActionBar for better thumb reachability.
 */

import { Text } from 'react-native';
import { memo } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../../theme/ThemeContext';

const ENTERING = FadeInDown.duration(280).springify().damping(18);

const DATE_STYLE = {
  fontFamily: 'System',
  letterSpacing: -1,
};

/** Format today's date as "Today · Mon D" */
const formatTodayDate = (): string => {
  const now = new Date();
  return `Today · ${now.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`;
};

interface MinimalHeaderProps {
  /** Total number of habits — if 0 and forceShow is false, header is hidden */
  totalHabits?: number;
  /** Force show even when totalHabits is 0 (used during empty->list transition) */
  forceShow?: boolean;
}

function HabitsHeaderComponent({
  totalHabits = 0,
  forceShow = false,
}: MinimalHeaderProps) {
  const { colors: themeColors } = useThemeColors();

  if (totalHabits === 0 && !forceShow) {
    return null;
  }

  return (
    <Animated.View className='px-4' entering={ENTERING}>
      <Text
        className='text-[26px] font-extrabold'
        style={[{ color: themeColors.text.primary }, DATE_STYLE]}
      >
        {formatTodayDate()}
      </Text>
    </Animated.View>
  );
}

export const HabitsHeader = memo(HabitsHeaderComponent);
export default HabitsHeader;
