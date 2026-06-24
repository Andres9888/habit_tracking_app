import { Switch, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { airy } from '@/theme/airyScale';
import { typography, fontWeights } from '@/theme/typography';
import { SettingsCountBadge } from '../../SettingsCountBadge';
import type { SettingsRowColors } from '../SettingsRow.colors';
import type { SettingsRowProps } from '../SettingsRow.types';

interface RowAccessoryProps {
  type: SettingsRowProps['type'];
  value?: boolean | string;
  badge?: number;
  label: string;
  colors: SettingsRowColors;
  onToggle: (v: boolean) => void;
}

export function RowAccessory({
  type,
  value,
  badge,
  label,
  colors,
  onToggle,
}: RowAccessoryProps) {
  if (type === 'toggle') {
    return (
      <Switch
        accessibilityLabel={label}
        ios_backgroundColor={colors.switchTrackFalse}
        style={{ transform: [{ scale: airy.switchScale }] }}
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
          <SettingsCountBadge count={badge} />
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
