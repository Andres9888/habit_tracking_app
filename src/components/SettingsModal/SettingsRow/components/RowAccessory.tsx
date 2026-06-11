import { Switch, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { ChevronRight } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { typography, fontWeights } from '@/theme/typography';
import { durations, enterEasing } from '@/theme/animations';
import type { SettingsRowColors } from '../SettingsRow.colors';
import type { SettingsRowProps } from '../SettingsRow.types';

interface RowAccessoryProps {
  type: SettingsRowProps['type'];
  value?: boolean | string;
  badge?: number;
  label: string;
  colors: SettingsRowColors;
  themeColors: { surface: string; text: { secondary: string } };
  onToggle: (v: boolean) => void;
}

export function RowAccessory({
  type,
  value,
  badge,
  label,
  colors,
  themeColors,
  onToggle,
}: RowAccessoryProps) {
  if (type === 'toggle') {
    return (
      <Switch
        accessibilityLabel={label}
        ios_backgroundColor={colors.switchTrackFalse}
        thumbColor={colors.switchThumb}
        trackColor={{
          false: colors.switchTrackFalse,
          true: colors.switchTrackTrue,
        }}
        value={value as boolean}
        onValueChange={onToggle}
      />
    );
  }

  if (type === 'selection') {
    return (
      <View className='flex-row items-center gap-1'>
        <Text
          style={{
            ...typography.body,
            fontWeight: fontWeights.medium,
            color: colors.value,
          }}
        >
          {value as string}
        </Text>
        <ChevronRight
          color={colors.chevron}
          size={iconSizes.small}
          strokeWidth={2}
        />
      </View>
    );
  }

  if (type === 'info' && typeof value === 'string') {
    return (
      <Text
        className='ml-3'
        numberOfLines={1}
        style={{
          ...typography.bodySmall,
          fontWeight: fontWeights.medium,
          color: colors.value,
          flexShrink: 1,
          maxWidth: 140,
          textAlign: 'right',
        }}
      >
        {value}
      </Text>
    );
  }

  if (type === 'navigation') {
    return (
      <View className='flex-row items-center gap-2'>
        {badge != null && badge > 0 ? (
          <Animated.View
            className='min-w-[22px] items-center justify-center rounded-full px-1.5 py-0.5'
            entering={ZoomIn.duration(durations.enter).easing(enterEasing)}
            style={{ backgroundColor: themeColors.surface }}
          >
            <Text
              style={{
                ...typography.tabBar,
                fontWeight: fontWeights.bold,
                color: themeColors.text.secondary,
              }}
            >
              {badge}
            </Text>
          </Animated.View>
        ) : null}
        <ChevronRight
          color={colors.chevron}
          size={iconSizes.small}
          strokeWidth={2}
        />
      </View>
    );
  }

  return null;
}
