/** RowLabel — settings-row label, optional (?) help affordance, and subtitle */
import { View, Text } from 'react-native';
import { typography, fontWeights } from '@/theme/typography';
import type { SettingsRowProps } from '../SettingsRow.types';

interface RowLabelProps {
  label: SettingsRowProps['label'];
  subtitle?: SettingsRowProps['subtitle'];
  isInteractiveInfo: boolean;
  labelColor: string;
  secondaryTextColor: string;
  type: SettingsRowProps['type'];
}

export function RowLabel({
  label,
  subtitle,
  isInteractiveInfo,
  labelColor,
  secondaryTextColor,
  type,
}: RowLabelProps) {
  return (
    <View accessible={isInteractiveInfo ? false : undefined} className='flex-1'>
      <View className='flex-row items-center' style={{ gap: 6 }}>
        <Text
          accessibilityRole={isInteractiveInfo ? 'header' : undefined}
          numberOfLines={type === 'toggle' || type === 'navigation' ? 2 : 1}
          ellipsizeMode='tail'
          style={{
            ...typography.body,
            flexShrink: 1,
            fontWeight: fontWeights.semibold,
            color: labelColor,
          }}
        >
          {label}
        </Text>
      </View>
      {subtitle ? (
        <Text
          className='mt-1'
          numberOfLines={2}
          style={{ ...typography.caption, color: secondaryTextColor }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
