import { View } from 'react-native';
import { AnimatedToggle } from './AnimatedToggle';
import { RowChevron } from './RowChevron';
import { RowCount } from './RowCount';
import { ValuePill } from './ValuePill';
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
        <ValuePill colors={colors} value={value as string} />
        <RowChevron color={colors.chevron} />
      </View>
    );
  }

  if (type === 'info' && typeof value === 'string') {
    const valueNode = (
      <View className='ml-3 shrink'>
        <ValuePill colors={colors} value={value} />
      </View>
    );

    if (showChevron) {
      return (
        <View className='flex-row items-center gap-1'>
          {valueNode}
          <RowChevron color={colors.chevron} />
        </View>
      );
    }

    return valueNode;
  }

  if (type === 'navigation') {
    return (
      <View className='flex-row items-center gap-2'>
        {badge != null && badge > 0 ? (
          <RowCount color={colors.valueText} count={badge} />
        ) : null}
        <RowChevron color={colors.chevron} />
      </View>
    );
  }

  return null;
}
