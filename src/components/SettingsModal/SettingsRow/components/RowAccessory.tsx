import { Text, View } from 'react-native';
import { typography, fontWeights } from '@/theme/typography';
import { AnimatedToggle } from './AnimatedToggle';
import { RowChevron } from './RowChevron';
import { SettingsCountBadge } from '../../SettingsCountBadge';
import type { SettingsRowColors } from '../SettingsRow.colors';
import type { SettingsRowProps } from '../SettingsRow.types';

interface RowAccessoryProps {
  type: SettingsRowProps['type'];
  value?: boolean | string;
  badge?: number;
  label: string;
  colors: SettingsRowColors;
  showChevron?: boolean;
  onToggle: (v: boolean) => void;
}

export function RowAccessory({
  type,
  value,
  badge,
  label,
  colors,
  showChevron,
  onToggle,
}: RowAccessoryProps) {
  if (type === 'toggle') {
    return (
      <AnimatedToggle
        label={label}
        thumb={colors.switchThumb}
        trackOff={colors.switchTrackFalse}
        trackOn={colors.switchTrackTrue}
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
        <RowChevron color={colors.chevron} />
      </View>
    );
  }

  if (type === 'info' && typeof value === 'string') {
    const valueText = (
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

    if (showChevron) {
      return (
        <View className='flex-row items-center gap-1'>
          {valueText}
          <RowChevron color={colors.chevron} />
        </View>
      );
    }

    return valueText;
  }

  if (type === 'navigation') {
    return (
      <View className='flex-row items-center gap-2'>
        {badge != null && badge > 0 ? (
          <SettingsCountBadge count={badge} />
        ) : null}
        <RowChevron color={colors.chevron} />
      </View>
    );
  }

  return null;
}
