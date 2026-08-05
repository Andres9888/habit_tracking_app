import { Text } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { durations, enterEasing } from '@/theme/animations';
import { typography, fontWeights } from '@/theme/typography';
import { useThemeColors } from '../../theme/ThemeContext';

interface SettingsCountBadgeProps {
  count: number;
  animate?: boolean;
}

export function SettingsCountBadge({
  count,
  animate = true,
}: SettingsCountBadgeProps) {
  const { settings } = useThemeColors();

  return (
    <Animated.View
      key={count}
      className='min-w-[22px] items-center justify-center rounded-full px-1.5 py-0.5'
      entering={
        animate
          ? ZoomIn.duration(durations.enter).easing(enterEasing)
          : undefined
      }
      style={{ backgroundColor: settings.archive.bg }}
    >
      <Text
        style={{
          ...typography.tabBar,
          fontWeight: fontWeights.bold,
          color: settings.archive.icon,
        }}
      >
        {count}
      </Text>
    </Animated.View>
  );
}
